import React, { useState } from "react";

const History = ({ historyData, setshowhistory,sethistorydata, currentUserId }) => {
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  console.log(historyData);

  const openSlideshow = (imageArray, startIndex) => {
    setImages(imageArray);
    setCurrentSlide(startIndex);
    setIsSlideshowOpen(true);
  };

  const closeSlideshow = () => {
    setIsSlideshowOpen(false);
    setImages([]);
    setCurrentSlide(0);
  };

  const showPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!historyData || historyData.length === 0) {
    return (
      <div className="fixed z-[9999] flex flex-col items-center justify-center w-[92%] h-[75vh] bg-pink-200/70 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          No History Found
        </h2>
        <button
          onClick={() => setshowhistory(false)}
          className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="fixed w-[92%] h-[75vh] z-[9999] bg-pink-200/70 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-600">Message History</h1>
        <button
          onClick={() => {
            setshowhistory(false);
            sethistorydata([]);
          }}
          className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
        >
          Close
        </button>
      </div>

      {/* History Container */}
      <div className="space-y-6 overflow-auto h-[90%]">
        {historyData.map((entry, index) => {
          const isSentByCurrentUser = entry.from === currentUserId;

          return (
            <div
              key={index}
              className={`flex ${
                isSentByCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-4 max-w-[80%] relative rounded-lg shadow-md ${
                  isSentByCurrentUser
                    ? "bg-white text-right"
                    : "bg-white text-left"
                }`}
              >
                {/* Display Text */}
                {entry.text && (
                  <p className="text-gray-700 mb-2">{entry.text}</p>
                )}

                {/* Display Images */}
                {entry.image && entry.image.length > 0 && (
                  entry.image.length > 3 ? (
                    <div
                      className="relative w-20 h-20 rounded-lg overflow-hidden"
                      onClick={() => openSlideshow(entry.image, 0)}
                    >
                      <img
                        src={entry.image[0]}
                        alt="Message Image 1"
                        className="w-20 h-20 absolute object-cover rounded-lg"
                      />
                      <img
                        src={entry.image[1]}
                        alt="Message Image 2"
                        className="w-20 h-20 absolute rotate-12 translate-x-1 object-cover rounded-lg"
                      />
                      <img
                        src={entry.image[2]}
                        alt="Message Image 3"
                        className="w-20 h-20 absolute -rotate-12 -translate-x-1 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex space-x-2 mt-2">
                      {entry.image.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`Message Image ${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                          onClick={() => openSlideshow(entry.image, imgIndex)}
                        />
                      ))}
                    </div>
                  )
                )}

                {/* Timestamp */}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
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
              className="w-full h-96 object-contain rounded-lg shadow-md"
            />
          </div>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-pink-600 bg-opacity-30 backdrop-blur-lg text-white px-4 py-2 rounded-full shadow-md hover:bg-opacity-50 transition"
            onClick={showPrevSlide}
          >
            ◀
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-600 bg-opacity-30 backdrop-blur-lg text-white px-4 py-2 rounded-full shadow-md hover:bg-opacity-50 transition"
            onClick={showNextSlide}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
