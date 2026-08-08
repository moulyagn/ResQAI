import express from 'express';

const router = express.Router();

// Initial coordination log timeline entries
let coordinationLog = [
  {
    id: "LOG-501",
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    agency: "Emergency Medical Services",
    author: "Chief Paramedic Rivera",
    badgeColor: "emerald",
    incidentId: "CLS-901",
    type: "DISPATCH",
    content: "Medical Strike Team 1 dispatched to 4th & Harrison with hypothermia kits and pediatric transport gear."
  },
  {
    id: "LOG-502",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    agency: "Coast Guard Rescue",
    author: "Lt. Commander Vance",
    badgeColor: "cyan",
    incidentId: "CLS-901",
    type: "FIELD_UPDATE",
    content: "Rigid inflatable boat deployed in South Sector. 4 victims rescued from vehicle roof near Harrison St; en route to dry triage zone."
  },
  {
    id: "LOG-503",
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    agency: "Fire & Rescue Dept",
    author: "Captain Morales",
    badgeColor: "rose",
    incidentId: "CLS-902",
    type: "ANNOUNCEMENT",
    content: "Senior Community Center fire contained. Primary search complete; all 45 residents safely evacuated to West Sector shelter."
  },
  {
    id: "LOG-504",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    agency: "Civil Defense",
    author: "Director K. Chen",
    badgeColor: "amber",
    incidentId: "CLS-903",
    type: "RESOURCE_REQUEST",
    content: "URGENT: Requesting 2 heavy diesel mobile generators to be rerouted from Central Depot to St. Jude Care Center."
  }
];

// GET coordination log
router.get('/', (req, res) => {
  res.json({ logs: coordinationLog });
});

// POST new log entry
router.post('/', (req, res) => {
  const { agency, author, content, incidentId, type, badgeColor } = req.body;
  if (!agency || !content) {
    return res.status(400).json({ error: 'Agency and Content are required' });
  }

  const newEntry = {
    id: `LOG-${Math.floor(500 + Math.random() * 500)}`,
    timestamp: new Date().toISOString(),
    agency: agency || 'Joint Operations Center',
    author: author || 'Field Officer',
    badgeColor: badgeColor || 'cyan',
    incidentId: incidentId || null,
    type: type || 'STATUS_UPDATE',
    content
  };

  coordinationLog.unshift(newEntry);
  res.status(201).json({ message: 'Log entry added', log: newEntry, logs: coordinationLog });
});

export default router;
