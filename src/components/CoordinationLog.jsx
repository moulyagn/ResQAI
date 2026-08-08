import React, { useState } from 'react';
import { useResQ } from '../context/ResQContext';
import { MessageSquare, Send, Shield, Clock, Plus, Filter } from 'lucide-react';

export default function CoordinationLog() {
  const { coordinationLogs, addLogEntry, clusters } = useResQ();

  const [agency, setAgency] = useState('Fire & Rescue Dept');
  const [author, setAuthor] = useState('Captain Morales');
  const [content, setContent] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('ALL');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    addLogEntry({
      agency,
      author,
      content,
      incidentId: selectedIncidentId || null,
      type: 'STATUS_UPDATE',
      badgeColor: agency.includes('Medical') ? 'emerald' : agency.includes('Fire') ? 'rose' : agency.includes('Coast') ? 'cyan' : 'amber'
    });

    setContent('');
  };

  const filteredLogs = agencyFilter === 'ALL'
    ? coordinationLogs
    : coordinationLogs.filter(l => l.agency.toLowerCase().includes(agencyFilter.toLowerCase()));

  return (
    <div className="flex flex-col h-[400px] glass-panel rounded-xl border border-slate-800 overflow-hidden">
      
      {/* Header */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-heading">Multi-Agency Coordination Timeline</h3>
            <p className="text-[10px] text-slate-400">Shared inter-agency situational awareness log</p>
          </div>
        </div>

        {/* Agency Filter */}
        <select
          value={agencyFilter}
          onChange={(e) => setAgencyFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] rounded px-2 py-1 focus:outline-none"
        >
          <option value="ALL">All Agencies</option>
          <option value="Fire">Fire & Rescue</option>
          <option value="Medical">Emergency Medical</option>
          <option value="Coast">Coast Guard</option>
          <option value="Civil">Civil Defense</option>
        </select>
      </div>

      {/* Log Feed Timeline */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredLogs.map(log => {
          const badgeColorClass = log.badgeColor === 'emerald'
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
            : log.badgeColor === 'rose'
            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
            : log.badgeColor === 'cyan'
            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
            : 'bg-amber-950/80 text-amber-300 border-amber-800';

          return (
            <div key={log.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded border font-semibold ${badgeColorClass}`}>
                    {log.agency}
                  </span>
                  <span className="text-slate-400 font-medium">{log.author}</span>
                </div>

                <div className="flex items-center space-x-2 text-slate-400 font-mono-code">
                  {log.incidentId && (
                    <span className="text-cyan-400 font-bold">[{log.incidentId}]</span>
                  )}
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1 pt-0.5">
                {log.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add Update Form */}
      <form onSubmit={handleSubmit} className="p-2.5 bg-slate-900 border-t border-slate-800 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <select
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded p-1 text-slate-200"
          >
            <option value="Fire & Rescue Dept">Fire & Rescue Dept</option>
            <option value="Emergency Medical Services">Emergency Medical Services</option>
            <option value="Coast Guard Rescue">Coast Guard Rescue</option>
            <option value="Civil Defense Command">Civil Defense Command</option>
            <option value="Police & Engineering">Police & Heavy Engineering</option>
          </select>

          <input
            type="text"
            placeholder="Author / Call Sign"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded p-1 text-slate-200"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Broadcast update, field report, or resource movement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-50"
          >
            <Send className="w-3 h-3" /> Post
          </button>
        </div>
      </form>

    </div>
  );
}
