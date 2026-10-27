import { Router } from 'express';
import { stats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router(); router.get('/stats', requireAuth, stats); export default router;
