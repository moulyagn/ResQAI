import React from 'react';
import { useResQ } from '../context/ResQContext';
import { 
  ShieldAlert, 
  Radio, 
  PlusCircle, 
  FileText, 
  Compass, 
  Layers, 
  Activity,
  Box
} from 'lucide-react';

export default function Navbar() {
  const {
    scenarioKey,
    changeScenario,
    scenario,
    setIsIntakeOpen,
    setIsSitRepOpen,
    setIsRoadmapOpen,
    isStreamActive,
    setIsStreamActive,
    isStreamModalOpen,
    setIsStreamModalOpen,
    setIsResourceDrawerOpen,
    streamNotification
  } = useResQ();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Telemetry */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                ResQ<span className="text-cyan-400">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono-code bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 rounded-full">
                COMMAND HUB v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Autonomous Disaster Triage & Multi-Agency Intelligence
            </p>
          </div>
        </div>

        {/* Live Notification Bar (when stream active) */}
        {streamNotification && (
          <div className="hidden xl:flex items-center px-3 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-200 text-xs font-mono-code animate-pulse">
            <Activity className="w-4 h-4 text-cyan-400 mr-2 animate-spin" />
            <span>{streamNotification}</span>
          </div>
        )}

        {/* Action Controls & Scenario Selector */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Scenario Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <span className="text-slate-400 mr-2 hidden sm:inline">Scenario:</span>
            <select
              value={scenarioKey}
              onChange={(e) => changeScenario(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="HURRICANE_VANCE" className="bg-slate-900">Hurricane Vance (Metro Flood)</option>
              <option value="EARTHQUAKE_GRID_FAIL" className="bg-slate-900">Downtown 6.8 Earthquake</option>
            </select>
          </div>

          {/* Live Stream Ingestion Toggle & Modal Trigger */}
          <button
            onClick={() => setIsStreamModalOpen(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isStreamActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-lg shadow-rose-500/10'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isStreamActive ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{isStreamActive ? 'Live Feed Streaming...' : 'Simulate Feed Stream'}</span>
          </button>

          {/* Ingestion Intake Form Trigger */}
          <button
            onClick={() => setIsIntakeOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-md shadow-cyan-600/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Intake Incident</span>
          </button>

          {/* Resource Matrix Drawer Toggle */}
          <button
            onClick={() => setIsResourceDrawerOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30"
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Resources</span>
          </button>

          {/* SitRep Brief Button */}
          <button
            onClick={() => setIsSitRepOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">SitRep Brief</span>
          </button>

          {/* Roadmap Modal Button */}
          <button
            onClick={() => setIsRoadmapOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-800/40"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Roadmap</span>
          </button>

        </div>
      </div>
    </header>
  );
}
