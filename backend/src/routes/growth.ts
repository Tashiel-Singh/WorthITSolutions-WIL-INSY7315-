import { Router } from 'express';
import { GrowthController } from '../controllers/growth.controller';

export const growthRouter = Router();

// POST /simulate -> executes stochastic Monte Carlo & Kelly capital velocity
growthRouter.post('/simulate', GrowthController.handleSimulation);
