import React from 'react';
import { useResQ } from '../context/ResQContext';
import {
  X, Layers, MapPin, Users, Shield, AlertTriangle,
  Box, ChevronRight, Activity, Cpu
} from 'lucide-react';

const severityLabel = (s) => {
  if (s >= 5) return { label: 'CRITICAL', cls: 'bg-rose-950/80 text-rose-400 border-rose-800' };
  if (s >= 4) return { label: 'HIGH', cls: 'bg-amber-950/80 text-amber-400 border-amber-800' };
  return { label: 'MODERATE', cls: 'bg-yellow-950/80 text-yellow-400 border-yellow-800' };
};

const statusBadge = (s) => {
  if (s === 'In Progress') return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
  if (s === 'Dispatched')  return 'bg-amber-950/80 text-amber-300 border-amber-800';
  if (s === 'Resolved')    return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
  return 'bg-slate-900 text-slate-400 border-slate-700';
};

export default function ActiveClustersPanel() {
  const {
    isActiveClustersModalOpen,
    setIsActiveClustersModalOpen,
    clusters,
    stats,
    setSelectedIncident,
    setIsResourceDrawerOpen
  } = useResQ();

  if (!isActiveClustersModalOpen) return null;

  const handleViewDetails = (cluster) => {
    setSelectedIncident(cluster);
    setIsActiveClustersModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsActiveClustersModalOpen(false); }}
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Active Incident Clusters</h2>
              <p className="text-xs text-slate-400">Unified multi-source incident groups — real-time operational picture</p>
            </div>
          </div>
          <button
            onClick={() => setIsActiveClustersModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-mono-code text-xs mb-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 mb-1">Total Clusters</div>
            <div className="text-xl font-bold text-cyan-400">{stats.activeClusters}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-1">Critical (Sev 5)</div>
            <div className="text-xl font-bold text-rose-400">{stats.criticalIncidents}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-1">Total At-Risk</div>
            <div className="text-xl font-bold text-amber-400">{stats.rescuedVictimsCount}</div>
          </div>
        </div>

        {/* Cluster list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {clusters.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No active clusters.</div>
          ) : (
            clusters.map((cluster) => {
              const sev = severityLabel(cluster.severity);
              return (
                <div key={cluster.id} className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">

                  {/* Cluster header bar */}
                  <div className="p-3 flex items-center justify-between bg-slate-900/60 border-b border-slate-800/60 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono-code font-bold text-cyan-400 text-[11px]">{cluster.id}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 rounded">
                        {cluster.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border ${sev.cls}`}>
                        SEV {cluster.severity}/5 — {sev.label}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge(cluster.status)}`}>
                      {cluster.status}
                    </span>
                  </div>

                  {/* Cluster detail body */}
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-300">

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{cluster.locationName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {cluster.totalVictims > 0
                          ? <span className="text-amber-300 font-bold">{cluster.totalVictims} persons at risk</span>
                          : <span className="text-slate-500">No victims reported</span>
                        }
                      </span>
                    </div>

                    {cluster.assignedAgency && (
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">{cluster.assignedAgency}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="text-indigo-300">{cluster.reportCount} merged signal{cluster.reportCount !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Resource needs */}
                    {cluster.combinedResources?.length > 0 && (
                      <div className="col-span-2 flex flex-wrap gap-1.5 pt-1">
                        <span className="text-slate-500 mr-1 flex items-center gap-1"><Box className="w-3 h-3" /> Resources needed:</span>
                        {cluster.combinedResources.map((r, i) => (
                          <span key={i} className="px-1.5 py-0.5 text-[10px] bg-slate-950 text-cyan-300 border border-cyan-900/50 rounded">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-3 pb-3 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleViewDetails(cluster)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-[11px] font-bold border border-cyan-800/50 transition"
                    >
                      <ChevronRight className="w-3.5 h-3.5" /> View Details
                    </button>
                    <button
                      onClick={() => setIsResourceDrawerOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-[11px] font-bold border border-amber-800/50 transition"
                    >
                      <Box className="w-3.5 h-3.5" /> Dispatch Resource
                    </button>
                    <span className="ml-auto text-[10px] text-slate-500 font-mono-code">
                      <Activity className="w-3 h-3 inline mr-0.5" />
                      {new Date(cluster.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
