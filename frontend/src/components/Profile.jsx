import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {


  const [activeTab, setActiveTab] = useState('posts')

  const { id: userId } = useParams(); // Get userId from route params
  const { loading, error } = useGetUserProfile(userId); // Pass userId to hook


  const { userProfile } = useSelector(store => store.auth); // Get userProfile from Redux

  const isLoggedInUserProfile = false;
  const isFollowing = true;


  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }


  const displayedPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  useEffect(() => {
    console.log("User profile in Redux:", userProfile); // Debug profile data
  }, [userProfile]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="Profile photo" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>
                  {userProfile?.userName}
                </span>

                {
                  isLoggedInUserProfile ? (
                    <>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>view archive</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad Tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' className='h-8'>unfollow</Button>
                        <Button variant='secondary' className='h-8'>message</Button>
                      </>

                    ) : (
                      <Button className='bg-[#0095F6] hover:bg-[#0365a7] h-8'>Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>Posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>
                  {userProfile?.bio || 'bio here...'}
                </span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign />
                  <span className='pl-1'>
                    {userProfile?.userName}
                  </span>
                </Badge>
                <span>
                  Learn with me
                </span>
                <span>
                  Learn with me
                </span>
                <span>
                  Learn with me
                </span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              Posts
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              saved
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ''}`} onClick={() => handleTabChange('reels')}>
              reels
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ''}`} onClick={() => handleTabChange('tags')}>
              tags
            </span>
          </div>

          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPosts?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt="postImage" className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>

                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>
                            {post?.likes.length}
                          </span>
                        </button>

                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>
                            {post?.comments.length}
                          </span>
                        </button>

                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
