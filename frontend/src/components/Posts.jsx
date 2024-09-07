import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
    const { posts } = useSelector((store) => store.post);
    console.log(posts);
    // Access user from auth slice

    return (
        <div>
            {posts?.length > 0 ? (
                posts.map((post) => {
                    return <Post key={post._id} post={post} />;
                })
            ) : (
                <p>No posts available</p> // Message if no posts exist
            )}
        </div>
    );
};

export default Posts;
