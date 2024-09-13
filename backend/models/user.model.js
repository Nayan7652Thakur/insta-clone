import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true }, // Ensure this field exists and is required
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

export const User = mongoose.model('User', userSchema);
