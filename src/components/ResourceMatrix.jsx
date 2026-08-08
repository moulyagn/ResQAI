import React, { useState } from 'react';
import { useResQ } from '../context/ResQContext';
import { X, Box, Zap, HeartPulse, Ship, ShieldAlert, Home, Flame, Truck, Wrench, Send, CheckCircle, Navigation } from 'lucide-react';

export default function ResourceMatrix() {
  const { isResourceDrawerOpen, setIsResourceDrawerOpen, resources, clusters, dispatchUnits } = useResQ();

  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'DISPATCHED'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [targetIncidentId, setTargetIncidentId] = useState('');
  const [dispatchCount, setDispatchCount] = useState(1);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState(null);

  if (!isResourceDrawerOpen) return null;

  // Enriched resource inventory list with agency details and status mappings
  const enrichedResources = [
    {
      category: "Medical Team",
      title: "Emergency Trauma & Paramedic Teams",
      agency: "Metro EMS & General Hospital",
      totalQuantity: 24,
      deployed: 14,
      available: 10,
      unit: "Teams / Ambulances",
      status: "Available",
      location: "Central Trauma Depot (Bay St)"
    },
    {
      category: "Evacuation Boat",
      title: "Water Rescue & Shallow Inflatable Craft",
      agency: "Coast Guard & Water Patrol",
      totalQuantity: 12,
      deployed: 8,
      available: 4,
      unit: "Vessels",
      status: "In Transit",
      location: "Marina Pier 14"
    },
    {
      category: "Search & Rescue",
      title: "Heavy Urban Search & Rescue (USAR)",
      agency: "FEMA Task Force 1",
      totalQuantity: 10,
      deployed: 6,
      available: 4,
      unit: "Strike Teams",
      status: "Dispatched",
      location: "Downtown Staging Base"
    },
    {
      category: "Fire Engine",
      title: "High-Capacity Pumper & Ladder Trucks",
      agency: "Metro Fire Department",
      totalQuantity: 18,
      deployed: 11,
      available: 7,
      unit: "Engine Trucks",
      status: "Available",
      location: "Station 4 & Station 9"
    },
    {
      category: "Power Generator",
      title: "Mobile Emergency Diesel Power Units",
      agency: "City Power & Utility Command",
      totalQuantity: 15,
      deployed: 9,
      available: 6,
      unit: "Generators (500kW)",
      status: "Assigned",
      location: "Substation West"
    },
    {
      category: "Temporary Shelter",
      title: "Emergency Cots & Relief Supply Kits",
      agency: "Red Cross & Civil Defense",
      totalQuantity: 500,
      deployed: 320,
      available: 180,
      unit: "Relief Kits",
      status: "Available",
      location: "Civic Auditorium Shelter"
    },
    {
      category: "Heavy Engineering",
      title: "Bulldozers, Debris Excavators & Cranes",
      agency: "Public Works & Army Corps",
      totalQuantity: 8,
      deployed: 5,
      available: 3,
      unit: "Heavy Machinery",
      status: "In Transit",
      location: "Public Works Yard"
    }
  ];

  // Merge live deployment numbers from context
  const mergedResources = enrichedResources.map(e => {
    const live = resources.find(r => r.category === e.category || r.title.includes(e.category));
    if (live) {
      return {
        ...e,
        available: live.available,
        deployed: live.deployed,
        totalQuantity: live.totalQuantity
      };
    }
    return e;
  });

  const filteredList = mergedResources.filter(res => {
    if (filterTab === 'AVAILABLE') return res.available > 0;
    if (filterTab === 'DISPATCHED') return res.deployed > 0;
    return true;
  });

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    const targetCluster = clusters.find(c => c.id === targetIncidentId);
    const incidentLabel = targetCluster ? `${targetCluster.id} (${targetCluster.category})` : 'General Emergency Staging';

    dispatchUnits(selectedCategory, dispatchCount, targetIncidentId || 'Staging');
    
    setDispatchSuccessMsg(`Successfully dispatched ${dispatchCount} ${selectedCategory} units to ${incidentLabel}.`);
    setTimeout(() => setDispatchSuccessMsg(null), 4000);

    setSelectedCategory('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsResourceDrawerOpen(false); }}
    >
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
        
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-heading">Resource Command Center</h2>
                <p className="text-xs text-slate-400">Multi-Agency Fleet Inventory &amp; Tactical Dispatch</p>
              </div>
            </div>

            <button
              onClick={() => setIsResourceDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4 text-xs font-semibold">
            <button
              onClick={() => setFilterTab('ALL')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterTab === 'ALL' ? 'bg-amber-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Assets ({mergedResources.length})
            </button>
            <button
              onClick={() => setFilterTab('AVAILABLE')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterTab === 'AVAILABLE' ? 'bg-amber-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Available ({mergedResources.filter(r => r.available > 0).length})
            </button>
            <button
              onClick={() => setFilterTab('DISPATCHED')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterTab === 'DISPATCHED' ? 'bg-amber-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dispatched ({mergedResources.filter(r => r.deployed > 0).length})
            </button>
          </div>

          {/* Success Banner Notification */}
          {dispatchSuccessMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-950 border border-emerald-700/80 text-emerald-200 text-xs font-mono-code flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{dispatchSuccessMsg}</span>
            </div>
          )}

          {/* Resources List */}
          <div className="space-y-3 mb-6">
            {filteredList.map((res, i) => {
              const pctDeployed = Math.round((res.deployed / res.totalQuantity) * 100);
              const computedStatus = res.available > 0
                ? (res.deployed > 0 ? 'In Transit / Available' : 'Available')
                : 'Fully Dispatched';

              // Find assigned clusters for this agency / category
              const assignedClusters = clusters.filter(c => c.assignedAgency?.includes(res.category) || c.status === 'Dispatched');

              return (
                <div key={i} className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 font-mono-code text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{res.category}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {res.agency}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      res.available > 0
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {computedStatus} ({res.available} left)
                    </span>
                  </div>

                  <div className="text-slate-400 text-[11px] font-sans">
                    {res.title}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>Total Fleet: <span className="font-bold text-white">{res.totalQuantity}</span></div>
                    <div>Deployed: <span className="font-bold text-amber-400">{res.deployed}</span></div>
                    <div>Unit Type: <span className="text-slate-300">{res.unit}</span></div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-slate-400" /> Staging Depot: {res.location}
                  </div>

                  {/* Utilization Progress Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300"
                      style={{ width: `${pctDeployed}%` }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory(res.category);
                      setTargetIncidentId(clusters[0]?.id || '');
                    }}
                    disabled={res.available <= 0}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-amber-900/50 mt-1 transition flex items-center justify-center gap-1 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" /> Dispatch {res.category}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Dispatch Modal Form */}
          {selectedCategory && (
            <form onSubmit={handleDispatchSubmit} className="p-4 rounded-xl bg-slate-950 border border-amber-500/80 space-y-3 font-mono-code text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 font-heading">
                  Tactical Deployment: {selectedCategory}
                </h4>
                <button type="button" onClick={() => setSelectedCategory('')} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 text-[10px]">Target Incident Cluster</label>
                  <select
                    value={targetIncidentId}
                    onChange={(e) => setTargetIncidentId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    {clusters.map(c => (
                      <option key={c.id} value={c.id}>{c.id} — {c.category} ({c.locationName})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 text-[10px]">Units Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={dispatchCount}
                    onChange={(e) => setDispatchCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-lg shadow-amber-950"
                >
                  <Send className="w-3.5 h-3.5" /> Deploy Resource Units
                </button>
              </div>
            </form>
          )}

        </div>

        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center font-mono-code">
          ResQAI Multi-Agency Resource Synchronization Engine v1.0
        </div>

      </div>
    </div>
  );
}
