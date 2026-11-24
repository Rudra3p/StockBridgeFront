'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Search, Crosshair, Check, Loader2, X } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface SelectedLocationData {
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  lat: number;
  lng: number;
  displayName: string;
  area: string;
}

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (data: SelectedLocationData) => void;
  defaultCity?: string;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  city: string;
  state: string;
  postcode?: string;
  lat: number;
  lng: number;
  displayName: string;
  subText: string;
}

export default function LocationPickerMap({
  initialLat = 22.9984, // Ahmedabad/Vatva region default
  initialLng = 72.6315,
  onLocationSelect,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Store stable callback ref to prevent infinite re-render loops
  const onLocationSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Network request de-duplication and cancellation refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchAbortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastGeocodedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchNotice, setSearchNotice] = useState<string | null>(null);

  // Selected state
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocationData>({
    addressLine: 'Phase 4, GIDC Vatva Industrial Estate',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pinCode: '382445',
    lat: initialLat,
    lng: initialLng,
    displayName: 'Vatva Industrial Estate, Ahmedabad, Gujarat',
    area: 'Vatva',
  });

  const [unitOrPlot, setUnitOrPlot] = useState('');

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Extract clean structured data from Nominatim reverse geocode response
  const parseNominatimAddress = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rawAddress: any, lat: number, lng: number, displayName: string): SelectedLocationData => {
      // Split display name for fallback segments if raw fields are missing
      const displaySegments = displayName
        ? displayName.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const area =
        rawAddress.suburb ||
        rawAddress.industrial ||
        rawAddress.neighbourhood ||
        rawAddress.residential ||
        rawAddress.commercial ||
        rawAddress.quarter ||
        rawAddress.hamlet ||
        rawAddress.road ||
        rawAddress.locality ||
        rawAddress.city_district ||
        displaySegments[0] ||
        '';

      const city =
        rawAddress.city ||
        rawAddress.town ||
        rawAddress.village ||
        rawAddress.municipality ||
        rawAddress.city_district ||
        rawAddress.county ||
        rawAddress.state_district ||
        rawAddress.province ||
        rawAddress.district ||
        (displaySegments.length > 2 ? displaySegments[1] : displaySegments[0]) ||
        '';

      const state =
        rawAddress.state ||
        rawAddress.region ||
        rawAddress.province ||
        rawAddress.state_district ||
        (displaySegments.length > 2 ? displaySegments[displaySegments.length - 2] : '') ||
        '';

      const pinCode = rawAddress.postcode ? String(rawAddress.postcode).trim() : '';

      // Build clean business dispatch address
      const parts: string[] = [];
      if (rawAddress.road) parts.push(rawAddress.road);
      if (area && !parts.includes(area)) parts.push(area);
      if (rawAddress.industrial && !parts.includes(rawAddress.industrial)) {
        parts.push(rawAddress.industrial);
      }
      const baseAddress = parts.length > 0 ? parts.join(', ') : displaySegments[0] || area || `Hub at (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

      return {
        addressLine: baseAddress,
        city,
        state,
        pinCode,
        lat,
        lng,
        displayName: displayName || baseAddress,
        area: area || city || 'Dispatch Hub',
      };
    },
    []
  );

  // Debounced, deduplicated reverse geocode with AbortController
  const triggerReverseGeocode = useCallback(
    (lat: number, lng: number) => {
      // Check if coordinate is virtually identical to last fetched (less than ~20 meters)
      if (lastGeocodedCoordsRef.current) {
        const dLat = Math.abs(lat - lastGeocodedCoordsRef.current.lat);
        const dLng = Math.abs(lng - lastGeocodedCoordsRef.current.lng);
        if (dLat < 0.0002 && dLng < 0.0002) {
          return; // Skip redundant request
        }
      }

      // Clear any pending debounced timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        // Cancel any pending in-flight fetch
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsGeocoding(true);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
              signal: controller.signal,
              headers: {
                'Accept-Language': 'en-IN,en;q=0.9',
              },
            }
          );

          if (!response.ok) throw new Error('Geocoding rate limit or failure');
          const data = await response.json();
          const addressObj = data.address || {};
          const parsed = parseNominatimAddress(addressObj, lat, lng, data.display_name || '');

          lastGeocodedCoordsRef.current = { lat, lng };
          setSelectedLocation(parsed);
          onLocationSelectRef.current(parsed);
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') {
            return; // Normal cancellation
          }
          console.warn('Reverse geocode fallback:', err);
          const fallback: SelectedLocationData = {
            addressLine: `Dispatch Hub (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            city: '',
            state: '',
            pinCode: '',
            lat,
            lng,
            displayName: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            area: `Hub (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          };
          lastGeocodedCoordsRef.current = { lat, lng };
          setSelectedLocation(fallback);
          onLocationSelectRef.current(fallback);
        } finally {
          setIsGeocoding(false);
        }
      }, 350); // 350ms debounce
    },
    [parseNominatimAddress]
  );

  // Initialize MapLibre GL JS paired with OpenFreeMap Vector Tiles (ONLY ON MOUNT)
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const maplibregl = await import('maplibre-gl');

      if (isCancelled || !mapContainerRef.current) return;

      // Explicitly configure absolute workerUrl to eliminate Next.js Web Worker loading errors
      if (typeof window !== 'undefined') {
        try {
          maplibregl.setWorkerUrl(`${window.location.origin}/maplibre-gl-worker.mjs`);
        } catch (e) {
          console.warn('MapLibre worker setup:', e);
        }
      }

      // Custom SVG Marker Element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-maplibre-pin';
      markerEl.style.cursor = 'grab';
      markerEl.innerHTML = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(230, 92, 0, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <svg viewBox="0 0 24 24" width="34" height="34" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); position: relative; z-index: 10;">
            <path fill="#e65c00" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.8" fill="#ffffff" />
          </svg>
        </div>
      `;

      // MapLibre GL JS Instance paired with OpenFreeMap Bright Style
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [initialLng, initialLat],
        zoom: 14,
        pitch: 0,
        bearing: 0,
      });

      // Controls
      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      // Marker
      const marker = new maplibregl.Marker({
        element: markerEl,
        draggable: true,
        anchor: 'bottom',
      })
        .setLngLat([initialLng, initialLat])
        .addTo(map);

      // Trigger geocode only on Drag End
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        triggerReverseGeocode(lngLat.lat, lngLat.lng);
      });

      // Trigger geocode on single Map Click
      map.on('click', (e: { lngLat: { lng: number; lat: number } }) => {
        marker.setLngLat(e.lngLat);
        triggerReverseGeocode(e.lngLat.lat, e.lngLat.lng);
      });

      map.on('load', () => {
        if (!isCancelled) {
          setIsLoadingMap(false);
          map.resize();
        }
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Initial single reverse geocode
      triggerReverseGeocode(initialLat, initialLng);
    }

    initMap();

    return () => {
      isCancelled = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run strictly ONCE on mount

  // Google-like typo-tolerant fuzzy search combining Photon + Nominatim
  const performFuzzySearch = useCallback(
    async (queryText: string): Promise<LocationSuggestion[]> => {
      const trimmed = queryText.trim();
      if (!trimmed || trimmed.length < 2) return [];

      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }
      const controller = new AbortController();
      searchAbortControllerRef.current = controller;

      const results: LocationSuggestion[] = [];

      // Current center for geographic proximity bias
      const currentCenter = mapInstanceRef.current
        ? mapInstanceRef.current.getCenter()
        : { lng: initialLng, lat: initialLat };

      // 1. Primary: Photon geocoder with Elasticsearch fuzzy matching & Levenshtein typo tolerance
      try {
        const photonUrl = new URL('https://photon.komoot.io/api/');
        photonUrl.searchParams.set('q', trimmed);
        photonUrl.searchParams.set('limit', '8');
        photonUrl.searchParams.set('lat', currentCenter.lat.toString());
        photonUrl.searchParams.set('lon', currentCenter.lng.toString());

        const res = await fetch(photonUrl.toString(), {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.features && Array.isArray(data.features)) {
            // Sort India results to top
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sortedFeatures = data.features.sort((a: any, b: any) => {
              const aIn = a.properties?.country === 'India' || a.properties?.countrycode === 'IN' ? 1 : 0;
              const bIn = b.properties?.country === 'India' || b.properties?.countrycode === 'IN' ? 1 : 0;
              return bIn - aIn;
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const f of sortedFeatures) {
              const props = f.properties || {};
              const coords = f.geometry?.coordinates;
              if (!coords || coords.length < 2) continue;

              const lng = coords[0];
              const lat = coords[1];
              const name = props.name || props.street || props.district || props.city || trimmed;
              const city = props.city || props.county || props.district || '';
              const state = props.state || '';
              const postcode = props.postcode || '';
              const country = props.country || '';

              const subParts = [props.street, props.district, city, state, postcode, country].filter(Boolean);
              const uniqueSub = subParts.filter((item, index) => subParts.indexOf(item) === index);
              const subText = uniqueSub.join(', ');
              const displayName = `${name}${subText ? ', ' + subText : ''}`;

              results.push({
                id: `photon-${props.osm_id || Math.random()}`,
                name,
                city,
                state,
                postcode,
                lat,
                lng,
                displayName,
                subText,
              });
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return [];
        }
        console.warn('Photon fuzzy search error, fallbacking to Nominatim:', err);
      }

      // 2. Secondary fallback: Nominatim if Photon yielded no matches
      if (results.length === 0) {
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            trimmed
          )}&countrycodes=in&limit=6&addressdetails=1`;

          const res = await fetch(nomUrl, {
            signal: controller.signal,
            headers: {
              'Accept-Language': 'en-IN,en;q=0.9',
            },
          });

          if (res.ok) {
            const nomData = await res.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const item of nomData) {
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);
              const addr = item.address || {};
              const name = item.display_name.split(',')[0] || trimmed;
              const city = addr.city || addr.town || addr.village || addr.state_district || '';
              const state = addr.state || '';
              const postcode = addr.postcode || '';
              const subText = [addr.suburb || addr.industrial, city, state, postcode]
                .filter(Boolean)
                .join(', ');

              results.push({
                id: `nom-${item.place_id || Math.random()}`,
                name,
                city,
                state,
                postcode,
                lat,
                lng,
                displayName: item.display_name,
                subText,
              });
            }
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') {
            return [];
          }
          console.warn('Nominatim search error:', err);
        }
      }

      return results;
    },
    [initialLat, initialLng]
  );

  // Live debounced suggestions as user types
  const handleInputChange = (val: string) => {
    setSearchQuery(val);
    setSearchNotice(null);

    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }

    if (!val.trim() || val.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceTimerRef.current = setTimeout(async () => {
      const results = await performFuzzySearch(val);
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
      if (results.length === 0) {
        setSearchNotice(`No match found for "${val}". Check spelling or drag pin on map.`);
      } else {
        setSearchNotice(null);
      }
    }, 280);
  };

  // Select a suggestion and move map without any page reload
  const handleSelectSearchResult = (result: LocationSuggestion) => {
    const lat = result.lat;
    const lng = result.lng;

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        speed: 1.4,
      });
      markerRef.current.setLngLat([lng, lat]);
    }

    // Immediate optimistic update
    setSelectedLocation((prev) => ({
      ...prev,
      addressLine: result.name || result.displayName.split(',')[0],
      city: result.city || prev.city,
      state: result.state || prev.state,
      pinCode: result.postcode || prev.pinCode,
      lat,
      lng,
      displayName: result.displayName,
      area: result.name || prev.area,
    }));

    // Trigger detailed reverse geocode for complete verification
    triggerReverseGeocode(lat, lng);

    setShowSearchResults(false);
    setSearchQuery(result.name);
    setSearchNotice(null);
  };

  // Direct search action triggered by Enter key or Search button (STRICTLY PREVENTS PAGE RELOAD)
  const executeSearch = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // If suggestions are already loaded, select the first match immediately
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
      return;
    }

    setIsSearching(true);
    setSearchNotice(null);

    try {
      const results = await performFuzzySearch(trimmed);
      setSearchResults(results);

      if (results.length > 0) {
        handleSelectSearchResult(results[0]);
      } else {
        setShowSearchResults(true);
        setSearchNotice(`No results found for "${trimmed}". Try searching by industrial area or city name.`);
      }
    } catch (err) {
      console.error('Search execution failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search input
  const handleClearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchNotice(null);
  };

  // Locate Me using Browser Geolocation
  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            speed: 1.5,
          });
          markerRef.current.setLngLat([longitude, latitude]);
        }

        triggerReverseGeocode(latitude, longitude);
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS location error:', err.message);
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo({
            center: [72.6315, 22.9984],
            zoom: 15,
          });
          markerRef.current.setLngLat([72.6315, 22.9984]);
        }
        triggerReverseGeocode(22.9984, 72.6315);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  // When unit/plot is typed, update parent addressLine
  const handleUnitOrPlotChange = (val: string) => {
    setUnitOrPlot(val);
    const finalAddress = val.trim()
      ? `${val.trim()}, ${selectedLocation.addressLine}`
      : selectedLocation.addressLine;

    onLocationSelectRef.current({
      ...selectedLocation,
      addressLine: finalAddress,
    });
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Header Bar overlaying map (DIV ONLY - NO FORM TO PREVENT NESTED SUBMIT RELOAD) */}
      <div ref={searchContainerRef} className="relative z-20">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-white rounded-xl border border-slate-300 shadow-sm focus-within:border-[#e65c00] focus-within:ring-2 focus-within:ring-orange-100 overflow-hidden transition-all">
            <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0 || searchNotice) {
                  setShowSearchResults(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  executeSearch();
                } else if (e.key === 'Escape') {
                  setShowSearchResults(false);
                }
              }}
              placeholder="Search area, landmark or industrial estate (e.g. Vatva GIDC, Ahmedabad)..."
              className="w-full px-3 py-2.5 text-xs sm:text-sm font-quicksand font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 mr-1 text-slate-400 hover:text-slate-600 transition rounded-full hover:bg-slate-100"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isSearching && (
              <Loader2 className="w-4 h-4 text-[#e65c00] animate-spin mr-3 shrink-0" />
            )}

            {/* Search Action Button (STRICTLY type="button" - never triggers outer form submit) */}
            <button
              type="button"
              onClick={executeSearch}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-[#e65c00] hover:text-white text-slate-700 text-xs font-bold font-quicksand transition border-l border-slate-200 shrink-0"
            >
              Search
            </button>
          </div>

          {/* Quick Locate GPS Button (type="button") */}
          <button
            type="button"
            onClick={handleLocateMe}
            title="Use my current GPS location"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#e65c00] text-xs font-bold font-quicksand transition shadow-sm shrink-0"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Detect Location</span>
          </button>
        </div>

        {/* Autocomplete Google-like Suggestions Dropdown */}
        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden z-30 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
            {searchResults.length > 0 ? (
              searchResults.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectSearchResult(res);
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-quicksand hover:bg-orange-50/80 transition flex items-start gap-2.5 group cursor-pointer"
                >
                  <div className="p-1 rounded bg-orange-100/60 text-[#e65c00] group-hover:bg-[#e65c00] group-hover:text-white transition mt-0.5 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 group-hover:text-[#e65c00] transition truncate">
                      {res.name}
                    </div>
                    {res.subText && (
                      <div className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                        {res.subText}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : searchNotice ? (
              <div className="px-3.5 py-3 text-xs font-quicksand text-slate-500 bg-slate-50 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{searchNotice}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Interactive MapLibre GL JS Box with OpenFreeMap Vector Tiles */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl border-2 border-slate-200 overflow-hidden shadow-inner bg-slate-100">
        {isLoadingMap && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#e65c00]" />
            <span className="text-xs font-bold text-slate-600 font-quicksand">
              Loading OpenFreeMap Vector Layer...
            </span>
          </div>
        )}

        {/* MapLibre WebGL DOM Container */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Vector Engine Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
          OpenFreeMap • MapLibre GL
        </div>

        {/* Floating Instruction Pill on Map */}
        <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md text-white text-[11px] font-quicksand flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#ff7a1a]" />
          <span>Click anywhere or drag orange pin to set dispatch hub</span>
        </div>

        {isGeocoding && (
          <div className="absolute top-2.5 right-12 z-20 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow text-[11px] font-mono font-bold text-[#e65c00] flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Resolving Address...</span>
          </div>
        )}
      </div>

      {/* Auto-Structured Location Card */}
      <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/80 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e65c00] text-white mt-0.5 shadow-sm">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-quicksand flex items-center gap-2 flex-wrap">
                <span>Selected Dispatch Hub:</span>
                <span className="text-[#e65c00] font-extrabold">{selectedLocation.area || selectedLocation.city || selectedLocation.state || 'Selected Hub'}</span>
              </div>
              <p className="text-[11px] text-slate-600 font-quicksand mt-0.5 line-clamp-2">
                {selectedLocation.displayName || selectedLocation.addressLine}
              </p>
            </div>
          </div>
        </div>

        {/* Badges showing resolved address components (Only show if present) */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          {selectedLocation.area && (
            <span className="px-2 py-0.5 rounded bg-white border border-orange-200 text-orange-950 font-bold">
              Area: {selectedLocation.area}
            </span>
          )}
          {selectedLocation.city && (
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
              City: {selectedLocation.city}
            </span>
          )}
          {selectedLocation.state && (
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
              State: {selectedLocation.state}
            </span>
          )}
          {Boolean(selectedLocation.pinCode && selectedLocation.pinCode.trim()) && (
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
              PIN: {selectedLocation.pinCode}
            </span>
          )}
        </div>

        {/* Single Optional Building/Plot input */}
        <div className="pt-2 border-t border-orange-200/60 flex items-center gap-2">
          <label htmlFor="unitOrPlot" className="text-[11px] font-bold text-slate-700 shrink-0 font-quicksand">
            Plot / Unit / Shed No. (Optional):
          </label>
          <input
            id="unitOrPlot"
            type="text"
            value={unitOrPlot}
            onChange={(e) => handleUnitOrPlotChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            placeholder="e.g. Shed No. 42, Phase 4"
            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-quicksand text-slate-900 focus:outline-none focus:border-[#e65c00]"
          />
        </div>
      </div>
    </div>
  );
}
