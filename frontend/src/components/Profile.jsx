import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetUserProfile from '@/hooks/useGetUserProfile';

const Profile = () => {
  const { id: userId } = useParams(); // Get userId from route params
  const { loading, error } = useGetUserProfile(userId); // Pass userId to hook

  const userProfile = useSelector(store => store.auth.userProfile); // Get userProfile from Redux

  useEffect(() => {
    console.log("User profile in Redux:", userProfile); // Debug profile data
  }, [userProfile]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {userProfile ? (
        <div>
          <Avatar>
            <AvatarImage src={userProfile.profilePicture} alt="Profile photo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>{userProfile.userName}</p>
          <p>{userProfile.bio}</p> {/* Display user bio, etc. */}
        </div>
      ) : (
        <p>No user profile found</p>
      )}
    </div>
  );
};

export default Profile;
