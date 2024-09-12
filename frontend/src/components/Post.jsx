import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import axios from 'axios';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);

    console.log(user);

    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false); // Handle undefined post.likes
    const [postLike, setPostLike] = useState(post.likes?.length || 0); // Handle undefined post.likes
    const [comment, setComment] = useState(post.comments)


    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        setText(inputText.trim() || "");
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.post(`http://localhost:8000/api/v2/post/${post._id}/${action}`, {}, { withCredentials: true });

            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id == post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id != user._id) : [...p.likes, user._id]
                    } : p
                )
                dispatch(setPosts(updatedPostData))

                toast(res.data.message);
            } else {
                toast.error('Failed to update like status.');
            }
        } catch (error) {
            console.error('Error liking/disliking post:', error.response?.data || error.message);
            toast.error('An error occurred while updating like status.');
        }
    };

    const deletePost = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/v2/post/delete/${post._id}`, {
                method: 'delete',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();
                const updatedPostData = posts.filter((postItem) => postItem._id !== post._id);
                dispatch(setPosts(updatedPostData));
                console.log('Post deleted successfully');
                toast.success(data.message);
            } else {
                const errorData = await res.json();
                console.log('Failed to delete post:', errorData);
                toast.error(errorData.message || 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('An error occurred while deleting the post.');
        }
    };


    const commentHandler = async () => {
        try {

            const res = await axios.post(`http://localhost:8000/api/v2/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })

            if (res.data.success) {

                const updatedcommentData = [...comment, res.data.comment]
                setComment(updatedcommentData)

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedcommentData } : p
                )

                dispatch(setPosts(updatedPostData))

                toast(res.data.message)
                setText("")
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="profile_picture" />
                        <AvatarFallback>
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                    <h1>{post.author?.userName || 'Anonymous'}</h1> {/* Ensure you access the correct field */}
                    { user?._id === post?.author?._id && <Badge variant='semi'> Web Creator </Badge> }

                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>
                            Unfollow
                        </Button>
                        <Button variant='ghost' className='cursor-pointer w-fit'>
                            Add to favorite
                        </Button>
                        {
                            user && user._id === post.author?._id && (
                                <Button onClick={deletePost} variant='ghost' className='cursor-pointer w-fit'>
                                    Delete
                                </Button>
                            )
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img src={post.image} alt="post_image" />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>

                    {

                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }

                    <MessageCircle className='cursor-pointer hover:text-gray-600' onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpen(true)
                    }} />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>
                {postLike} likes
            </span>

            <p>
                <span className='font-medium mr-2'>
                {post.author?.userName}
                </span>
                {post.caption}
            </p>

{
    comment.length > 0 && (
            <span onClick={() => {
                dispatch(setSelectedPost(post))
                setOpen(true)
            }} className='cursor-pointer text-sm text-gray-400'>
                view all {comment.length} comments
            </span>

    )
}

            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    className='outline-none text-sm w-full'
                    value={text}
                    onChange={changeEventHandler}
                />
                {
                    text && <span className='text-[#3BADF8] cursor-pointer' onClick={commentHandler}>Post</span>
                }
            </div>
        </div>
    );
};

export default Post;
