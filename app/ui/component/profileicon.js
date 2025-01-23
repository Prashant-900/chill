"use client"
import React from 'react';
import { User } from 'lucide-react';

const ProfileIcon = ({click}) => {
  return (
      <div onClick={()=>click()} className="fixed top-6 right-6 group z-[61]">
        {/* Outer decorative ring with nature-inspired design */}
        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-green-300 to-emerald-500 rounded-full animate-spin-slow opacity-30" />
        
        {/* Main container */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-white/90 rounded-full border-2 border-green-400 overflow-hidden transition-transform hover:scale-110 shadow-lg hover:shadow-green-200/50">
          {/* Placeholder user icon or profile picture */}
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-b from-green-50 to-emerald-100">
            <User className="w-6 h-6 text-green-700" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-green-200/20 rounded-full blur-sm" />
          <div className="absolute -top-3 -left-3 w-4 h-4 bg-emerald-200/20 rounded-full blur-sm" />
        </div>

        {/* Hover tooltip */}
        <div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-2 py-1 text-sm text-green-800 bg-white/90 rounded-lg shadow-sm border border-green-200">
            Profile
          </div>
        </div>
      </div>
  );
};

export default ProfileIcon;