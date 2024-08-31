import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";


export const register = async (req, res) => {
    const { userName, email, password } = req.body;  // Use userName here

    try {
        if (!userName || !email || !password) {  // Check userName
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email is already in use. Try a different email.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            userName,   // Use userName here
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
            maxAge: 31 * 24 * 60 * 60 * 1000  // Set to milliseconds
        }).json({
            message: `Welcome back, ${user.userName}`,  // Use user.userName if schema uses userName
            success: true,
            user: {
                _id: user._id,
                userName: user.userName,  // Ensure this matches schema
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


export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'user logout',
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        // Correctly exclude the 'password' field
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

        const user = await User.findById(userId).select("-password") // Corrected method name

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse?.secure_url || ''; // Added nullish coalescing

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            user
        });

    } catch (error) {
        console.error(error); // Log the error
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};

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
        return res.status(500).json({ message: "Server error", success: false });
    }
};


export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;

        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } })
            ]);
            return res.status(200).json({ message: 'Unfollowed', success: true });
        } else {
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } })
            ]);
            return res.status(200).json({ message: 'Followed', success: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
