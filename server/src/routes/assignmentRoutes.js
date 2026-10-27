import { Router } from 'express';
import { create, getOne, list, remove, update } from '../controllers/assignmentController.js';
import { requireAuth, requireCsrf } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
router.get('/', list); router.post('/', requireCsrf, create);
router.get('/:id', getOne); router.patch('/:id', requireCsrf, update); router.delete('/:id', requireCsrf, remove);
export default router;
