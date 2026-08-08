import express from 'express';
import { SCENARIOS } from '../data/mockScenarios.js';
import { parseAndTriageReport } from '../services/aiEngine.js';
import { clusterReports } from '../services/clusterEngine.js';

const router = express.Router();

// Active state in memory initialized with Hurricane Vance scenario
let currentScenarioKey = 'HURRICANE_VANCE';
let activeReports = [...SCENARIOS.HURRICANE_VANCE.initialReports];
let activeClusters = clusterReports(activeReports);

// GET all incidents and clusters
router.get('/', (req, res) => {
  const clusters = clusterReports(activeReports);
  res.json({
    scenario: SCENARIOS[currentScenarioKey],
    reports: activeReports,
    clusters: clusters,
    stats: {
      totalReports: activeReports.length,
      activeClusters: clusters.length,
      criticalIncidents: clusters.filter(c => c.severity >= 5).length,
      dedupRatio: activeReports.length > 0 ? ((1 - clusters.length / activeReports.length) * 100).toFixed(1) + '%' : '0%',
      rescuedVictimsCount: clusters.reduce((acc, c) => acc + (c.totalVictims || 0), 0)
    }
  });
});

// POST new report ingestion (from Intake Form or Live Raw Stream)
router.post('/ingest', async (req, res) => {
  try {
    const { rawText, sourceType, sourceName, reporterContact, locationName, coordinates } = req.body;

    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    const triagedReport = await parseAndTriageReport(rawText, {
      sourceType: sourceType || 'FORM',
      sourceName: sourceName || 'Direct Intake Form',
      reporterContact: reporterContact || 'Emergency Dispatcher',
      locationName,
      coordinates
    });

    activeReports.unshift(triagedReport);
    activeClusters = clusterReports(activeReports);

    res.status(201).json({
      message: 'Report ingested and triaged successfully',
      report: triagedReport,
      updatedClusters: activeClusters
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to triage report', details: error.message });
  }
});

// PATCH update report / cluster status or assignment
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedAgency } = req.body;

  // Check if updating an individual report or a whole cluster
  let updatedReport = activeReports.find(r => r.id === id);
  if (updatedReport) {
    if (status) updatedReport.status = status;
    if (assignedAgency !== undefined) updatedReport.assignedAgency = assignedAgency;
  } else {
    // If it's a cluster ID, update all member reports
    const targetCluster = activeClusters.find(c => c.id === id);
    if (targetCluster) {
      targetCluster.reports.forEach(r => {
        if (status) r.status = status;
        if (assignedAgency !== undefined) r.assignedAgency = assignedAgency;
      });
    } else {
      return res.status(404).json({ error: 'Incident or Cluster not found' });
    }
  }

  activeClusters = clusterReports(activeReports);

  res.json({
    message: 'Status updated',
    reports: activeReports,
    clusters: activeClusters
  });
});

// POST reset to a scenario preset
router.post('/reset-scenario', (req, res) => {
  const { scenarioKey } = req.body;
  if (SCENARIOS[scenarioKey]) {
    currentScenarioKey = scenarioKey;
    activeReports = [...SCENARIOS[scenarioKey].initialReports];
    activeClusters = clusterReports(activeReports);
    return res.json({
      message: `Switched to scenario: ${SCENARIOS[scenarioKey].name}`,
      scenario: SCENARIOS[scenarioKey],
      reports: activeReports,
      clusters: activeClusters
    });
  }
  res.status(400).json({ error: 'Invalid scenario key' });
});

export default router;
