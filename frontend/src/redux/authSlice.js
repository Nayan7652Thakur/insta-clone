// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: []
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload; // Ensure payload includes userName
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        }
    }
});

export const { setAuthUser, setSuggestedUsers } = authSlice.actions;
export default authSlice.reducer;
