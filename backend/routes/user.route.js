import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controllers.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// User registration
router.route('/register').post(register);

// User login
router.route('/login').post(login);

// User logout
router.route('/logout').post(logout); // Changed to POST

// Get user profile by ID
router.route('/:id/profile').get(isAuthenticated, getProfile);

// Edit user profile
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile); // Changed to PUT

// Get suggested users
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);

// Follow or unfollow a user
router.route('/follow/:id').post(isAuthenticated, followOrUnfollow); // Changed route to /follow/:id for clarity

export default router;
