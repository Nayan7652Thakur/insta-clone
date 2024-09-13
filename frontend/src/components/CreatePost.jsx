import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);


    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async (e) => {
        e.preventDefault();
        
        if (loading) return;
    
        const formData = new FormData();
        formData.append("caption", caption);
        if (file) formData.append("image", file);
    
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/api/v2/post/addpost', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error Response:', errorData);
                throw new Error(errorData.message || 'Failed to create post');
            }
    
            const data = await res.json();
            setOpen(false);
            dispatch(setPosts([data.post, ...posts]));
            toast.success(data.message || 'Post created successfully');
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    const resetForm = () => {
        setCaption("");
        setFile("");
        setImagePreview("");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
            <DialogHeader className="text-center font-semibold">
                Create a New Post
            </DialogHeader>
            <div className="flex gap-3 items-center">
                <Avatar>
                    <AvatarImage src={user?.profilePicture || '/default-profile.png'} alt="Profile" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                <h1 className="font-semibold text-xs">{user?.userName || 'No UserName'}</h1>
                    <span className="text-gray-600 text-xs">{user?.bio || 'No bio available'}</span>
                </div>
            </div>
            <Textarea
                className="focus-visible:ring-transparent border-none"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            {imagePreview && (
                <div className="w-full h-64 flex items-center justify-center">
                    <img
                        src={imagePreview}
                        alt="preview"
                        className="object-cover w-full h-full rounded-md"
                    />
                </div>
            )}
            <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
            <Button
                onClick={() => imageRef.current.click()}
                className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
                aria-label="Select image from computer"
            >
                Select from computer
            </Button>
            {imagePreview && (
                <div className="mt-4">
                    {loading ? (
                        <Button disabled className="flex items-center justify-center w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </Button>
                    ) : (
                        <Button
                            onClick={createPostHandler}
                            className="w-full"
                            aria-label="Create post"
                        >
                            Post
                        </Button>
                    )}
                </div>
            )}
        </DialogContent>
    </Dialog>
);
};

export default CreatePost;

