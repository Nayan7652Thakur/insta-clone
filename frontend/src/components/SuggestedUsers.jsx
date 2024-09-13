import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers, loading, error } = useSelector((store) => store.auth); // Corrected: suggestedUsers instead of SuggestedUsers
    

    if (loading) return <p>Loading suggested users...</p>; // Handle loading state
    if (error) return <p>Error loading suggested users: {error}</p>; // Handle error state
    if (!suggestedUsers || suggestedUsers.length === 0) return <p>No suggested users available.</p>; // Handle empty array

    return (
        <div className='my-10'>
            <div className='flex items-center justify-center text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See all</span>
            </div>

            {suggestedUsers.map((user) => (
                <div key={user._id} className='flex items-center justify-between my-5'>
                    <div className='flex items-center gap-2'>
                        <Link to={`/profile/${user?._id}`}>
                            <Avatar>
                                <AvatarImage src={user?.profilePicture} alt="profile_picture" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                            <h1 className='font-semibold text-sm'>
                                <Link to={`/profile/${user?._id}`}>{user?.userName || 'Anonymous'}</Link>
                            </h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here'}</span>
                        </div>
                    </div>
                    <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#2d8bc9]'>Follow</span>
                </div>
            ))}
        </div>
    );
};

export default SuggestedUsers;
