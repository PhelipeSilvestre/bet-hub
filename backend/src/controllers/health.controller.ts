import { Request, Response } from 'express';

class HealthController {
  static checkStatus(req: Request, res: Response) {
    res.json({
      status: 'API funcionando corretamente!',
      timestamp: new Date(),
    });
  }
}

export default HealthController;
