import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'


const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
        icon: (
            <Avatar className='w-6 h-6'>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ), text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" }
]


const LeftSidebar = () => {
    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div key={index} className='flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    {item.text}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default LeftSidebar
