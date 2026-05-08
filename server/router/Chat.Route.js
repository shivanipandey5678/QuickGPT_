import {createChat ,getAllChats ,deleteChat} from '../controllers/Chat.Controller.js'
import express from 'express';
const ChatRouter = express.Router();
import { authMiddleware } from '../middleware/Auth.js';

ChatRouter.get('/new',authMiddleware,createChat);
ChatRouter.post('/delete',authMiddleware ,deleteChat);
ChatRouter.get('/all-chats',authMiddleware,getAllChats);

export default ChatRouter