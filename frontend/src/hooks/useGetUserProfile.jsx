import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/redux/authSlice"; // Action to set profile in Redux

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8000/api/v2/user/${userId}/profile`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await res.json();
                console.log("Fetched user profile:", data); // Debug fetched data

                if (data.success) {
                    dispatch(setUserProfile(data.user)); // Dispatch to Redux
                } else {
                    setError(data.message);
                    console.error('Server error:', data.message);
                }
            } catch (error) {
                console.error('Error fetching profile:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile(); // Trigger fetch if userId is available
        }

        return () => {
            controller.abort(); // Clean up
        };
    }, [userId, dispatch]);

    return { loading, error }; // Return loading and error states
};

export default useGetUserProfile;
