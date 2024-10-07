import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import {getReceiverSocketId, io} from '../socket/Socket.js'

// Add a new post
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id; // Ensure this is set correctly from your authentication middleware

        // Debug: Check the user before proceeding
        const user = await User.findById(authorId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.userName) {
            return res.status(400).json({ message: 'User does not have a username' });
        }

        if (!image) return res.status(400).json({ message: 'Image required' });

        // Image upload
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        // Create new post
        let post = await Post.create({
            userName: user.userName,
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        // Update the user's posts array
        user.posts.push(post._id);
        await user.save();

        // Populate the author field to include the username and profilePicture
        post = await post.populate('author', 'userName profilePicture');

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });

    } catch (error) {
        console.error('Error in addNewPost:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};



// Get all posts
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'userName profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'userName profilePicture'
                }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Get posts by user
export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'userName profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'userName profilePicture'
                }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Like a post
export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await post.save();

        const user = await User.findById(likeKrneWalaUserKiId).select('userName profilePicture');
        const postOwnerId = post.author.toString();

        if (postOwnerId !== likeKrneWalaUserKiId) {
            // Emit notification if socket logic is defined
            const notification = {
                type: 'like',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post liked', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Dislike a post
export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();

        const user = await User.findById(likeKrneWalaUserKiId).select('userName profilePicture');
        const postOwnerId = post.author.toString();

        if (postOwnerId !== likeKrneWalaUserKiId) {
            // Emit notification if socket logic is defined
            const notification = {
                type: 'dislike',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Your post was disliked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post disliked', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Add a comment to a post
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id; // Id of the user making the comment
        const { text } = req.body;

        // Fetch the user making the comment
        const user = await User.findById(authorId);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!text) {
            return res.status(400).json({ message: 'Text is required', success: false });
        }

        // Create the comment
        const comment = await Comment.create({
            userName: user.userName,  // Correct reference to userName
            text,
            author: authorId,         // Comment author
            post: postId              // Associated post
        });

        // Populate the author field with userName and profilePicture
        await comment.populate({
            path: 'author',
            select: 'userName profilePicture'
        });

        // Find the post and push the comment to its comments array
        const post = await Post.findById(postId);
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment added',
            comment,
            success: true
        });

    } catch (error) {
        console.error('Error in addComment:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};


// Get comments of a post
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'userName profilePicture');

        if (!comments) return res.status(404).json({ message: 'No comments found for this post', success: false });

        return res.status(200).json({ success: true, comments });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized', success: false });

        await Post.findByIdAndDelete(postId);

        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Bookmark or unbookmark a post
export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            // Remove from bookmarks
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmarks', success: true });
        } else {
            // Add to bookmarks
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};
