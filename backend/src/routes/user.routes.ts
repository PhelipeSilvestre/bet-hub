import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de usuário requerem autenticação
router.use(authenticate);

// Rotas de perfil
router.get('/profile', UserController.getUserProfile);
router.put('/profile', UserController.updateUserProfile);
router.put('/password', UserController.updatePassword);
router.delete('/profile', UserController.deleteUser);

// Rotas de saldo
router.post('/deposit', UserController.deposit);
router.post('/withdraw', UserController.withdraw);

// Rotas de apostas do usuário
router.get('/bets', UserController.getUserBets);

// Rotas administrativas (podem ser protegidas por middleware de admin no futuro)
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

export default router;
