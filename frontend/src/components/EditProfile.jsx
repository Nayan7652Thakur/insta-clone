import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth)
  return (
    <div className='flex max-w-2xl mx-auto pl-10'>
      <section className='flex flex-col gap-6 w-full'>
        <h1 className='font-bold text-xl'>
          edit profile
        </h1>
        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>

          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="profile_picture" />
              <AvatarFallback>
                CN
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className='font-bold text-sm'>{user?.userName || 'Anonymous'}</h1> {/* Ensure you access the correct field */}
              <span className='text-gray-600'>{user?.bio || 'Bio here'}</span>
            </div>
          </div>

          <input ref={imageRef} type="file" className='hidden' />
          <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] hover:bg-[#096eb1]'>
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className='font-bold text-xl mb-2'>
            Bio
          </h1>
          <Textarea name='bio' className='focus-visible:ring-transparent' />
        </div>
        <div>
          <h1 className='font-bold mb-2'>
            Gender
          </h1>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Male</SelectItem>
                <SelectItem value="banana">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

<div>
  <Button className='w-fit bg-[#0095F6] hover: bg-[#0b67a4]'>
    Submit
  </Button>
</div>

      </section>
    </div>
  )
}

export default EditProfile
