import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    // userName: { type: String, required: true },
    caption: { type: String, default: '' },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    timestamps: true  // Automatically creates createdAt and updatedAt fields
});

export const Post = mongoose.model('Post', postSchema);