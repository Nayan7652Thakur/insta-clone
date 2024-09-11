import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controllers.js';

const router = express.Router();

// Add a new post
router.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);

// Get all posts
router.route("/all").get(isAuthenticated, getAllPost);

// Get all posts by a specific user
router.route("/userpost/all").get(isAuthenticated, getUserPost);

// Like a post
router.route("/:id/like").post(isAuthenticated, likePost);

// Dislike a post
router.route("/:id/dislike").post(isAuthenticated, dislikePost);

// Add a comment to a post
router.route("/:id/comment").post(isAuthenticated, addComment);

// Get all comments for a post
router.route("/:id/comments").get(isAuthenticated, getCommentsOfPost);

// Delete a post
router.route("/delete/:id").delete(isAuthenticated, deletePost);

// Bookmark or unbookmark a post
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);

export default router;
