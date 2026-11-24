'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

interface TransitRouteMapProps {
  lat: number;
  lon: number;
  city: string;
  state: string;
  address: string;
  buyerName?: string;
}

export default function TransitRouteMap({
  lat,
  lon,
  city,
  address,
  buyerName,
}: TransitRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const maplibregl = await import('maplibre-gl');

      if (isCancelled || !mapContainerRef.current) return;

      // Custom Pin Marker Element
      const el = document.createElement('div');
      el.className = 'buyer-maplibre-pin';
      el.innerHTML = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(230, 92, 0, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <svg viewBox="0 0 24 24" width="34" height="34" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); position: relative; z-index: 10;">
            <path fill="#e65c00" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.8" fill="#ffffff" />
          </svg>
        </div>
      `;

      // MapLibre GL map with OpenFreeMap vector tiles
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [lon, lat],
        zoom: 14,
        pitch: 20,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
          <strong style="color: #e65c00; font-size: 13px;">${buyerName || 'Buyer Commercial Warehouse'}</strong>
          <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">${city} Hub</p>
          <p style="margin: 2px 0 0; font-size: 10px; color: #64748b;">${address}</p>
        </div>
      `);

      new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(map);

      map.on('load', () => {
        if (!isCancelled) {
          setLoading(false);
          map.resize();
        }
      });

      mapInstanceRef.current = map;
    }

    init();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, city, address, buyerName]);

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#e65c00]" />
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

      <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-quicksand text-white flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-[#ff7a1a]" />
        <span>{city} Commercial Hub Destination</span>
      </div>
    </div>
  );
}
