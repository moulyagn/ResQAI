import express from 'express';
import { parseAndTriageReport } from '../services/aiEngine.js';

const router = express.Router();

// POST parse text directly without immediately saving to active dataset
router.post('/parse', async (req, res) => {
  try {
    const { rawText, sourceInfo } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required for AI parsing' });
    }

    const triageResult = await parseAndTriageReport(rawText, sourceInfo || {});
    res.json({
      success: true,
      triage: triageResult
    });
  } catch (error) {
    res.status(500).json({ error: 'AI Triage processing failed', details: error.message });
  }
});

export default router;
