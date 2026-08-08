import React, { useState } from 'react';
import { useResQ } from '../context/ResQContext';
import {
  X, Inbox, Radio, MessageCircle, FileText, Phone,
  MapPin, Clock, Layers, CheckCircle2, AlertCircle
} from 'lucide-react';

const SOURCE_FILTERS = [
  { key: 'ALL',    label: 'All' },
  { key: 'SMS',    label: 'SMS' },
  { key: 'SOCIAL', label: 'Social' },
  { key: 'FORM',   label: 'Official Form' },
  { key: 'PHONE',  label: 'Phone / Radio' },
];

const sourceTypeBadge = (type) => {
  const map = {
    SMS:    'bg-emerald-950 text-emerald-300 border-emerald-800/60',
    SOCIAL: 'bg-sky-950 text-sky-300 border-sky-800/60',
    FORM:   'bg-violet-950 text-violet-300 border-violet-800/60',
    PHONE:  'bg-amber-950 text-amber-300 border-amber-800/60',
    RADIO:  'bg-amber-950 text-amber-300 border-amber-800/60',
  };
  return map[type] || 'bg-slate-900 text-slate-400 border-slate-700';
};

const sourceIcon = (type) => {
  if (type === 'SMS')    return <MessageCircle className="w-3 h-3" />;
  if (type === 'SOCIAL') return <Radio className="w-3 h-3" />;
  if (type === 'FORM')   return <FileText className="w-3 h-3" />;
  return <Phone className="w-3 h-3" />;
};

const clusterStatus = (report) => {
  if (!report.clusterId) return { label: 'Unclustered', cls: 'bg-rose-950/60 text-rose-400 border-rose-800/60' };
  return { label: 'Clustered', cls: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' };
};

export default function RawSignalsPanel() {
  const {
    isRawSignalsModalOpen,
    setIsRawSignalsModalOpen,
    reports,
    stats
  } = useResQ();

  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!isRawSignalsModalOpen) return null;

  // Normalize filter key — SOCIAL covers @-handle posts; PHONE covers RADIO
  const normalizeType = (type) => {
    if (type === 'RADIO') return 'PHONE';
    return type;
  };

  const filtered = activeFilter === 'ALL'
    ? reports
    : reports.filter(r => normalizeType(r.sourceType) === activeFilter);

  // Count per-source for badge display
  const counts = SOURCE_FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'ALL'
      ? reports.length
      : reports.filter(r => normalizeType(r.sourceType) === f.key).length;
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsRawSignalsModalOpen(false); }}
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Raw Intelligence Signals</h2>
              <p className="text-xs text-slate-400">All ingested multi-source signals — SMS, social, official forms, and radio</p>
            </div>
          </div>
          <button
            onClick={() => setIsRawSignalsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Totals row */}
        <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-mono-code text-xs mb-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 mb-1">Total Signals</div>
            <div className="text-xl font-bold text-emerald-400">{stats.totalReports}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-1">SMS</div>
            <div className="text-xl font-bold text-emerald-300">{counts.SMS}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-1">Social</div>
            <div className="text-xl font-bold text-sky-300">{counts.SOCIAL}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-1">Official Form</div>
            <div className="text-xl font-bold text-violet-300">{counts.FORM}</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4 shrink-0 text-xs font-semibold gap-0.5">
          {SOURCE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeFilter === f.key
                  ? 'bg-emerald-600 text-white shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
              {f.key !== 'ALL' && counts[f.key] > 0 && (
                <span className={`text-[9px] px-1 rounded-full ${activeFilter === f.key ? 'bg-white/20' : 'bg-slate-800'}`}>
                  {counts[f.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Showing count */}
        <div className="mb-2 shrink-0 text-[11px] font-mono-code text-slate-400 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          Showing {filtered.length} of {stats.totalReports} signals
        </div>

        {/* Signal list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No signals match the selected filter.</div>
          ) : (
            filtered.map((report, idx) => {
              const cs = clusterStatus(report);
              return (
                <div key={report.id || idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">

                  {/* Signal header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono-code font-bold text-emerald-400 text-[11px]">{report.id}</span>
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded border ${sourceTypeBadge(report.sourceType)}`}>
                        {sourceIcon(report.sourceType)} {report.sourceType}
                      </span>
                      <span className="text-[10px] text-slate-400">{report.sourceName}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Cluster status badge */}
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded border ${cs.cls}`}>
                        {report.clusterId
                          ? <><CheckCircle2 className="w-3 h-3" /> {cs.label} ({report.clusterId})</>
                          : <><AlertCircle className="w-3 h-3" /> {cs.label}</>
                        }
                      </span>

                      {/* Severity */}
                      {report.severity && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded border ${
                          report.severity >= 5
                            ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                            : report.severity >= 4
                            ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                            : 'bg-yellow-950/80 text-yellow-400 border-yellow-800'
                        }`}>
                          SEV {report.severity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location & timestamp */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 flex-wrap">
                    {report.locationName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" /> {report.locationName}
                      </span>
                    )}
                    {report.timestamp && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' '}
                        ({Math.round((Date.now() - new Date(report.timestamp)) / 60000)}m ago)
                      </span>
                    )}
                    {report.category && (
                      <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                        {report.category}
                      </span>
                    )}
                  </div>

                  {/* Raw text */}
                  <p className="text-[11px] text-slate-200 italic leading-relaxed border-l-2 border-emerald-500/40 pl-2">
                    "{report.rawText}"
                  </p>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono-code text-center shrink-0">
          ResQAI Multi-Source Intelligence Ingestion — {stats.totalReports} total signals processed
        </div>

      </div>
    </div>
  );
}
