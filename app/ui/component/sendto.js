import React, { useRef } from "react";
import { X } from "lucide-react";

const Sendto = ({ isOpen, onClose, friends,settouser,setisopenpop }) => {
    const first = useRef(null)
 
    const handlesend = (friend) => {
        first.current.click()
        settouser(friend)
        setisopenpop(true)
    }
  return isOpen ? (
    <>
    
    <div className="fixed z-[100] inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
    <div>
    <img src="/glassoflower.gif" className="w-20 self-start" alt="" />
    </div>
      <div className="relative bg-white/90 backdrop-blur-md rounded-lg shadow-lg w-11/12 max-w-3xl p-6 animate-scaleUp overflow-hidden">
        {/* Close Button */}
        <div className="absolute top-3 right-3">
          <button
          ref={first}
            onClick={onClose}
            className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-semibold items-center text-pink-700 mb-4 text-center">
           Send To Your Friends 
        </h2>

        {/* Friends List */}
        <div className="space-y-4 overflow-y-auto max-h-[400px] scrollbar-custom">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-pink-50 border border-pink-200 rounded-lg p-1"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full border-2 border-pink-300"
                  />
                  <div>
                    <h3 className="font-medium text-xl text-pink-800">{friend.username}</h3>
                  </div>
                </div>
                <button
                  className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600"
                  onClick={() => handlesend(friend)}
                >
                  Send
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-pink-600">No friends found!</div>
          )}
        </div>
      </div>

      {/* Animation and Scrollbar Style */}
      <style jsx>{`
        @keyframes scaleUp {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
    </>
  ) : null;
};

export default Sendto;
