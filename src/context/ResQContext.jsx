import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { SCENARIOS } from '../../server/data/mockScenarios';
import { parseAndTriageReport } from '../../server/services/aiEngine';
import { clusterReports } from '../../server/services/clusterEngine';

const ResQContext = createContext();

export function ResQProvider({ children }) {
  const [scenarioKey, setScenarioKey] = useState('HURRICANE_VANCE');
  const [reports, setReports] = useState(SCENARIOS.HURRICANE_VANCE.initialReports);
  const [clusters, setClusters] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    activeClusters: 0,
    criticalIncidents: 0,
    dedupRatio: '0%',
    rescuedVictimsCount: 0
  });

  const [coordinationLogs, setCoordinationLogs] = useState([]);
  const [resources, setResources] = useState([]);
  
  const [viewMode, setViewMode] = useState('CLUSTERS'); // 'CLUSTERS' | 'REPORTS'
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterResource, setFilterResource] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Panels
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isSitRepOpen, setIsSitRepOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isResourceDrawerOpen, setIsResourceDrawerOpen] = useState(false);
  const [isDedupAnalysisOpen, setIsDedupAnalysisOpen] = useState(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
  const [isActiveClustersModalOpen, setIsActiveClustersModalOpen] = useState(false);
  const [isCriticalAlarmsModalOpen, setIsCriticalAlarmsModalOpen] = useState(false);
  const [isTrappedVictimsModalOpen, setIsTrappedVictimsModalOpen] = useState(false);
  const [isRawSignalsModalOpen, setIsRawSignalsModalOpen] = useState(false);

  // Live Raw Stream Simulator
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [streamNotification, setStreamNotification] = useState(null);

  // Re-calculate clusters and stats locally whenever reports change
  const refreshClustersAndStats = useCallback((updatedReports) => {
    const computedClusters = clusterReports(updatedReports);
    setClusters(computedClusters);
    
    const criticalCount = computedClusters.filter(c => c.severity >= 5).length;
    const dedup = updatedReports.length > 0
      ? ((1 - computedClusters.length / updatedReports.length) * 100).toFixed(1) + '%'
      : '0%';
    const totalVictims = computedClusters.reduce((sum, c) => sum + (c.totalVictims || 0), 0);

    setStats({
      totalReports: updatedReports.length,
      activeClusters: computedClusters.length,
      criticalIncidents: criticalCount,
      dedupRatio: dedup,
      rescuedVictimsCount: totalVictims
    });
  }, []);

  // Initial sync with API backend or fallback to local calculations
  const loadData = useCallback(async () => {
    const data = await api.fetchIncidentsData();
    if (data && data.reports) {
      setReports(data.reports);
      setClusters(data.clusters);
      setStats(data.stats);
    } else {
      // Local fallback calculation
      refreshClustersAndStats(reports);
    }

    const logsData = await api.fetchCoordinationLogs();
    if (logsData && logsData.logs) {
      setCoordinationLogs(logsData.logs);
    }

    const resData = await api.fetchResourceMatrix();
    if (resData && resData.resources) {
      setResources(resData.resources);
    }
  }, [reports, refreshClustersAndStats]);

  useEffect(() => {
    loadData();
  }, []);

  // Ingest New Report (Form or Stream)
  const ingestNewReport = async (rawText, sourceInfo = {}) => {
    // Try API ingestion first
    const result = await api.ingestReport({ rawText, ...sourceInfo });
    let newReport = null;

    if (result && result.report) {
      newReport = result.report;
    } else {
      // Client-side fallback ingestion
      newReport = await parseAndTriageReport(rawText, sourceInfo);
    }

    setReports(prev => {
      const updated = [newReport, ...prev];
      refreshClustersAndStats(updated);
      return updated;
    });
    
    setStreamNotification(`Ingested & Triaged: ${newReport.category} at ${newReport.locationName}`);
    setTimeout(() => setStreamNotification(null), 4000);

    return newReport;
  };

  // Update Incident Status or Assigned Agency
  const updateStatus = async (id, status, assignedAgency) => {
    await api.updateIncidentStatus(id, status, assignedAgency);

    setReports(prev => {
      const updated = prev.map(r => {
        if (r.id === id || r.clusterId === id) {
          return {
            ...r,
            ...(status ? { status } : {}),
            ...(assignedAgency !== undefined ? { assignedAgency } : {})
          };
        }
        return r;
      });
      refreshClustersAndStats(updated);
      return updated;
    });

    if (selectedIncident && (selectedIncident.id === id || selectedIncident.clusterId === id)) {
      setSelectedIncident(prev => ({
        ...prev,
        ...(status ? { status } : {}),
        ...(assignedAgency !== undefined ? { assignedAgency } : {})
      }));
    }
  };

  // Change Disaster Scenario
  const changeScenario = async (newKey) => {
    setScenarioKey(newKey);
    const res = await api.resetScenario(newKey);
    if (res && res.reports) {
      setReports(res.reports);
      setClusters(res.clusters);
      refreshClustersAndStats(res.reports);
    } else if (SCENARIOS[newKey]) {
      setReports(SCENARIOS[newKey].initialReports);
      refreshClustersAndStats(SCENARIOS[newKey].initialReports);
    }
    setSelectedIncident(null);
  };

  // Add Log Entry to Coordination Timeline
  const addLogEntry = async (entryData) => {
    const res = await api.postCoordinationLog(entryData);
    if (res && res.logs) {
      setCoordinationLogs(res.logs);
    } else {
      const newEntry = {
        id: `LOG-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: new Date().toISOString(),
        ...entryData
      };
      setCoordinationLogs(prev => [newEntry, ...prev]);
    }
  };

  // Dispatch Resource
  const dispatchUnits = async (resourceCategory, count, incidentId) => {
    const res = await api.dispatchResource(resourceCategory, count, incidentId);
    if (res && res.resources) {
      setResources(res.resources);
    } else {
      setResources(prev =>
        prev.map(r => {
          if (r.category === resourceCategory) {
            const num = parseInt(count || 1, 10);
            return {
              ...r,
              available: Math.max(0, r.available - num),
              deployed: r.deployed + num
            };
          }
          return r;
        })
      );
    }

    const agencyMap = {
      'Medical Team': 'Metro EMS & Trauma Command',
      'Evacuation Boat': 'Coast Guard Water Rescue',
      'Search & Rescue': 'USAR Task Force 1',
      'Fire Engine': 'Metro Fire Department',
      'Power Generator': 'City Utility Command',
      'Temporary Shelter': 'Red Cross Relief',
      'Heavy Engineering': 'Public Works Corps'
    };
    const agency = agencyMap[resourceCategory] || 'Joint Rescue Command';

    if (incidentId && incidentId !== 'Staging' && incidentId !== 'General Deployment') {
      updateStatus(incidentId, 'Dispatched', agency);
    }

    // Auto add log entry
    addLogEntry({
      agency: agency,
      author: "Tactical Dispatcher",
      badgeColor: "amber",
      type: "DISPATCH",
      incidentId: incidentId || 'Staging',
      content: `Dispatched ${count} unit(s) of ${resourceCategory} to Cluster ${incidentId || 'Staging'} (${agency})`
    });
  };

  // Simulated Live Ingestion Stream Effect
  const streamPool = [
    { text: "SOS! Transformer blown near 4th and Harrison! Lines sparking near water pool!", type: "SMS", name: "Citizen Hotline" },
    { text: "URGENT: Water reaching 2nd story windows near 888 Folsom St! Need rescue boats NOW! #HurricaneVance", type: "SOCIAL", name: "@metro_news_alert" },
    { text: "Gas leak smell confirmed near Market St building collapse! Evacuate surrounding 2 blocks!", type: "SOCIAL", name: "@metro_hazmat" },
    { text: "Elderly resident experiencing chest pain at 1200 Mission Care Center. Oxygen running out!", type: "SMS", name: "Care Center Staff" },
    { text: "CRITICAL: Levee wall micro-fissure observed by field squad at Bayfront Bridge!", type: "FORM", name: "Engineers Squad 4" },
    { text: "Radio Dispatch: Unit 12 requesting immediate backup for water extraction at 5th St.", type: "PHONE", name: "Dispatch Channel 3" }
  ];

  const generateSingleSimulatedSignal = async () => {
    const randomMsg = streamPool[Math.floor(Math.random() * streamPool.length)];
    return await ingestNewReport(randomMsg.text, {
      sourceType: randomMsg.type,
      sourceName: randomMsg.name,
      reporterContact: "Simulated Feed Injector"
    });
  };

  // Simulated Live Ingestion Stream Effect
  useEffect(() => {
    let interval;
    if (isStreamActive) {
      let idx = 0;
      interval = setInterval(() => {
        const msg = streamPool[idx % streamPool.length];
        ingestNewReport(msg.text, {
          sourceType: msg.type,
          sourceName: msg.name,
          reporterContact: "Live Stream Streamer"
        });
        idx++;
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isStreamActive]);

  return (
    <ResQContext.Provider
      value={{
        scenario: SCENARIOS[scenarioKey],
        scenarioKey,
        reports,
        clusters,
        stats,
        coordinationLogs,
        resources,
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
        isIntakeOpen,
        setIsIntakeOpen,
        isSitRepOpen,
        setIsSitRepOpen,
        isRoadmapOpen,
        setIsRoadmapOpen,
        isResourceDrawerOpen,
        setIsResourceDrawerOpen,
        isDedupAnalysisOpen,
        setIsDedupAnalysisOpen,
        isStreamModalOpen,
        setIsStreamModalOpen,
        isStreamActive,
        setIsStreamActive,
        streamNotification,
        ingestNewReport,
        generateSingleSimulatedSignal,
        updateStatus,
        changeScenario,
        addLogEntry,
        dispatchUnits,
        isActiveClustersModalOpen,
        setIsActiveClustersModalOpen,
        isCriticalAlarmsModalOpen,
        setIsCriticalAlarmsModalOpen,
        isTrappedVictimsModalOpen,
        setIsTrappedVictimsModalOpen,
        isRawSignalsModalOpen,
        setIsRawSignalsModalOpen
      }}
    >
      {children}
    </ResQContext.Provider>
  );
}

export function useResQ() {
  return useContext(ResQContext);
}
