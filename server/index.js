import express from 'express';
import cors from 'cors';
import incidentsRouter from './routes/incidents.js';
import triageRouter from './routes/triage.js';
import coordinationRouter from './routes/coordination.js';
import resourcesRouter from './routes/resources.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/incidents', incidentsRouter);
app.use('/api/triage', triageRouter);
app.use('/api/coordination', coordinationRouter);
app.use('/api/resources', resourcesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', system: 'ResQAI Core Backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[ResQAI Server] Running on http://localhost:${PORT}`);
});
