import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
      <div>
        
        <Avatar>
          <AvatarImage src={comment.author.profilePicture}/>
        </Avatar>
      </div>
    </div>
  )
}

export default Comment
