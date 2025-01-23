"use client";

import { useState, useRef } from "react";

export default function Home({open}) {
    const [muted, setMuted] = useState(true);
    const [isTreasureClickable, setTreasureClickable] = useState(true);
    const videoRef = useRef(null);
    const treasureRef = useRef(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
        }
    };

    const handletreasure = () => {
        if (!isTreasureClickable) return; // Prevent clicking if already in progress

        setTreasureClickable(false); // Disable further clicks
        if (treasureRef.current) {
            open();
            treasureRef.current.src = "/golden.gif";
        }
        setTimeout(() => {
            if (treasureRef.current) {
                treasureRef.current.src = "/goldenstatic.gif";
            }
            setTreasureClickable(true); // Re-enable clicks after timeout
        }, 2500);
    };

    return (
        <div className="fixed w-screen h-screen overflow-hidden">
            {/* Background Video */}
            <video
                ref={videoRef}
                src="/background.mp4"
                autoPlay
                loop
                muted={muted}
                className="absolute top-0 left-0 w-full h-full object-cover"
            ></video>
            <img src="/tree.gif" className="w-52 fixed z-[61] top-[30%] -right-14" />
            <img src="/branch.gif" className="scale-x-[-1] w-44 h-40 fixed z-[61] top-[45%] -left-2" />
            <img src="/moreflower.gif" className="scale-x-[-1] w-18 fixed z-50 bottom-[19%] right-0" />
            <img src="/moreflower.gif" className="scale-x-[-1] w-18 fixed z-50 bottom-[19%] right-20" />
            <img src="/singleflower.gif" className="scale-x-[-1] w-7 fixed z-50 bottom-[19%] xl:bottom-[18%] right-[25%]" />
            <img src="/singleflower.gif" className="scale-x-[-1] w-7 fixed z-50 bottom-[20%] xl:bottom-[17%] right-[30%]" />
            <img src="/grass.gif" className="scale-x-[-1] w-44 h-20 fixed z-50 bottom-[14%] xl:bottom-[15%] right-32" />
            <img src="/grass.gif" className="scale-x-[-1] w-44 h-20 fixed z-50 bottom-[13%] lg:bottom-[16%] xl:bottom-[15%] -right-10" />
            <img src="/flower.gif" className=" w-10 h-12 fixed z-50 bottom-[20%] xl:bottom-[18%] right-[42%]" />
            <img src="/flower.gif" className="scale-x-[-1] w-10 h-12 fixed z-50 bottom-[20%] xl:bottom-[18%] right-[42%]" />
            <img src="/moreflower.gif" className="scale-x-[-1] w-18 fixed z-50 bottom-[19%] xl:-left-[100%] -left-4" />
            <img src="/grass.gif" className="scale-x-[-1] w-44 h-20 fixed z-50 bottom-[13%] xl:-left-[100%] -left-20" />
            <img src="/singleflower.gif" className="scale-x-[-1] w-7 fixed z-50 bottom-[20%] xl:bottom-[18%] left-[33%]" />
            <img src="/singleflower.gif" className="scale-x-[-1] w-7 fixed z-50 bottom-[19%] xl:bottom-[17%] left-[38%]" />
            <img
                onClick={handletreasure}
                ref={treasureRef}
                src="/goldenstatic.gif"
                className="w-40 h-28 fixed z-50 bottom-[15%] left-[25%] cursor-pointer"
                style={{ cursor: isTreasureClickable ? "pointer" : "not-allowed" }}
            />

            {/* Volume Button */}
            <button
                onClick={toggleMute}
                className={`absolute top-8 left-8 p-3 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg transition-transform transform ${
                    muted ? "scale-100" : "scale-110"
                }`}
            >
                {muted ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Volume off"
                        viewBox="0 0 16 16"
                        className="w-6 h-6 fill-white"
                    >
                        <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path>
                        <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Volume high"
                        viewBox="0 0 16 16"
                        className="w-6 h-6 fill-white"
                    >
                        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
                        <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path>
                    </svg>
                )}
            </button>
        </div>
    );
}
