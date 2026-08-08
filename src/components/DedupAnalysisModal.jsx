import React from 'react';
import { useResQ } from '../context/ResQContext';
import { X, Cpu, Layers, Radio, GitMerge, Fingerprint, Info } from 'lucide-react';

export default function DedupAnalysisModal() {
  const { isDedupAnalysisOpen, setIsDedupAnalysisOpen, clusters, reports, stats } = useResQ();

  if (!isDedupAnalysisOpen) return null;

  const totalRaw = stats.totalReports;
  const totalClusters = stats.activeClusters;
  const totalDuplicates = totalRaw - totalClusters;

  // Build per-cluster dedup breakdown from live data
  const clusterBreakdown = clusters.map(cluster => {
    const memberReports = cluster.reports || [];
    const aiMatch = cluster.confidenceScore
      ? Math.round(cluster.confidenceScore * 100)
      : null;

    return {
      id: cluster.id,
      category: cluster.category,
      locationName: cluster.locationName,
      reportCount: cluster.reportCount || memberReports.length,
      aiMatch,
      severity: cluster.severity,
      members: memberReports.map(r => ({
        id: r.id,
        sourceType: r.sourceType || 'UNKNOWN',
        sourceName: r.sourceName || 'Unknown Source',
        rawText: r.rawText,
        timestamp: r.timestamp
      }))
    };
  });

  const sourceTypeBadge = (type) => {
    const colors = {
      SMS: 'bg-emerald-950 text-emerald-300 border-emerald-800/60',
      SOCIAL: 'bg-sky-950 text-sky-300 border-sky-800/60',
      FORM: 'bg-violet-950 text-violet-300 border-violet-800/60',
      RADIO: 'bg-amber-950 text-amber-300 border-amber-800/60',
      UNKNOWN: 'bg-slate-900 text-slate-400 border-slate-700'
    };
    return colors[type] || colors.UNKNOWN;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsDedupAnalysisOpen(false); }}
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">AI Deduplication Analysis</h2>
              <p className="text-xs text-slate-400">Real-time signal clustering &amp; noise reduction breakdown</p>
            </div>
          </div>
          <button
            onClick={() => setIsDedupAnalysisOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs text-slate-300">

          {/* Summary Metrics Grid */}
          <div className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-mono-code">
            <div>
              <div className="text-[10px] text-slate-400 mb-1">Raw Signals</div>
              <div className="text-xl font-bold text-emerald-400">{totalRaw}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">Unified Incidents</div>
              <div className="text-xl font-bold text-cyan-400">{totalClusters}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">Duplicate Signals</div>
              <div className="text-xl font-bold text-amber-400">{totalDuplicates}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">Noise Reduction</div>
              <div className="text-xl font-bold text-indigo-400">{stats.dedupRatio}</div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-200 leading-relaxed">
              ResQAI's clustering engine analyzes incoming signals from multiple sources (SMS, social media, radio, intake forms) and
              groups reports that describe the <span className="font-bold text-indigo-300">same real-world incident</span> based on
              geographic proximity and emergency category. Duplicate signals are merged into unified incident clusters,
              reducing operator noise and enabling faster response coordination.
            </p>
          </div>

          {/* Per-Cluster Breakdown */}
          <div>
            <h4 className="font-bold text-slate-200 mb-3 font-heading flex items-center gap-1.5">
              <GitMerge className="w-4 h-4 text-indigo-400" />
              Cluster Deduplication Breakdown
            </h4>

            <div className="space-y-3">
              {clusterBreakdown.map(cluster => (
                <div key={cluster.id} className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">

                  {/* Cluster Header */}
                  <div className="p-3 flex items-center justify-between bg-slate-900/60 border-b border-slate-800/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono-code font-bold text-cyan-400 text-[11px]">{cluster.id}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 rounded">
                        {cluster.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border ${
                        cluster.severity >= 5
                          ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                          : cluster.severity >= 4
                          ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                          : 'bg-yellow-950/80 text-yellow-400 border-yellow-800'
                      }`}>
                        SEV {cluster.severity}/5
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono-code">
                      <span className="flex items-center gap-1 text-indigo-300">
                        <Layers className="w-3 h-3" />
                        {cluster.reportCount} signals merged
                      </span>
                      {cluster.aiMatch !== null && (
                        <span className="flex items-center gap-1 text-emerald-300">
                          <Fingerprint className="w-3 h-3" />
                          {cluster.aiMatch}% AI match
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cluster Location */}
                  <div className="px-3 pt-2 pb-1 text-[11px] text-slate-400">
                    📍 {cluster.locationName}
                  </div>

                  {/* Merged Signals List */}
                  <div className="px-3 pb-3">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 mt-1">
                      Merged Source Signals
                    </div>
                    <div className="space-y-1.5 pl-2 border-l-2 border-indigo-500/40">
                      {cluster.members.map((member, idx) => (
                        <div key={member.id || idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/50">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono-code font-bold text-cyan-300 text-[10px]">{member.id}</span>
                              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${sourceTypeBadge(member.sourceType)}`}>
                                {member.sourceType}
                              </span>
                              <span className="text-[10px] text-slate-400">{member.sourceName}</span>
                            </div>
                            {member.timestamp && (
                              <span className="text-[10px] text-slate-500 font-mono-code">
                                {new Date(member.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 italic leading-relaxed line-clamp-2">
                            "{member.rawText}"
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Per-cluster explanation */}
                    <div className="mt-2 text-[10px] text-slate-500 italic flex items-center gap-1">
                      <Radio className="w-3 h-3 shrink-0" />
                      These {cluster.reportCount} signals were identified as describing the same real-world {cluster.category.toLowerCase()} incident
                      at {cluster.locationName}.
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
