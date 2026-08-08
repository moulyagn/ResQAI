import React, { useState, useEffect, useRef } from 'react';
import { useResQ } from '../context/ResQContext';
import { 
  Layers, 
  Radio, 
  Search, 
  Filter, 
  AlertTriangle, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  Box,
  Cpu,
  Clock
} from 'lucide-react';

export default function IncidentFeed() {
  const {
    clusters,
    reports,
    viewMode,
    setViewMode,
    selectedIncident,
    setSelectedIncident,
    filterCategory,
    setFilterCategory,
    filterSeverity,
    setFilterSeverity,
    filterResource,
    setFilterResource,
    searchQuery,
    setSearchQuery,
    updateStatus,
    setIsResourceDrawerOpen
  } = useResQ();

  const [expandedId, setExpandedId] = useState(null);
  const feedContainerRef = useRef(null);

  // Auto-scroll to selected incident when it changes (e.g. from map button)
  useEffect(() => {
    if (selectedIncident && feedContainerRef.current) {
      const el = feedContainerRef.current.querySelector(
        `[data-incident-id="${selectedIncident.id}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIncident]);

  // Filter Logic
  const itemsToFilter = viewMode === 'CLUSTERS' ? clusters : reports;

  const filteredItems = itemsToFilter.filter(item => {
    // Search matching
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const textToSearch = (item.title || '') + ' ' + (item.rawText || '') + ' ' + (item.locationName || '') + ' ' + (item.category || '');
      if (!textToSearch.toLowerCase().includes(q)) return false;
    }

    // Severity matching
    if (filterSeverity !== 'ALL') {
      if (item.severity !== parseInt(filterSeverity, 10)) return false;
    }

    // Category matching
    if (filterCategory !== 'ALL') {
      if (item.category !== filterCategory) return false;
    }

    // Resource matching
    if (filterResource !== 'ALL') {
      const itemResources = item.combinedResources || item.resourceNeeds || [];
      if (!itemResources.includes(filterResource)) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl border border-slate-800 overflow-hidden">
      
      {/* Feed Control Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 space-y-2.5">
        
        {/* View Mode Tabs (Clusters vs Raw Reports) */}
        <div className="flex items-center justify-between">
          <div className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('CLUSTERS')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'CLUSTERS'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Unified Clusters ({clusters.length})</span>
            </button>

            <button
              onClick={() => setViewMode('REPORTS')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'REPORTS'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Raw Signals ({reports.length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono-code text-slate-400">
            Showing {filteredItems.length} items
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search locations, text signals, hazards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          {/* Severity Buttons */}
          {['ALL', '5', '4', '3'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded border ${
                filterSeverity === sev
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {sev === 'ALL' ? 'All Severities' : `Sev ${sev}`}
            </button>
          ))}

          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-0.5 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Flood">Flood</option>
            <option value="Fire">Fire</option>
            <option value="Building Collapse">Building Collapse</option>
            <option value="Medical">Medical</option>
            <option value="Power / Grid">Power / Grid</option>
          </select>

          {/* Resource Need Filter */}
          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-0.5 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Resources Needed</option>
            <option value="Evacuation Boat">Evacuation Boat</option>
            <option value="Medical">Medical</option>
            <option value="Search & Rescue">Search & Rescue</option>
            <option value="Power Generator">Power Generator</option>
            <option value="Fire Engine">Fire Engine</option>
          </select>
        </div>

      </div>

      {/* Feed List Items */}
      <div ref={feedContainerRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No incident reports matching active filters.
          </div>
        ) : (
          filteredItems.map(item => {
            const isSelected = selectedIncident?.id === item.id;
            const isExpanded = expandedId === item.id;
            const isCritical = item.severity >= 5;

            const severityBadgeColor = item.severity === 5
              ? 'bg-rose-950/80 text-rose-400 border-rose-800'
              : item.severity === 4
              ? 'bg-amber-950/80 text-amber-400 border-amber-800'
              : 'bg-yellow-950/80 text-yellow-400 border-yellow-800';

            const statusColor = item.status === 'Resolved'
              ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
              : item.status === 'In Progress'
              ? 'text-cyan-400 bg-cyan-950/80 border-cyan-800'
              : item.status === 'Dispatched'
              ? 'text-amber-400 bg-amber-950/80 border-amber-800'
              : 'text-slate-400 bg-slate-900 border-slate-800';

            return (
              <div
                key={item.id}
                data-incident-id={item.id}
                onClick={() => setSelectedIncident(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800/80'
                }`}
              >
                {/* Item Top Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    
                    {/* Severity Badge */}
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border ${severityBadgeColor}`}>
                      SEV {item.severity}/5
                    </span>

                    {/* Category Chip */}
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 rounded">
                      {item.category}
                    </span>

                    {/* Duplicate Cluster Count Badge */}
                    {item.reportCount && item.reportCount > 1 && (
                      <span className="px-2 py-0.5 text-[10px] font-mono-code bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 rounded flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-indigo-400" />
                        {item.reportCount} Duplicates Clustered
                      </span>
                    )}

                    {/* AI Confidence Score */}
                    {item.confidenceScore && (
                      <span className="text-[10px] text-slate-400 font-mono-code">
                        AI Match: {Math.round(item.confidenceScore * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown selector */}
                  <select
                    value={item.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${statusColor}`}
                  >
                    <option value="Unassigned" className="bg-slate-900 text-slate-300">Unassigned</option>
                    <option value="Dispatched" className="bg-slate-900 text-amber-300">Dispatched</option>
                    <option value="In Progress" className="bg-slate-900 text-cyan-300">In Progress</option>
                    <option value="Resolved" className="bg-slate-900 text-emerald-300">Resolved</option>
                  </select>
                </div>

                {/* Title & Location */}
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mb-1 font-heading">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{item.title || item.locationName}</span>
                </h3>

                {/* Raw Text Snippet */}
                <p className="text-[11px] text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                  {item.rawText || (item.reports ? item.reports[0].rawText : '')}
                </p>

                {/* Extracted Entities & Resource Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  
                  {/* Trapped Victims Count */}
                  {(item.totalVictims > 0 || item.extractedEntities?.trappedVictims > 0) && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-800/60 rounded flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {item.totalVictims || item.extractedEntities?.trappedVictims} Victims
                    </span>
                  )}

                  {/* Resource Needs Badges */}
                  {(item.combinedResources || item.resourceNeeds || []).map((res, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] bg-slate-950 text-cyan-300 border border-cyan-900/60 rounded font-medium"
                    >
                      🏷️ {res}
                    </span>
                  ))}

                  {/* Assigned Agency Tag */}
                  {item.assignedAgency && (
                    <span className="px-2 py-0.5 text-[10px] bg-slate-950 text-emerald-300 border border-emerald-900/60 rounded font-medium flex items-center gap-1 ml-auto">
                      <Shield className="w-3 h-3" /> {item.assignedAgency}
                    </span>
                  )}
                </div>

                {/* Expand Cluster Details Toggle */}
                {item.reports && item.reports.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : item.id);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      <span>{isExpanded ? 'Hide' : 'View'} {item.reports.length} Merged Intel Signals</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsResourceDrawerOpen(true);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <Box className="w-3 h-3" /> Dispatch Resource
                    </button>
                  </div>
                )}

                {/* Expanded Merged Reports Sub-list */}
                {isExpanded && item.reports && (
                  <div className="mt-2 pl-3 border-l-2 border-cyan-500/50 space-y-2 py-1 text-[11px] bg-slate-950/60 rounded-r-lg p-2">
                    {item.reports.map((sub, idx) => (
                      <div key={sub.id || idx} className="text-slate-300">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className="font-mono-code font-bold text-cyan-300">[{sub.sourceType}] {sub.sourceName}</span>
                          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="italic text-slate-200">"{sub.rawText}"</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
