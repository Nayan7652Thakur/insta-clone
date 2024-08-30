import express from 'express'
import { editProfile, getProfile, login, logout, register } from '../controllers/user.controllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';


const router = express.Router();

router.route('/register').post(register)

router.route('/login').post(login);

router.route('/logout').get(logout)

router.route('/:id/profile').get(isAuthenticated, getProfile)

router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile)