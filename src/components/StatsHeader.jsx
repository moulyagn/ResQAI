import React from 'react';
import { useResQ } from '../context/ResQContext';
import { 
  AlertTriangle, 
  Layers, 
  Users, 
  Cpu, 
  Inbox
} from 'lucide-react';

export default function StatsHeader() {
  const {
    stats,
    scenario,
    setIsDedupAnalysisOpen,
    setIsActiveClustersModalOpen,
    setIsCriticalAlarmsModalOpen,
    setIsTrappedVictimsModalOpen,
    setIsRawSignalsModalOpen
  } = useResQ();

  // Shared interactive card class
  const interactiveCard = "glass-panel glass-panel-hover p-3.5 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden";

  return (
    <div className="px-4 lg:px-6 pt-4 pb-2">
      {/* Scenario Briefing Bar */}
      <div className="mb-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono-code font-semibold border border-cyan-800/50">
            ACTIVE SITUATION
          </span>
          <span className="font-bold text-slate-200">{scenario?.name}</span>
        </div>
        <p className="text-slate-400 max-w-3xl truncate">
          {scenario?.description}
        </p>
      </div>

      {/* Grid of Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Card 1: Active Clusters — Interactive */}
        <div
          onClick={() => setIsActiveClustersModalOpen(true)}
          className={`${interactiveCard} border border-cyan-800/50 hover:border-cyan-500/80`}
          title="Click to view Active Incident Clusters"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium group-hover:text-cyan-300 transition-colors">Active Clusters</span>
            <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 group-hover:bg-cyan-900 group-hover:text-cyan-200 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-white group-hover:text-cyan-300 font-heading transition-colors">{stats.activeClusters}</span>
              <span className="text-xs text-cyan-400 font-mono-code">Incidents</span>
            </div>
            <span className="text-[10px] text-cyan-400 underline font-mono-code opacity-0 group-hover:opacity-100 transition-opacity">
              View &rarr;
            </span>
          </div>
        </div>

        {/* Card 2: Critical Alarms — Interactive */}
        <div
          onClick={() => setIsCriticalAlarmsModalOpen(true)}
          className={`${interactiveCard} border border-rose-900/40 bg-rose-950/10 hover:border-rose-500/60`}
          title="Click to view Critical Alarms"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-medium group-hover:text-rose-200 transition-colors">Critical Alarms (5/5)</span>
            <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800/50 group-hover:bg-rose-900 group-hover:text-rose-200 transition-colors">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-rose-400 group-hover:text-rose-300 font-heading transition-colors">{stats.criticalIncidents}</span>
              <span className="text-xs text-rose-300 font-mono-code">Immediate Action</span>
            </div>
            <span className="text-[10px] text-rose-400 underline font-mono-code opacity-0 group-hover:opacity-100 transition-opacity">
              View &rarr;
            </span>
          </div>
        </div>

        {/* Card 3: Trapped / At-Risk — Interactive */}
        <div
          onClick={() => setIsTrappedVictimsModalOpen(true)}
          className={`${interactiveCard} border border-amber-800/40 hover:border-amber-500/60`}
          title="Click to view People at Risk"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium group-hover:text-amber-300 transition-colors">Trapped / At-Risk</span>
            <div className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/50 group-hover:bg-amber-900 group-hover:text-amber-200 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-amber-400 group-hover:text-amber-300 font-heading transition-colors">{stats.rescuedVictimsCount}</span>
              <span className="text-xs text-slate-400 font-mono-code">Persons</span>
            </div>
            <span className="text-[10px] text-amber-400 underline font-mono-code opacity-0 group-hover:opacity-100 transition-opacity">
              View &rarr;
            </span>
          </div>
        </div>

        {/* Card 4: AI Deduplication — Interactive (existing) */}
        <div 
          onClick={() => setIsDedupAnalysisOpen(true)}
          className={`${interactiveCard} border border-indigo-800/60 hover:border-indigo-500/80`}
          title="Click to view AI Deduplication Analysis"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-medium group-hover:text-indigo-200">AI Deduplication</span>
            <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 group-hover:bg-indigo-900 group-hover:text-indigo-200 transition-colors">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-indigo-400 group-hover:text-indigo-300 font-heading">{stats.dedupRatio}</span>
              <span className="text-xs text-slate-400 font-mono-code">Noise Reduction</span>
            </div>
            <span className="text-[10px] text-indigo-400 underline font-mono-code opacity-0 group-hover:opacity-100 transition-opacity">
              View Analysis &rarr;
            </span>
          </div>
        </div>

        {/* Card 5: Raw Multi-Source — Interactive */}
        <div
          onClick={() => setIsRawSignalsModalOpen(true)}
          className={`${interactiveCard} border border-emerald-800/40 hover:border-emerald-500/60 col-span-2 sm:col-span-1`}
          title="Click to view Raw Intelligence Signals"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium group-hover:text-emerald-300 transition-colors">Raw Multi-Source</span>
            <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 group-hover:bg-emerald-900 group-hover:text-emerald-200 transition-colors">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-emerald-400 group-hover:text-emerald-300 font-heading transition-colors">{stats.totalReports}</span>
              <span className="text-xs text-slate-400 font-mono-code">Signals Parsed</span>
            </div>
            <span className="text-[10px] text-emerald-400 underline font-mono-code opacity-0 group-hover:opacity-100 transition-opacity">
              View &rarr;
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
