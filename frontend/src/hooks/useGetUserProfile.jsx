import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8000/api/v2/user/${userId}/profile`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await res.json();
                if (data.success) {
                    dispatch(setUserProfile(data.user));
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

        fetchUserProfile(); // Fetch without AbortController

    }, [userId, dispatch]);

    return { loading, error };
};

export default useGetUserProfile;
