import express from 'express';
const messageRouter = express.Router();
import {textMessageController ,imageMessageController} from '../controllers/Message.Controller.js';
import { authMiddleware } from '../middleware/Auth.js';

messageRouter.post('/text',authMiddleware ,textMessageController);
messageRouter.post('/image',authMiddleware ,imageMessageController);

export default messageRouter;