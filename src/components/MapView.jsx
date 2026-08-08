import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useResQ } from '../context/ResQContext';
import { ShieldAlert, Radio, MapPin, Zap, CheckCircle } from 'lucide-react';

export default function MapView() {
  const { 
    clusters, 
    reports, 
    viewMode, 
    selectedIncident, 
    setSelectedIncident, 
    scenario,
    dispatchUnits,
    setIsResourceDrawerOpen
  } = useResQ();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = scenario?.center || [37.7749, -122.4194];

    // Dark Matter Map Tiles
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when scenario changes
  useEffect(() => {
    if (mapInstanceRef.current && scenario?.center) {
      mapInstanceRef.current.setView(scenario.center, 13);
    }
  }, [scenario]);

  // Focus map on selected incident
  useEffect(() => {
    if (mapInstanceRef.current && selectedIncident) {
      const coords = selectedIncident.centroid || selectedIncident.coordinates;
      if (coords) {
        mapInstanceRef.current.flyTo(coords, 15, { animate: true, duration: 1.2 });
      }
    }
  }, [selectedIncident]);

  // Render glowing custom HTML markers for Clusters or Individual Reports
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layerGroup = markersLayerRef.current;
    layerGroup.clearLayers();

    const itemsToRender = viewMode === 'CLUSTERS' ? clusters : reports;

    itemsToRender.forEach(item => {
      const coords = item.centroid || item.coordinates;
      if (!coords) return;

      const isCritical = item.severity >= 5;
      const isHigh = item.severity === 4;
      
      const badgeColor = isCritical 
        ? '#ef4444' 
        : isHigh 
        ? '#f59e0b' 
        : item.severity === 3 
        ? '#eab308' 
        : '#06b6d4';

      const pulseClass = isCritical ? 'animate-ping' : '';
      const displayCount = item.reportCount || 1;

      // Custom Glowing SVG HTML Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; items-center; justify-content: center;">
            ${isCritical ? `<div style="position: absolute; width: 36px; height: 36px; background-color: ${badgeColor}; opacity: 0.4; border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="
              width: 32px;
              height: 32px;
              background: #0f172a;
              border: 2px solid ${badgeColor};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: 800;
              font-size: 11px;
              box-shadow: 0 0 16px ${badgeColor}aa;
              cursor: pointer;
            ">
              ${displayCount > 1 ? displayCount : item.category ? item.category.charAt(0) : '!'}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(layerGroup);

      // Hazard Buffer Circle around critical clusters
      if (isCritical || isHigh) {
        L.circle(coords, {
          color: badgeColor,
          fillColor: badgeColor,
          fillOpacity: 0.12,
          radius: isCritical ? 600 : 350,
          weight: 1
        }).addTo(layerGroup);
      }

      // Popup Content HTML
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 240px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="background: ${badgeColor}22; color: ${badgeColor}; border: 1px solid ${badgeColor}66; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">
              SEVERITY ${item.severity}/5
            </span>
            <span style="color: #94a3b8; font-size: 10px;">${item.category}</span>
          </div>

          <div style="font-weight: 700; color: #f8fafc; font-size: 13px; margin-bottom: 4px; line-height: 1.2;">
            ${item.title || item.locationName}
          </div>

          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px; max-height: 50px; overflow: hidden; text-overflow: ellipsis;">
            ${item.rawText || (item.reports ? item.reports[0].rawText : '')}
          </div>

          ${item.combinedResources ? `
            <div style="margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 4px;">
              ${item.combinedResources.map(r => `<span style="background: #1e293b; color: #38bdf8; font-size: 9px; padding: 2px 5px; border-radius: 3px;">${r}</span>`).join('')}
            </div>
          ` : ''}

          <div style="display: flex; gap: 4px;">
            <button id="btn-select-${item.id}" style="flex: 1; background: #0284c7; color: white; border: none; padding: 5px; border-radius: 4px; font-size: 10px; font-weight: 700; cursor: pointer;">
              Focus & Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            marker.closePopup();
            setSelectedIncident(item);
          };
        }
      });
    });

  }, [clusters, reports, viewMode, setSelectedIncident]);

  return (
    <div className="relative w-full h-[450px] lg:h-full min-h-[400px] rounded-xl overflow-hidden border border-slate-800 glass-panel">
      
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center space-x-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
        <MapPin className="w-4 h-4 text-cyan-400" />
        <span className="font-semibold text-slate-200">Situational Emergency GIS Map</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[10px] text-slate-300 space-y-1 hidden sm:block">
        <div className="font-semibold text-slate-400 mb-1">INCIDENT SEVERITY</div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
          <span>Critical 5/5 (Immediate Evac / Threat)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>High 4/5 (Rescue / Fire / Power)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span>Medium 3/5 (Infrastructure / Support)</span>
        </div>
      </div>

      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
