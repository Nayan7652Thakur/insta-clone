import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Register User
export const register = async (req, res) => {
    const { userName, email, password } = req.body;

    console.log('Request Body:', req.body); // Add this line for debugging

    try {
        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email is already in use. Try a different email.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            userName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully!",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '31d' });

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production', // Set secure flag if in production
            maxAge: 31 * 24 * 60 * 60 * 1000  // 31 days in milliseconds
        }).json({
            message: `Welcome back, ${user.userName}`,
            success: true,
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                posts: user.posts
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Logout User
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'User logged out',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};

// Get User Profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};

// Edit User Profile
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse?.secure_url || '';

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};

// Get Suggested Users
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");

        if (!suggestedUsers || suggestedUsers.length === 0) {
            return res.status(400).json({
                message: 'Currently, there are no users',
                success: true
            });
        }

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Follow or Unfollow User
export const followOrUnfollow = async (req, res) => {
    try {
        const followerId = req.id;
        const targetUserId = req.params.id;

        if (followerId === targetUserId) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followerId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.following.includes(targetUserId);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followerId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: followerId } })
            ]);
            return res.status(200).json({ message: 'Unfollowed', success: true });
        } else {
            await Promise.all([
                User.updateOne({ _id: followerId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: followerId } })
            ]);
            return res.status(200).json({ message: 'Followed', success: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
