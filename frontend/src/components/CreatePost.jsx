import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const CreatePost = ({ open, setOpen }) => {

const imageRef = useRef()

const [file, setFile] = useState("")
const [caption, setCaption] = useState("")


const fileChangeHandler = (e) => {

}


    const createPostHandler = async (e) => {
        e.preventDefault();

        try {

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={() => setOpen(false)}> {/* Corrected the prop name */}
                <DialogHeader className='text-center font-semibold'> Create a New Post </DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src='' alt='img'/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className='font-semibold text-xs'>username</h1>
                        <span className='text-gray-600 text-xs'>Bio here...</span>
                    </div>
                </div>
                <Textarea className='focus-visible:ring-transparent border-none' placeholder='Write a caption...'/>
           <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler}/>
           <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>
            Select from computer
           </Button>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
