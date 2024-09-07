import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [], // Initialize with an empty array
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload; // Updates posts with new data
        }
    }
});

// Export the action to be used in components
export const { setPosts } = postSlice.actions;

// Export the reducer to be used in the store
export default postSlice.reducer;
