import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import getSuggestedUsers from '@/hooks/getSuggestedUsers'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  getSuggestedUsers()
  useGetSuggestedUsers()
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home