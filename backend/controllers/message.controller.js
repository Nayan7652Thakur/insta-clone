import { Conversation } from '../models/conversation.js'
import { getReceiverSocketId, io } from '../socket/Socket.js';
import {Message} from '../models/message.model.js'

export const sendMessage = async (req, res) => {

    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;

        console.log(message);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }


        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if (newMessage) conversation.messages.push(newMessage._id)

        await Promise.all([conversation.save(), newMessage.save()])


        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new Message', newMessage)
        }


        return res.status(201).json({
            success: true,
            newMessage
        })


    } catch (error) {
        console.log(error);
    }

}



export const getMessage = async (req, res) => {

    try {

        const senderId = req.body;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) res.status(200).json({ success: true, messages: [] })

        return res.status(200).json({ success: true, messages: conversation?.messages })


    } catch (error) {
        console.log(error);
    }

}