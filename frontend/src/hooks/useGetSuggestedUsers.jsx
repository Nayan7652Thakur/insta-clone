import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController instance
        // Inside your useGetSuggestedUsers hook
        const fetchSuggestedUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:8000/api/v2/user/suggested', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch suggested users');
                }

                const data = await res.json();
                console.log('API Response:', data); // Check the API response here
                if (data.success) {
                    dispatch(setSuggestedUsers(data.users)); // Ensure this is the correct path in your response
                } else {
                    setError(data.message);
                    console.error('Server error:', data.message);
                }
            } catch (error) {
                console.error('Error:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };


        fetchSuggestedUsers();

        return () => {
            controller.abort(); // Abort the fetch when component unmounts
        };
    }, [dispatch]);

    return { loading, error }; // Return loading and error states
};

export default useGetSuggestedUsers;