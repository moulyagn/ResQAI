import React from 'react';
import { useResQ } from '../context/ResQContext';
import {
  X, AlertTriangle, MapPin, Users, Shield, Box,
  Zap, ChevronRight, Activity, Clock
} from 'lucide-react';

const urgencyFromCluster = (cluster) => {
  const urgencies = cluster.reports?.map(r => r.extractedEntities?.urgency).filter(Boolean) || [];
  if (urgencies.includes('CRITICAL')) return 'CRITICAL';
  if (urgencies.includes('HIGH')) return 'HIGH';
  return 'MODERATE';
};

const hazardsFromCluster = (cluster) => {
  const all = cluster.reports?.flatMap(r => r.extractedEntities?.hazards || []) || [];
  return [...new Set(all)];
};

const unmetNeeds = (cluster) => {
  // Resources needed but no agency assigned → unmet
  if (!cluster.assignedAgency) return cluster.combinedResources || [];
  return [];
};

export default function CriticalAlarmsPanel() {
  const {
    isCriticalAlarmsModalOpen,
    setIsCriticalAlarmsModalOpen,
    clusters,
    stats,
    setSelectedIncident,
    setIsResourceDrawerOpen
  } = useResQ();

  if (!isCriticalAlarmsModalOpen) return null;

  // Match exact same filter used to compute stats.criticalIncidents
  const criticalClusters = clusters.filter(c => c.severity >= 5);

  const handleViewDetails = (cluster) => {
    setSelectedIncident(cluster);
    setIsCriticalAlarmsModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsCriticalAlarmsModalOpen(false); }}
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-rose-900/60 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Critical Alarms</h2>
              <p className="text-xs text-slate-400">Severity 5/5 incidents requiring immediate command action</p>
            </div>
          </div>
          <button
            onClick={() => setIsCriticalAlarmsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary metric */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 mb-4 shrink-0">
          <div className="text-center px-4 border-r border-rose-900/50">
            <div className="text-3xl font-extrabold text-rose-400 font-heading">{criticalClusters.length}</div>
            <div className="text-[10px] text-rose-300 font-mono-code mt-0.5">Critical Incidents</div>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed">
            These incidents are classified <span className="font-bold text-rose-300">Severity 5/5</span> — maximum urgency.
            Each requires immediate resource dispatch and command-level attention.
            {criticalClusters.length === 0 && ' No critical incidents at this time.'}
          </p>
        </div>

        {/* Critical alarm list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {criticalClusters.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No critical alarms. System stable.</div>
          ) : (
            criticalClusters.map((cluster) => {
              const urgency = urgencyFromCluster(cluster);
              const hazards = hazardsFromCluster(cluster);
              const unmet = unmetNeeds(cluster);

              return (
                <div key={cluster.id} className="rounded-xl border border-rose-900/40 bg-slate-950/70 overflow-hidden">

                  {/* Alarm header */}
                  <div className="p-3 flex items-center justify-between bg-rose-950/20 border-b border-rose-900/30 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono-code font-bold text-rose-400 text-[11px] flex items-center gap-1">
                        <Zap className="w-3 h-3" />{cluster.id}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 rounded">
                        {cluster.category}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded border bg-rose-950/80 text-rose-400 border-rose-800">
                        SEV 5/5 — CRITICAL
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      urgency === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
                        : 'bg-amber-950/80 text-amber-300 border-amber-700'
                    }`}>
                      ⚡ {urgency}
                    </span>
                  </div>

                  {/* Alarm detail body */}
                  <div className="p-3 space-y-2.5 text-[11px] text-slate-300">

                    {/* Location */}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{cluster.locationName}</span>
                    </div>

                    {/* Victims */}
                    {cluster.totalVictims > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-amber-300 font-bold">{cluster.totalVictims} persons at risk / trapped</span>
                      </div>
                    )}

                    {/* Hazards */}
                    {hazards.length > 0 && (
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {hazards.map((h, i) => (
                            <span key={i} className="px-1.5 py-0.5 text-[10px] bg-rose-950/50 text-rose-300 border border-rose-900/60 rounded">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status & Agency */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400">Status:</span>
                        <span className={`font-bold ${
                          cluster.status === 'In Progress' ? 'text-cyan-300'
                          : cluster.status === 'Dispatched' ? 'text-amber-300'
                          : 'text-rose-300'
                        }`}>{cluster.status}</span>
                      </div>
                      {cluster.assignedAgency && (
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-emerald-300">{cluster.assignedAgency}</span>
                        </div>
                      )}
                    </div>

                    {/* Resources needed */}
                    {cluster.combinedResources?.length > 0 && (
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Resources Required</div>
                        <div className="flex flex-wrap gap-1.5">
                          {cluster.combinedResources.map((r, i) => (
                            <span key={i} className="px-1.5 py-0.5 text-[10px] bg-slate-950 text-cyan-300 border border-cyan-900/50 rounded">
                              🏷️ {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unmet needs */}
                    {unmet.length > 0 && (
                      <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/50 text-rose-300 text-[10px]">
                        ⚠️ <span className="font-bold">Unmet needs</span> — No agency assigned. Resources not yet dispatched: {unmet.join(', ')}.
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last updated: {new Date(cluster.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
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
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 text-[11px] font-bold border border-rose-800/50 transition"
                    >
                      <Box className="w-3.5 h-3.5" /> Dispatch Resource
                    </button>
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
