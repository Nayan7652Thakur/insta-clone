import { setSuggestedUsers } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const getSuggestedUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v2/user/suggested', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (data.success) {
                    dispatch(setSuggestedUsers(data.users)); // Ensure this action is being called
                }
            } catch (error) {
                console.error('Error fetching suggested users:', error);
            }
        };

        fetchSuggestedUsers();
    }, [dispatch]);
};

export default getSuggestedUsers;
