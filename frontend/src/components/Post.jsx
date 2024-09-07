import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useSelector } from 'react-redux'

const Post = ({post}) => {

    const [text, setText] = useState("")
    const [open, setOpen] = useState(false)
    const { user } = useSelector((store) => store.auth);


console.log(user)
console.log(user.username);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }


    }


    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={postMessage.author?.profilePicture} alt="post_image" />
                        <AvatarFallback>
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <h1>{user.userName}</h1>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button varient='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>
                            Unfollow
                        </Button>
                        <Button varient='ghost' className='cursor-pointer w-fit'>
                            Add to favorite
                        </Button>
                        <Button varient='ghost' className='cursor-pointer w-fit'>
                            Delete
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img src={post.image} />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle className='cursor-pointer hover:text-gray-600' onClick={() => setOpen(true)} />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>
               {post.likes.length}
               likes
            </span>

            <p>
                <span className='font-medium mr-2'>
                   {user.userName}
                </span>
                    {post.caption}
            </p>
            <span onClick={() => setOpen(true)} className='cursor-pointer text-sm text-gray-400'>view all 10 comments</span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input type="text"
                    placeholder='Add a comment...'
                    className='outline-none text-sm w-full'
                    value={text}
                    onChange={changeEventHandler}
                />

                {
                    text && <span className='text-[#3BADF8]'>Post</span>
                }


            </div>
        </div>
    )
}

export default Post
