'use client';
import { useEffect, useRef, useState } from 'react';
import { Zone } from '@/lib/types';
import { scoreToColor } from '@/lib/ecosystem-score';

interface OceanMapProps {
  zones: Zone[];
  selectedZone: Zone | null;
  adjustedScores: Record<string, number>;
  onSelectZone: (zone: Zone) => void;
}

export default function OceanMap({ zones, selectedZone, adjustedScores, onSelectZone }: OceanMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [L, setL] = useState<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    import('leaflet').then(leaflet => {
      setL(leaflet.default);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    const mapEl = mapRef.current;

    const map = L.map(mapEl, {
      center: [14.3, 74.7],
      zoom: 9,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(map);

    // Dark oceanic base tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      attribution: '© CartoDB © OpenStreetMap',
    }).addTo(map);

    mapInstanceRef.current = map;
  }, [L]);

  // Update markers
  useEffect(() => {
    if (!L || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    zones.forEach(zone => {
      const sc = adjustedScores[zone.id] ?? zone.ecosystemScore;
      const color = scoreToColor(sc);
      const isSelected = selectedZone?.id === zone.id;

      const svgIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            position:relative;
            display:flex;
            align-items:center;
            justify-content:center;
            width:${isSelected ? 64 : 48}px;
            height:${isSelected ? 64 : 48}px;
            transform:translate(-50%,-50%);
            cursor:pointer;
          ">
            <div style="
              position:absolute;
              inset:0;
              border-radius:50%;
              border:2px solid ${color};
              opacity:0.25;
              animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;
              background:${color};
            "></div>
            <div style="
              position:absolute;
              inset:8px;
              border-radius:50%;
              border:1.5px solid ${color}60;
              opacity:0.5;
            "></div>
            <div style="
              width:${isSelected ? 28 : 22}px;
              height:${isSelected ? 28 : 22}px;
              border-radius:50%;
              background:${color};
              box-shadow:0 0 ${isSelected ? 30 : 20}px ${color};
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:${isSelected ? 10 : 8}px;
              font-weight:700;
              color:#000;
              font-family:var(--font-syne,'sans-serif');
              position:relative;
              z-index:1;
            ">${sc}</div>
          </div>
        `,
        iconSize: [isSelected ? 64 : 48, isSelected ? 64 : 48],
        iconAnchor: [(isSelected ? 64 : 48) / 2, (isSelected ? 64 : 48) / 2],
      });

      const marker = L.marker([zone.coords[0], zone.coords[1]], { icon: svgIcon })
        .addTo(map)
        .on('click', () => onSelectZone(zone));

      // Tooltip
      const tooltipHtml = `
        <div style="
          background:rgba(0,8,20,0.95);
          border:1px solid ${color}40;
          border-left:3px solid ${color};
          padding:10px 14px;
          font-family:monospace;
          min-width:180px;
        ">
          <div style="font-size:11px;color:${color};letter-spacing:0.1em;margin-bottom:4px;text-transform:uppercase;">${zone.status}</div>
          <div style="font-size:14px;color:#fff;font-weight:700;margin-bottom:2px;">${zone.name}</div>
          <div style="font-size:10px;color:rgba(200,232,245,0.5);margin-bottom:6px;">${zone.district}</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:18px;font-weight:800;color:${color};">${sc}</span>
            <span style="font-size:10px;color:rgba(200,232,245,0.5);">/100 ecosystem score</span>
          </div>
          <div style="font-size:10px;color:rgba(255,45,85,0.8);margin-top:4px;">Regime shift: ${zone.regimeShiftProbability}%</div>
        </div>
      `;
      marker.bindTooltip(L.tooltip({ permanent: false, direction: 'right', offset: [20, 0], className: 'bw-tooltip' }).setContent(tooltipHtml));

      markersRef.current.push(marker);
    });
  }, [L, zones, selectedZone, adjustedScores, onSelectZone]);

  // Pan to selected
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedZone) return;
    mapInstanceRef.current.flyTo([selectedZone.coords[0], selectedZone.coords[1]], 11, { duration: 1 });
  }, [selectedZone]);

  // Lens overlay — Karnataka coastline bounding box highlight
  useEffect(() => {
    if (!L || !mapInstanceRef.current) return;
    const bounds = L.latLngBounds([[14.0, 74.0], [15.0, 75.2]]);
    const rect = L.rectangle(bounds, {
      color: 'rgba(0,212,255,0.15)',
      weight: 1,
      fillColor: 'rgba(0,212,255,0.03)',
      fillOpacity: 1,
      dashArray: '4 6',
    }).addTo(mapInstanceRef.current);
    return () => {
      if (mapInstanceRef.current) mapInstanceRef.current.removeLayer(rect);
    };
  }, [L]);

  return (
    <>
      <style>{`
        .leaflet-tooltip-pane { z-index: 701; }
        .bw-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .bw-tooltip .leaflet-tooltip-content { margin: 0; }
        .bw-tooltip::before { display: none !important; }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
