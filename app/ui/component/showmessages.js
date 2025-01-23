import React, { useState } from "react";

const Messagepopup = ({ images = [], text = "", onClose, userimage, username }) => {
    const [isSlideshowOpen, setSlideshowOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleImageClick = (index) => {
        setCurrentSlide(index);
        setSlideshowOpen(true);
    };

    const closeSlideshow = () => setSlideshowOpen(false);

    const showPrevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

    const showNextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % images.length);

    const hasImages = images.length > 0;
    const hasText = text.trim().length > 0;

    if (!hasImages && !hasText) {
        return null;
    }

    return (
        <>
            {/* Popup */}
            <div className="fixed inset-0 bg-pink-200 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-[2000]">
                <div className="bg-white bg-opacity-80 w-[80%] max-w-4xl p-6 rounded-lg shadow-lg flex">
                    {/* Images Section */}
                    {hasImages && (
                        <div className="w-1/2 flex flex-col space-y-2">
                            {images.slice(0, 3).map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg cursor-pointer border-2 border-pink-400 hover:opacity-80 transition shadow-md"
                                    onClick={() => handleImageClick(index)}
                                />
                            ))}
                            {images.length > 3 && (
                                <p className="text-sm text-gray-600 italic">
                                    + {images.length - 3} more
                                </p>
                            )}
                        </div>
                    )}

                    {/* Text Section */}
                    {hasText && (
                        <div className={`pl-4 ${hasImages ? "w-1/2" : "w-full"}`}>
                            <h2 className="text-xl flex font-bold text-pink-600 mb-4">
                            <img
                            src={userimage}
                            alt="Profile"
                            className="rounded-full w-10 h-10 mr-2 object-cover border-2 border-pink-200"
                        />  {username} says:
                            </h2>
                            <div className="flex items-center space-x-2">
                                <img src="/rotate.gif" className="w-14 inline-block" alt="" />
                                <p className="text-gray-700 font-medium">{text}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Slideshow */}
            {isSlideshowOpen && (
                <div className="fixed inset-0 bg-pink-400 bg-opacity-10 backdrop-blur-md flex items-center justify-center z-[9999]">
                    <button
                        className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 transition"
                        onClick={closeSlideshow}
                    >
                        ✕
                    </button>
                    <div className="relative w-[80%] max-w-3xl">
                        <img
                            src={images[currentSlide]}
                            alt={`Slide ${currentSlide + 1}`}
                            className="w-full h-96 object-contain rounded-lg shadow-md "
                        />
                        {/* Navigation */}
                    </div>
                    <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-pink-600 bg-opacity-30 backdrop-blur-lg text-white px-4 py-2 rounded-full shadow-md hover:bg-opacity-50 transition"
                        onClick={showPrevSlide}
                    >
                        ◀
                    </button>
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-600 bg-opacity-30 backdrop-blur-lg text-white px-4 py-2 rounded-full  shadow-md hover:bg-opacity-50 transition"
                        onClick={showNextSlide}
                    >
                        ▶
                    </button>

                </div>
            )}
        </>
    );
};

export default Messagepopup;
