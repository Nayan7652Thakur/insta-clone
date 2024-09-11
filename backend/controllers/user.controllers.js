import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check if all required fields are provided
        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false,
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use. Please try a different email.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });
        await newUser.save();

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Populate posts ensuring null posts are filtered out
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                return (post && post.author.equals(user._id)) ? post : null;
            })
        ).then(results => results.filter(post => post !== null));

        // Prepare the user data without exposing the password
        user = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        };

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.userName}`,
            success: true,
            user
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({
            message: 'Server error.',
            success: false
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate({ path: 'posts', options: { sort: { createdAt: -1 } } }).populate('bookmarks');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            try {
                cloudResponse = await cloudinary.uploader.upload(fileUri);
            } catch (uploadError) {
                console.error('Error uploading image to Cloudinary:', uploadError);
                return res.status(500).json({
                    message: 'Failed to upload profile picture.',
                    success: false
                });
            }
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.error('Error during profile update:', error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers.length) {
            return res.status(404).json({
                message: 'No suggested users available.',
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });
    } catch (error) {
        console.error('Error fetching suggested users:', error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;

        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself.',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ]);
            return res.status(200).json({ message: 'Unfollowed successfully.', success: true });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ]);
            return res.status(200).json({ message: 'Followed successfully.', success: true });
        }
    } catch (error) {
        console.error('Error during follow/unfollow:', error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};
