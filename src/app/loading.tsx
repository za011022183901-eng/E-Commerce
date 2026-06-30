import { SplineIcon } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 ">
      
      {/* Fancy Spinner */}
      <div className="w-20 h-20 border-8 border-blue-500 border-t-transparent border-r-purple-500 border-b-pink-500 border-l-yellow-400 rounded-full animate-spin"></div>
      
      {/* Text */}
      <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-800 animate-pulse">
        shopMart
        <SplineIcon className="w-6 h-6 text-blue-500 animate-bounce" />
      </h1>
      
    </div>
  )
}
