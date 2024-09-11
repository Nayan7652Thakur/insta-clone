import { setPosts } from "@/redux/postSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController instance
        const fetchAllPost = async () => {
            setLoading(true); // Set loading state to true before fetch
            try {
                const res = await fetch('http://localhost:8000/api/v2/post/all', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal // Attach the signal to fetch
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await res.json();
                if (data.success) {
                    dispatch(setPosts(data.posts));
                } else {
                    setError(data.message);
                    console.error('Server error:', data.message);
                }
            } catch (error) {
                if (error.name !== 'AbortError') { // Ignore the abort error
                    setError(error.message);
                    console.error('Error:', error.message);
                }
            } finally {
                setLoading(false); // Set loading to false after the fetch completes
            }
        };

        fetchAllPost();

        return () => {
            controller.abort(); // Abort the fetch when component unmounts
        };
    }, [dispatch]);

    return { loading, error }; // Optionally return loading and error states
};

export default useGetAllPost;
