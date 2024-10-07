import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        messages: [], // Make sure messages is an empty array by default
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload; // action.payload should be an array
        }
    }
});

export const { setOnlineUsers, setMessages } = chatSlice.actions;

export default chatSlice.reducer