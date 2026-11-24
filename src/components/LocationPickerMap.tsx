'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Search, Crosshair, Check, Loader2 } from 'lucide-react';
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

interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    industrial?: string;
    residential?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
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

  // Store stable callback ref to prevent infinite re-render loops
  const onLocationSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Network request de-duplication and cancellation refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastGeocodedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // Extract clean structured data from Nominatim reverse geocode response
  const parseNominatimAddress = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rawAddress: any, lat: number, lng: number, displayName: string): SelectedLocationData => {
      const area =
        rawAddress.suburb ||
        rawAddress.industrial ||
        rawAddress.neighbourhood ||
        rawAddress.residential ||
        rawAddress.road ||
        'Industrial Zone';

      const city =
        rawAddress.city ||
        rawAddress.town ||
        rawAddress.village ||
        rawAddress.county ||
        rawAddress.state_district ||
        'Ahmedabad';

      const state = rawAddress.state || 'Gujarat';
      const pinCode = rawAddress.postcode || '380001';

      // Build clean business dispatch address
      const parts: string[] = [];
      if (rawAddress.road) parts.push(rawAddress.road);
      if (area && area !== rawAddress.road) parts.push(area);
      if (rawAddress.industrial && !parts.includes(rawAddress.industrial)) {
        parts.push(rawAddress.industrial);
      }
      const baseAddress = parts.length > 0 ? parts.join(', ') : displayName.split(',')[0] || area;

      return {
        addressLine: baseAddress,
        city,
        state,
        pinCode,
        lat,
        lng,
        displayName,
        area,
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
            addressLine: `Industrial Hub, Coordinate (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            city: 'Ahmedabad',
            state: 'Gujarat',
            pinCode: '382445',
            lat,
            lng,
            displayName: `Coordinate ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            area: 'Industrial Hub',
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
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run strictly ONCE on mount

  // Handle Search using Nominatim API
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&countrycodes=in&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-IN,en;q=0.9',
          },
        }
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select search result
  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        speed: 1.4,
      });
      markerRef.current.setLngLat([lng, lat]);
    }

    const parsed = parseNominatimAddress(result.address || {}, lat, lng, result.display_name);
    lastGeocodedCoordsRef.current = { lat, lng };
    setSelectedLocation(parsed);
    onLocationSelectRef.current(parsed);

    setShowSearchResults(false);
    setSearchQuery(result.display_name.split(',').slice(0, 2).join(', '));
  };

  // Locate Me using Browser Geolocation
  const handleLocateMe = () => {
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
      {/* Search Header Bar overlaying map */}
      <div className="relative z-20">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="relative flex-1 flex items-center bg-white rounded-xl border border-slate-300 shadow-sm focus-within:border-[#e65c00] focus-within:ring-2 focus-within:ring-orange-100 overflow-hidden">
            <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!showSearchResults && searchResults.length > 0) setShowSearchResults(true);
              }}
              placeholder="Search area, landmark or industrial estate (e.g. Vatva GIDC, Ahmedabad)..."
              className="w-full px-3 py-2.5 text-xs sm:text-sm font-quicksand font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-[#e65c00] animate-spin mr-3 shrink-0" />
            )}
            <button
              type="submit"
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-quicksand transition border-l border-slate-200"
            >
              Search
            </button>
          </div>

          {/* Quick Locate GPS Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            title="Use my current GPS location"
            className="ml-2 flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#e65c00] text-xs font-bold font-quicksand transition shadow-sm shrink-0"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Detect Location</span>
          </button>
        </form>

        {/* Autocomplete Suggestions Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-30 max-h-56 overflow-y-auto divide-y divide-slate-100">
            {searchResults.map((res) => (
              <button
                key={res.place_id}
                type="button"
                onClick={() => handleSelectSearchResult(res)}
                className="w-full px-3.5 py-2.5 text-left text-xs font-quicksand hover:bg-orange-50/70 transition flex items-start gap-2 group"
              >
                <MapPin className="w-4 h-4 text-[#e65c00] mt-0.5 shrink-0" />
                <span className="text-slate-800 group-hover:text-[#e65c00] font-medium leading-relaxed">
                  {res.display_name}
                </span>
              </button>
            ))}
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
                <span className="text-[#e65c00] font-extrabold">{selectedLocation.area || selectedLocation.city}</span>
              </div>
              <p className="text-[11px] text-slate-600 font-quicksand mt-0.5 line-clamp-2">
                {selectedLocation.displayName || selectedLocation.addressLine}
              </p>
            </div>
          </div>
        </div>

        {/* Badges showing resolved address components */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-white border border-orange-200 text-orange-950 font-bold">
            Area: {selectedLocation.area || 'Vatva'}
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
            City: {selectedLocation.city}
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
            State: {selectedLocation.state}
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
            PIN: {selectedLocation.pinCode}
          </span>
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
            placeholder="e.g. Shed No. 42, Phase 4"
            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-quicksand text-slate-900 focus:outline-none focus:border-[#e65c00]"
          />
        </div>
      </div>
    </div>
  );
}
