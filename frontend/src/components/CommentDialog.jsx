import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({ open, setOpen }) => {
  const { selectedPost, posts } = useSelector((store) => store.post);

  // Initialize comment state safely with a fallback empty array if undefined
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };


useEffect(() => {
  if (selectedPost) {
    setComment(selectedPost.comments)
  }
},[selectedPost])



  const sendMessageHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v2/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedcommentData = [...comment, res.data.comment];
        setComment(updatedcommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedcommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to send the comment');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="Comment Image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author?.userName}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {
                // Safely map over the comments only if `comment` exists and is an array
                comment?.length > 0 ? (
                  comment.map((comment) => <Comment key={comment._id} comment={comment} />)
                ) : (
                  <p>No comments yet</p> // Display message when no comments exist
                )
              }
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="add a comment..."
                  value={text}
                  onChange={changeEventHandler}
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                />
                <Button
                  onClick={sendMessageHandler}
                  variant="outline"
                  disabled={!text.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
