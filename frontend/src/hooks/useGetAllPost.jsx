import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();

    useEffect(() => {
       const fetchAllPost = async () => {
    try {
        const res = await fetch('http://localhost:8000/api/v2/post/all', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch posts');
        }

        const data = await res.json();
        if (data.success) {
            dispatch(setPosts(data.posts));
            console.log(data.posts);
        } else {
            console.error('Server error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};


        fetchAllPost(); 
    }, [dispatch]); // Added dispatch to dependency array
};

export default useGetAllPost;
