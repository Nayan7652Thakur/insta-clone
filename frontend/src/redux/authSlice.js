// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload; // Ensure payload includes userName
        }
    }
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
