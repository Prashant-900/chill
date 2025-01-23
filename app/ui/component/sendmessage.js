import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Sendto from './sendto';
import SendPopup from './sendpopup';

const Sendmessage = ({friends,own}) => {
const [isopenpop, setisopenpop] = useState(false)
  const [isopen, setisopen] = useState(false)
  const [touser, settouser] = useState({})


  return (
    <>
     <SendPopup own={own} isOpen={isopenpop} onClose={()=>setisopenpop(false)} user={touser} cloudinaryUploadUrl="https://api.cloudinary.com/v1_1/dtzsk95mv/image/upload" cloudinaryPreset="ml_default"/>
    <Sendto isOpen={isopen} onClose={()=>setisopen(false)} friends={friends} setisopenpop={setisopenpop} settouser={settouser}/>
    <div onClick={()=>setisopen(true)}
      className="fixed bottom-[37%] right-[30%] w-16 h-16 flex items-center justify-center rounded-full backdrop-blur-md bg-gradient-to-r from-pink-400/20 to-purple-400/20 shadow-xl border border-white/30 transform transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95 hover:shadow-2xl"
    >
      <Send
        className="stop-motion-rotate transition-transform duration-300 ease-in-out"
        size={28}
        color="white"
      />
    </div>
    </>
  );
};

export default Sendmessage;
