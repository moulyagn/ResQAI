import React from 'react';
import { ResQProvider } from './context/ResQContext';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import MapView from './components/MapView';
import IncidentFeed from './components/IncidentFeed';
import CoordinationLog from './components/CoordinationLog';
import IntakeModal from './components/IntakeModal';
import ResourceMatrix from './components/ResourceMatrix';
import SitRepModal from './components/SitRepModal';
import RoadmapModal from './components/RoadmapModal';
import DedupAnalysisModal from './components/DedupAnalysisModal';
import StreamSimulationModal from './components/StreamSimulationModal';
import ActiveClustersPanel from './components/ActiveClustersPanel';
import CriticalAlarmsPanel from './components/CriticalAlarmsPanel';
import TrappedVictimsPanel from './components/TrappedVictimsPanel';
import RawSignalsPanel from './components/RawSignalsPanel';

function ResQMainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Telemetry KPI Header */}
      <StatsHeader />

      {/* Main Command Center Grid */}
      <main className="flex-1 px-4 lg:px-6 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: MapView & Coordination Timeline (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Interactive GIS Emergency Map */}
          <div className="flex-1 min-h-[420px]">
            <MapView />
          </div>

          {/* Inter-Agency Coordination Log */}
          <div>
            <CoordinationLog />
          </div>

        </section>

        {/* Right Column: Incident & Cluster Workspace (5 cols) */}
        <section className="lg:col-span-5 flex flex-col h-full min-h-[600px]">
          <IncidentFeed />
        </section>

      </main>

      {/* Overlay Modals & Drawers */}
      <IntakeModal />
      <ResourceMatrix />
      <SitRepModal />
      <RoadmapModal />
      <DedupAnalysisModal />
      <StreamSimulationModal />

      {/* KPI Detail Panels */}
      <ActiveClustersPanel />
      <CriticalAlarmsPanel />
      <TrappedVictimsPanel />
      <RawSignalsPanel />

    </div>
  );
}

export default function App() {
  return (
    <ResQProvider>
      <ResQMainLayout />
    </ResQProvider>
  );
}
