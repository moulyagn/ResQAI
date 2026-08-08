import React from 'react';
import { useResQ } from '../context/ResQContext';
import { X, Radio, Play, Square, Sparkles, Activity, MessageSquare, Share2, FileText, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function StreamSimulationModal() {
  const {
    isStreamModalOpen,
    setIsStreamModalOpen,
    isStreamActive,
    setIsStreamActive,
    reports,
    generateSingleSimulatedSignal
  } = useResQ();

  if (!isStreamModalOpen) return null;

  const totalRaw = reports.length;
  const smsCount = reports.filter(r => r.sourceType === 'SMS').length;
  const socialCount = reports.filter(r => r.sourceType === 'SOCIAL').length;
  const formCount = reports.filter(r => r.sourceType === 'FORM').length;
  const radioCount = reports.filter(r => r.sourceType === 'PHONE' || r.sourceType === 'RADIO').length;

  const recentSignals = reports.slice(0, 8);

  const getSourceBadge = (type) => {
    switch (type) {
      case 'SMS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> SMS</span>;
      case 'SOCIAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1"><Share2 className="w-3 h-3" /> Social</span>;
      case 'FORM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-950 text-violet-300 border border-violet-800 flex items-center gap-1"><FileText className="w-3 h-3" /> Official Form</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Radio/Dispatch</span>;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsStreamModalOpen(false); }}
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border ${isStreamActive ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
              <Radio className={`w-5 h-5 ${isStreamActive ? 'animate-pulse text-rose-400' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-heading">Live Feed Simulation</h2>
                <span className={`px-2 py-0.5 text-[10px] font-mono-code font-bold rounded-full border flex items-center gap-1 ${
                  isStreamActive
                    ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isStreamActive ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`}></span>
                  {isStreamActive ? 'STREAM ACTIVE (7s Interval)' : 'STREAM PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Simulate incoming emergency calls, SMS messages, and social media signals in real-time</p>
            </div>
          </div>

          <button
            onClick={() => setIsStreamModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-300">
          
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-200">Simulation Control Center</div>
              <div className="text-[11px] text-slate-400">Control automated background signal stream or push manual test signals</div>
            </div>

            <div className="flex items-center space-x-2">
              {!isStreamActive ? (
                <button
                  onClick={() => setIsStreamActive(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Simulation
                </button>
              ) : (
                <button
                  onClick={() => setIsStreamActive(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-950"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop Simulation
                </button>
              )}

              <button
                onClick={() => generateSingleSimulatedSignal()}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950"
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate Incoming Signal
              </button>
            </div>
          </div>

          {/* Breakdown Statistics Grid */}
          <div className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-mono-code">
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-[10px] text-slate-400">Total Raw</div>
              <div className="text-lg font-bold text-white">{totalRaw}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-[10px] text-emerald-400">SMS Signals</div>
              <div className="text-lg font-bold text-emerald-300">{smsCount}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-[10px] text-sky-400">Social Stream</div>
              <div className="text-lg font-bold text-sky-300">{socialCount}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-[10px] text-violet-400">Official Forms</div>
              <div className="text-lg font-bold text-violet-300">{formCount}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-[10px] text-amber-400">Radio Dispatch</div>
              <div className="text-lg font-bold text-amber-300">{radioCount}</div>
            </div>
          </div>

          {/* Recent Signals List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-200 font-heading flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Ingested Signals Feed
              </h4>
              <span className="text-[10px] font-mono-code text-slate-400">Showing latest {recentSignals.length} signals</span>
            </div>

            <div className="space-y-2">
              {recentSignals.map((sig, idx) => (
                <div key={sig.id || idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code font-bold text-cyan-400 text-[11px]">{sig.id}</span>
                      {getSourceBadge(sig.sourceType)}
                      <span className="text-slate-400 text-[11px] font-medium">{sig.sourceName}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-mono-code">
                      <span className="text-slate-500">📍 {sig.locationName || 'Geocoded via AI'}</span>
                      <span className="text-slate-400">{new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> TRIAGED &amp; CLUSTERED
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 font-mono-code bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    "{sig.rawText}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
