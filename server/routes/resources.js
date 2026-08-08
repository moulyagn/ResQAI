import express from 'express';

const router = express.Router();

// Resource Inventory & Dispatch status
let resourceMatrix = [
  {
    category: "Medical",
    title: "Emergency Medical & Trauma Units",
    totalQuantity: 24,
    deployed: 14,
    available: 10,
    unit: "Ambulance / Teams",
    icon: "HeartPulse"
  },
  {
    category: "Evacuation Boat",
    title: "Water Rescue & Shallow Boats",
    totalQuantity: 12,
    deployed: 8,
    available: 4,
    unit: "Vessels",
    icon: "Ship"
  },
  {
    category: "Search & Rescue",
    title: "Heavy Urban Search & Rescue (USAR)",
    totalQuantity: 10,
    deployed: 6,
    available: 4,
    unit: "Strike Teams",
    icon: "ShieldAlert"
  },
  {
    category: "Power Generator",
    title: "Mobile Emergency Diesel Generators",
    totalQuantity: 15,
    deployed: 9,
    available: 6,
    unit: "Generators",
    icon: "Zap"
  },
  {
    category: "Temporary Shelter",
    title: "Emergency Cots & Blanket Units",
    totalQuantity: 500,
    deployed: 320,
    available: 180,
    unit: "Kits",
    icon: "Home"
  },
  {
    category: "Fire Engine",
    title: "Pumper Engines & Water Tenders",
    totalQuantity: 18,
    deployed: 11,
    available: 7,
    unit: "Trucks",
    icon: "Flame"
  }
];

// GET resource matrix
router.get('/', (req, res) => {
  res.json({ resources: resourceMatrix });
});

// POST dispatch resource to an incident
router.post('/dispatch', (req, res) => {
  const { resourceCategory, count, incidentId } = req.body;

  const targetResource = resourceMatrix.find(r => r.category === resourceCategory);
  if (!targetResource) {
    return res.status(404).json({ error: 'Resource category not found' });
  }

  const dispatchAmount = parseInt(count || 1, 10);
  if (targetResource.available < dispatchAmount) {
    return res.status(400).json({ error: `Not enough available units. Only ${targetResource.available} left.` });
  }

  targetResource.available -= dispatchAmount;
  targetResource.deployed += dispatchAmount;

  res.json({
    message: `Dispatched ${dispatchAmount} ${targetResource.unit} to ${incidentId || 'Incident'}`,
    resources: resourceMatrix
  });
});

export default router;
