import { Router } from 'express';

const router = Router();

// Rota de verificação de status da API
router.get('/', (req, res) => {
  res.json({ status: 'API funcionando corretamente!' });
});

export default router;
