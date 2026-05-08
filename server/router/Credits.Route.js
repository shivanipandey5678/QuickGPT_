
import express from 'express';
import { authMiddleware } from '../middleware/Auth.js';
import { getPlans, purchasePlans } from '../controllers/Creadit.Controller.js'

const creditRouter = express.Router();


creditRouter.get('/plan',getPlans);
creditRouter.post('/purchase', authMiddleware, purchasePlans)

export default creditRouter;