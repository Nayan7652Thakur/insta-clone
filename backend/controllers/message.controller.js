import { Conversation } from '../models/conversation.js';
import { getReceiverSocketId, io } from '../socket/Socket.js';
import { Message } from '../models/message.model.js';

// Send message between two participants
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // Sender ID from authentication middleware
        const receiverId = req.params.id; // Receiver ID from URL params
        const { textMessage: message } = req.body; // Message content from request body

        // Check if a conversation exists between the two participants
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create a new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // Add the new message to the conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save the conversation
        await conversation.save();

        // Emit new message to receiver's socket if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new Message', newMessage);
        }

        // Send success response
        return res.status(201).json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

// Get messages between two participants
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id; // Sender ID from authentication middleware
        const receiverId = req.params.id; // Receiver ID from URL params

        // Find conversation between the two participants
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages'); // Populate messages for retrieval

        // If no conversation exists, return an empty message list
        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }

        // Return the messages from the conversation
        return res.status(200).json({ success: true, messages: conversation.messages });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve messages' });
    }
};
