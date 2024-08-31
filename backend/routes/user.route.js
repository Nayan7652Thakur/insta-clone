import express from 'express';
import { register, login, logout, getProfile, editProfile, getSuggestedUsers, followOrUnfollow } from '../controllers/user.controllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Update routes if needed
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/:id/profile', isAuthenticated, getProfile);
router.post('/profile/edit', isAuthenticated, upload.single('profilePicture'), editProfile);
router.get('/suggested', isAuthenticated, getSuggestedUsers);
router.post('/followorunfollow/:id', isAuthenticated, followOrUnfollow);

export default router;
