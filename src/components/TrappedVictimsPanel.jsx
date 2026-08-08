import React from 'react';
import { useResQ } from '../context/ResQContext';
import {
  X, Users, MapPin, AlertTriangle, Shield,
  ChevronRight, Flame, Zap, Activity
} from 'lucide-react';

const categoryIcon = (cat) => {
  if (cat === 'Flood')           return '🌊';
  if (cat === 'Fire')            return '🔥';
  if (cat === 'Building Collapse') return '🏚️';
  if (cat === 'Medical')         return '🏥';
  if (cat === 'Power / Grid')    return '⚡';
  return '🚨';
};

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

export default function TrappedVictimsPanel() {
  const {
    isTrappedVictimsModalOpen,
    setIsTrappedVictimsModalOpen,
    clusters,
    stats,
    setSelectedIncident
  } = useResQ();

  if (!isTrappedVictimsModalOpen) return null;

  // Only clusters that have at least 1 victim — but total matches stats.rescuedVictimsCount exactly
  const clustersWithVictims = clusters.filter(c => c.totalVictims > 0);
  const grandTotal = clusters.reduce((sum, c) => sum + (c.totalVictims || 0), 0);

  const handleViewDetails = (cluster) => {
    setSelectedIncident(cluster);
    setIsTrappedVictimsModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsTrappedVictimsModalOpen(false); }}
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-amber-900/40 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">People At Risk</h2>
              <p className="text-xs text-slate-400">Trapped and at-risk individuals across all active incidents</p>
            </div>
          </div>
          <button
            onClick={() => setIsTrappedVictimsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grand total summary */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 mb-4 shrink-0">
          <div className="text-center px-5 border-r border-amber-900/40">
            <div className="text-4xl font-extrabold text-amber-400 font-heading">{grandTotal}</div>
            <div className="text-[10px] text-amber-300 font-mono-code mt-0.5">Total Persons</div>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <div>Spread across <span className="font-bold text-amber-300">{clustersWithVictims.length}</span> active incident{clustersWithVictims.length !== 1 ? 's' : ''}</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Victim counts are aggregated from all merged signals within each cluster.
              Numbers update in real-time as new signals are ingested.
            </div>
          </div>
        </div>

        {/* Per-cluster breakdown */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {clustersWithVictims.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No reported victims across active clusters.</div>
          ) : (
            clustersWithVictims.map((cluster) => {
              const urgency = urgencyFromCluster(cluster);
              const hazards = hazardsFromCluster(cluster);
              const pct = grandTotal > 0 ? Math.round((cluster.totalVictims / grandTotal) * 100) : 0;

              return (
                <div key={cluster.id} className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">

                  {/* Row header */}
                  <div className="p-3 flex items-center justify-between bg-slate-900/60 border-b border-slate-800/60 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{categoryIcon(cluster.category)}</span>
                      <span className="font-bold text-slate-200 text-xs font-heading">{cluster.category}</span>
                      <span className="font-mono-code text-[10px] text-slate-500">{cluster.id}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      urgency === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                        : urgency === 'HIGH'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                        : 'bg-yellow-950/80 text-yellow-400 border-yellow-800'
                    }`}>
                      {urgency}
                    </span>
                  </div>

                  {/* Detail body */}
                  <div className="p-3 space-y-2 text-[11px] text-slate-300">

                    {/* Victim count + progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-2xl font-extrabold text-amber-400 font-heading">{cluster.totalVictims}</span>
                        <span className="text-xs text-slate-400">persons</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Share of total</span>
                          <span className="text-amber-400 font-bold">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-200">{cluster.locationName}</span>
                    </div>

                    {/* Severity */}
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="text-slate-400">Severity:</span>
                      <span className={`font-bold ${cluster.severity >= 5 ? 'text-rose-400' : cluster.severity >= 4 ? 'text-amber-400' : 'text-yellow-400'}`}>
                        {cluster.severity}/5
                      </span>
                    </div>

                    {/* Hazards / risk factors */}
                    {hazards.length > 0 && (
                      <div className="flex items-start gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 mr-1">Risk factors:</span>
                          {hazards.map((h, i) => (
                            <span key={i} className="inline-block mr-1 px-1.5 py-0.5 text-[10px] bg-rose-950/40 text-rose-300 border border-rose-900/50 rounded">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Agency */}
                    {cluster.assignedAgency && (
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">{cluster.assignedAgency}</span>
                      </div>
                    )}
                    {!cluster.assignedAgency && (
                      <div className="text-rose-400 font-bold text-[10px] flex items-center gap-1">
                        <Zap className="w-3 h-3" /> No agency assigned — response required
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => handleViewDetails(cluster)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-[11px] font-bold border border-amber-800/50 transition"
                    >
                      <ChevronRight className="w-3.5 h-3.5" /> View Cluster Details
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer total confirm */}
        <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono-code text-center shrink-0">
          Confirmed total: {grandTotal} at-risk persons across {clusters.length} active incident cluster{clusters.length !== 1 ? 's' : ''}
        </div>

      </div>
    </div>
  );
}
