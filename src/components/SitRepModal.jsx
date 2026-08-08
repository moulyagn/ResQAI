import React, { useState } from 'react';
import { useResQ } from '../context/ResQContext';
import { X, FileText, Printer, Download, Copy, CheckCircle, AlertTriangle, ShieldCheck, Activity, Layers, Users, Cpu, ArrowRight, RefreshCw } from 'lucide-react';

export default function SitRepModal() {
  const { isSitRepOpen, setIsSitRepOpen, scenario, clusters, stats, reports, resources, coordinationLogs } = useResQ();
  const [copied, setCopied] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isSitRepOpen) return null;

  const totalRaw = reports.length;
  const activeClusters = clusters.length;
  const duplicateSignals = totalRaw - activeClusters;
  const criticalClusters = clusters.filter(c => c.severity >= 4);

  // Compute resource situation
  const totalAvailableResources = resources.reduce((sum, r) => sum + (r.available || 0), 0);
  const totalDispatchedResources = resources.reduce((sum, r) => sum + (r.deployed || 0), 0);

  // Priority Actions generated dynamically from severity
  const priorityActions = [
    ...criticalClusters.map(c => `Immediate Search & Rescue dispatch for ${c.category} cluster at ${c.locationName} (Sev ${c.severity}/5, ${c.totalVictims || 3} persons trapped)`),
    "Maintain automated AI deduplication on incoming citizen SOS feeds to prevent operator fatigue",
    "Monitor levees and structural hazards across high-water zones"
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 400);
  };

  const handleCopyText = () => {
    const text = `=== EMERGENCY SITUATION REPORT (SITREP) ===
Scenario: ${scenario?.name}
Refreshed: ${lastRefreshed.toLocaleString()}
Active Clusters: ${stats.activeClusters}
Critical Incidents: ${stats.criticalIncidents}
Trapped Victims: ${stats.rescuedVictimsCount}
Noise Reduction: ${stats.dedupRatio}
==========================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsSitRepOpen(false); }}
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Emergency Situation Report (SITREP)</h2>
              <p className="text-xs text-slate-400">Official Operational Intelligence Briefing — Refreshed: {lastRefreshed.toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh SITREP
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied SITREP' : 'Copy Text'}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950"
            >
              <Printer className="w-3.5 h-3.5" /> Print Brief
            </button>

            <button
              onClick={() => setIsSitRepOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable SITREP Document */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs text-slate-300">
          
          {/* SECTION 1: EXECUTIVE SUMMARY */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono-code">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> SECTION 1: EXECUTIVE SUMMARY
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                STATUS: ACTIVE EMERGENCY
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white font-heading">{scenario?.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{scenario?.description}</p>
            </div>

            {/* Dynamic Telemetry Metrics Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2 text-center font-mono-code text-xs">
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">Raw Signals</div>
                <div className="text-sm font-bold text-emerald-400">{totalRaw}</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">Clusters</div>
                <div className="text-sm font-bold text-cyan-400">{activeClusters}</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">Duplicates</div>
                <div className="text-sm font-bold text-amber-400">{duplicateSignals}</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">Noise Red.</div>
                <div className="text-sm font-bold text-indigo-400">{stats.dedupRatio}</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">Critical</div>
                <div className="text-sm font-bold text-rose-400">{stats.criticalIncidents}</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 col-span-2">
                <div className="text-[9px] text-slate-400">Trapped / At-Risk</div>
                <div className="text-sm font-bold text-amber-300">{stats.rescuedVictimsCount} Persons</div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CRITICAL INCIDENTS */}
          <div>
            <h4 className="font-bold text-slate-200 mb-2 font-heading flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              SECTION 2: CRITICAL INCIDENTS (SEVERITY 4-5)
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
              <table className="w-full text-left text-[11px] font-mono-code">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Cluster ID</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Severity</th>
                    <th className="p-2.5">Location</th>
                    <th className="p-2.5">Victims</th>
                    <th className="p-2.5">Required Resource</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {criticalClusters.map(c => (
                    <tr key={c.id} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-bold text-cyan-400">{c.id}</td>
                      <td className="p-2.5 font-sans font-medium">{c.category}</td>
                      <td className="p-2.5 font-bold text-rose-400">Sev {c.severity}/5</td>
                      <td className="p-2.5">{c.locationName}</td>
                      <td className="p-2.5 text-amber-400 font-bold">{c.totalVictims || 3} trapped</td>
                      <td className="p-2.5 text-indigo-300">{c.category === 'Medical' ? 'Ambulance / Medical' : 'Evacuation Boat'}</td>
                      <td className="p-2.5 font-bold text-cyan-300">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: RESOURCE SITUATION */}
          <div>
            <h4 className="font-bold text-slate-200 mb-2 font-heading flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              SECTION 3: TACTICAL RESOURCE DEPLOYMENT SITUATION
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono-code mb-1">Available Fleet Units</div>
                <div className="text-xl font-bold text-emerald-400 font-mono-code">{totalAvailableResources} Units</div>
                <p className="text-[10px] text-slate-500 mt-1">Ready for immediate dispatch</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono-code mb-1">Deployed Fleet Units</div>
                <div className="text-xl font-bold text-amber-400 font-mono-code">{totalDispatchedResources} Units</div>
                <p className="text-[10px] text-slate-500 mt-1">Active in field operation</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono-code mb-1">Unassigned Critical Needs</div>
                <div className="text-xl font-bold text-rose-400 font-mono-code">{Math.max(0, criticalClusters.length - 2)} Clusters</div>
                <p className="text-[10px] text-slate-500 mt-1">Require immediate resource allocation</p>
              </div>
            </div>
          </div>

          {/* SECTION 4: MULTI-AGENCY COORDINATION */}
          <div>
            <h4 className="font-bold text-slate-200 mb-2 font-heading flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SECTION 4: MULTI-AGENCY COORDINATION TIMELINE
            </h4>

            <div className="space-y-1.5">
              {coordinationLogs.slice(0, 5).map(l => (
                <div key={l.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  <div className="flex justify-between font-mono-code text-[10px] text-slate-400 mb-0.5">
                    <span className="font-bold text-cyan-300">[{l.agency}] — {l.author}</span>
                    <span>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-200">{l.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: PRIORITY ACTIONS REQUIRED */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/60 space-y-2">
            <h4 className="font-bold text-indigo-300 font-heading flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4 text-indigo-400" />
              SECTION 5: PRIORITY COMMAND ACTIONS REQUIRED
            </h4>

            <ul className="space-y-1.5 text-xs text-indigo-100">
              {priorityActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono-code font-bold text-cyan-400 shrink-0">{idx + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
