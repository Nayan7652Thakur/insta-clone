import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Ensure senderId is always provided
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Ensure receiverId is always provided
    },
    message: {
        type: String,
        required: true // Message content is required
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export const Message = mongoose.model('Message', messageSchema);
