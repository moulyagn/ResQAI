import React from 'react';
import { useResQ } from '../context/ResQContext';
import { X, Compass, CheckCircle2, Circle, Layers, Cpu, Radio, Shield, Zap } from 'lucide-react';

export default function RoadmapModal() {
  const { isRoadmapOpen, setIsRoadmapOpen } = useResQ();

  if (!isRoadmapOpen) return null;

  const phases = [
    {
      phaseNumber: "PHASE 1",
      title: "COMPLETED MVP FOUNDATION",
      status: "COMPLETED",
      statusBadge: "bg-emerald-950 text-emerald-300 border-emerald-800",
      icon: Layers,
      features: [
        { name: "Incident Intake", completed: true },
        { name: "Backend API", completed: true },
        { name: "Interactive GIS Map", completed: true },
        { name: "Incident Clustering", completed: true },
        { name: "AI Deduplication", completed: true },
        { name: "Resource Intelligence", completed: true },
        { name: "Focus & Details Panel", completed: true }
      ]
    },
    {
      phaseNumber: "PHASE 2 & 3",
      title: "CURRENT RESPONSE CAPABILITIES",
      status: "COMPLETED",
      statusBadge: "bg-emerald-950 text-emerald-300 border-emerald-800",
      icon: Cpu,
      features: [
        { name: "Multi-source signal processing", completed: true },
        { name: "Severity & urgency prioritization", completed: true },
        { name: "Resource dispatch engine", completed: true },
        { name: "Multi-agency coordination timeline", completed: true },
        { name: "SITREP brief generation", completed: true }
      ]
    },
    {
      phaseNumber: "PHASE 4 & 5",
      title: "FUTURE ARCHITECTURE",
      status: "PLANNED ROADMAP",
      statusBadge: "bg-indigo-950 text-indigo-300 border-indigo-800",
      icon: Zap,
      features: [
        { name: "Persistent database integration", completed: false },
        { name: "Real SMS gateway integration", completed: false },
        { name: "Real social/media feed ingestion", completed: false },
        { name: "Predictive risk analysis", completed: false },
        { name: "Automated resource optimization", completed: false },
        { name: "Real-time push notifications", completed: false }
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsRoadmapOpen(false); }}
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">ResQAI Development Roadmap</h2>
              <p className="text-xs text-slate-400">Architectural Milestones &amp; Production Deployment Phases</p>
            </div>
          </div>

          <button
            onClick={() => setIsRoadmapOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Phases List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phases.map((phase, idx) => {
              const IconComp = phase.icon;
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono-code font-bold text-slate-400 block">{phase.phaseNumber}</span>
                          <h3 className="font-bold text-white font-heading">{phase.title}</h3>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 text-[9px] font-mono-code font-bold rounded border ${phase.statusBadge}`}>
                        {phase.status}
                      </span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-1.5 pt-1">
                      {phase.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-[11px]">
                          {feat.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className={feat.completed ? 'text-slate-200 font-medium' : 'text-slate-500 font-mono-code'}>
                            {feat.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono-code flex justify-between">
                    <span>{phase.features.filter(f => f.completed).length} / {phase.features.length} Features Live</span>
                    <span>{phase.status.includes('COMPLETED') ? 'Production Ready' : 'In Roadmap Pipeline'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-slate-500 text-[10px] font-mono-code">
          Current Active Deployment: ResQAI Autonomous Disaster Command Hub v1.0
        </div>

      </div>
    </div>
  );
}
