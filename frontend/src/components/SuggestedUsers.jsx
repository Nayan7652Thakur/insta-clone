import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth); // Changed to camelCase

    if (!suggestedUsers || suggestedUsers.length === 0) {
        return <p className="text-sm text-gray-600">No suggested users at the moment.</p>; // Handle empty state
    }

    return (
        <div className='my-10'>
            <div className='flex items-center justify-center text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See all</span>
            </div>

            {suggestedUsers.map((user) => (
                <div key={user._id} className='flex items-center gap-2 my-4'>
                    <Link to={`/profile/${user?._id}`}>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture || '/path/to/default-avatar.png'} alt="profile_picture" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div>
                        <h1 className='font-semibold text-sm'>
                            <Link to={`/profile/${user?._id}`}>
                                {user?.userName || 'Anonymous'}
                            </Link>
                        </h1>
                        <span className='text-gray-600 text-xs'>
                            {user?.bio || 'No bio available'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuggestedUsers;
