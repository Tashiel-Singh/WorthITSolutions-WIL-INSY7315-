import express from 'express';
import cors from 'cors';
import { GrowthEngineService } from './services/GrowthEngineService.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check / status endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ONLINE', mode: 'LOCAL_SECURE_DEMO' });
});

// Core Stochastic Growth Velocity Endpoint
app.post('/api/v1/finance/growth-velocity', (req, res) => {
  try {
    const params = req.body;

    if (!params || typeof params.cashFlowVolatility !== 'number' || params.cashFlowVolatility <= 0) {
      return res.status(400).json({ 
        status: 'ERROR', 
        message: 'Invalid parameters: cashFlowVolatility must be a positive number.' 
      });
    }

    // Call the static method directly
    const report = GrowthEngineService.modelStochasticVelocity(params);
    return res.status(200).json({ status: 'SUCCESS', data: report });
  } catch (error: any) {
    return res.status(500).json({ status: 'CRITICAL_ERROR', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[ERP BACKEND] Running locally on http://localhost:${PORT}`);
});