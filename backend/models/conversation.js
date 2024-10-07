import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId, // The type should be ObjectId
    ref: 'User' // It references the 'User' model
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId, // The type should be ObjectId
    ref: 'Message' // It references the 'Message' model
  }]
});

export const Conversation = mongoose.model('Conversation', conversationSchema);
