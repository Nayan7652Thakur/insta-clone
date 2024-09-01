import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { getMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// Update routes if needed
router.post('/send/:id', isAuthenticated, sendMessage);
router.get('/all/:id', isAuthenticated, getMessage);


export default router;
