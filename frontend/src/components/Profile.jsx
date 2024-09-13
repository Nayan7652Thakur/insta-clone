import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetUserProfile from '@/hooks/useGetUserProfile';

const Profile = () => {
  const { id: userId } = useParams(); // Get userId from route params
  const { loading, error } = useGetUserProfile(userId); // Pass userId to hook

  const { userProfile } = useSelector(store => store.auth); // Get userProfile from Redux

  console.log(userProfile);

  useEffect(() => {
    console.log("User profile in Redux:", userProfile); // Debug profile data
  }, [userProfile]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='flex max-w-4xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="Profile photo" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
