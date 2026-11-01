import { Request, Response } from 'express';
import { GrowthEngineService } from '../services/GrowthEngineService';

export class GrowthController {
  public static handleSimulation(req: Request, res: Response): void {
    try {
      const { initialWorkingCapital, expectedReturnDrift, cashFlowVolatility } = req.body || {};

      // Execute your stochastic model
      const report = GrowthEngineService.modelStochasticVelocity({
        initialWorkingCapital,
        expectedReturnDrift,
        cashFlowVolatility,
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

