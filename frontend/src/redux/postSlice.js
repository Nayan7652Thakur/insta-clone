import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [], // Initialize with an empty array
        selectedPost: null
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload; // Updates posts with new data
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload
        }
    }
});

// Export the action to be used in components
export const { setPosts, setSelectedPost } = postSlice.actions;

// Export the reducer to be used in the store
export default postSlice.reducer;
