import React, { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";

const SendPopup = ({ isOpen, own, onClose, user, cloudinaryUploadUrl, cloudinaryPreset }) => {
  const [textInput, setTextInput] = useState("");
  const [dot, setDot] = useState(".");
  const [form, setForm] = useState({ text: "", images: [] });
  const [previewImages, setPreviewImages] = useState([]);
  const [isloading, setisloading] = useState(false);
  const drop = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDot((dot) => (dot === "." ? ".." : dot === ".." ? "..." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    setForm((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleClick = () => {
    drop.current.click();
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Generate preview URLs for selected images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);

    // Save the selected files to form state for upload later
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSend = async () => {
    setisloading(true);

    if (textInput.trim() || form.images.length > 0) {
      // Upload images to Cloudinary
      const uploadedUrls = [];
      for (const file of form.images) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryPreset);

        try {
          const response = await fetch(cloudinaryUploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            console.error("Failed to upload image:", response.statusText);
            continue;
          }

          const data = await response.json();
          uploadedUrls.push(data.secure_url);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }

      // Create the message object
      const message = {
        userimage: own.image,
        username: own.username,
        text: form.text,
        image: uploadedUrls,
      };

      const history = {
        from: own.username,
        to: user.username,
        text: form.text,
        image: uploadedUrls,
      };

      // Send the message
      const data = await fetch(`/api/sendmessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message }),
      });

      if (data.ok) {
        console.log("Message Sent:", form);
        alert("Message Sent!");
      } else {
        console.error("Failed to send message");
        alert("Failed to send message");
      }

      // Reset the form
      setTextInput("");
      setForm({ text: "", images: [] });
      setPreviewImages([]);
    } else {
      alert("Please add text or upload images!");
    }

    setisloading(false);
  };

  const handleclose = () => {
    setTextInput("");
    setForm({ text: "", images: [] });
    setPreviewImages([]);
    onClose();
  }

  return isOpen ? (
    <>
      {isloading && (
        <div className="fixed top-0 left-0 min-w-full h-screen flex items-center justify-center z-[101] bg-black bg-opacity-40">
          <img src="/loading1.gif" className="w-24" alt="" />
        </div>
      )}
      <div className="fixed z-[100] inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="flex items-end gap-4 justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4 justify-center">
              <img
                src={user.image}
                alt="Profile"
                className="rounded-full w-16 h-16 object-cover border-4 border-pink-200"
              />
              <h1 className="text-xl font-semibold mb-2 text-zinc-700">
                What do you want to <br /> send to{" "}
                <span className="text-pink-700">{user.username}</span>
                {dot}
              </h1>
            </div>
          </div>
          <img src="/loligirl.gif" className="w-24" alt="" />
        </div>
        <div
          className="relative bg-white/90 backdrop-blur-md rounded-lg shadow-lg w-11/12 max-w-3xl p-6 animate-scaleUp"
          style={{ animation: "scaleUp 0.3s ease-out" }}
        >
          {/* Close Button */}
          <div className="absolute top-3 left-3">
            <button
              onClick={()=>handleclose()}
              className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center md:items-center">
            {/* Left Side: Basket Icon */}
            <div className="flex flex-col items-center justify-between w-full md:w-1/2 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-pink-200 mb-4 md:mb-0 md:pr-4">
              <div
                onClick={handleClick}
                className="flex items-center justify-center w-24 h-24 bg-pink-200 rounded-full cursor-pointer"
              >
                <Upload size={50} className="text-pink-600" />
              </div>
              <p className="mt-4 text-pink-700 text-center">
                Drag and drop your images here or click the basket
              </p>
              <input
                ref={drop}
                type="file"
                className="hidden"
                multiple
                onChange={handleImageSelect}
              />
              {/* Display selected images */}
              <div className="mt-4 flex overflow-auto gap-2">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Notebook Styled Text Input */}
            <div className="flex flex-col items-center justify-between w-full md:w-1/2 md:pl-4">
              <div className="relative w-full h-52 bg-pink-50 rounded-md border border-pink-200 p-4 shadow-inner">
                {/* Notebook lines */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `repeating-linear-gradient(
                    to bottom,
                    #ffb3c1 1px,
                    transparent 35px
                  )`,
                    zIndex: -1,
                  }}
                ></div>
                <textarea
                  value={textInput}
                  onChange={handleTextChange}
                  placeholder="Write your message here..."
                  className="w-full h-full bg-transparent focus:outline-none text-pink-800 placeholder-pink-400 resize-none"
                  style={{
                    fontFamily: `"Patrick Hand", cursive`, // A handwritten style
                    lineHeight: "2.5rem",
                  }}
                />
              </div>
              {/* Send Button */}
              <button
                onClick={handleSend}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
              >
                Send with ❤️
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default SendPopup;
