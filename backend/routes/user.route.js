import express from 'express';
import {
    register,
    login,
    logout,
    getProfile,
    editProfile,
    getSuggestedUsers,
    followOrUnfollow
} from '../controllers/user.controllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// User Registration and Authentication
// In user.route.js
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// User Profile
router.get('/:id/profile', isAuthenticated, getProfile);
router.patch('/profile', isAuthenticated, upload.single('profilePicture'), editProfile);

// Follow/Unfollow and Suggested Users
router.get('/suggested', isAuthenticated, getSuggestedUsers);
router.patch('/followorunfollow/:id', isAuthenticated, followOrUnfollow);

export default router;
