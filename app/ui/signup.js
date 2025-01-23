import React, { useState, useRef } from 'react';
import { User, Lock, Camera } from 'lucide-react';

const Signup = ({ toLogin, settoken }) => {
  const [formData, setFormData] = useState({
    username: '',
    image: '',
    password: '',
    confirmPassword: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store image file
  const [isloading, setisloading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      setisloading(true);
      let imageUploadUrl = null;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('upload_preset', 'ml_default');

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dtzsk95mv/image/upload",
          { method: 'POST', body: imageFormData }
        );

        const data = await response.json();
        imageUploadUrl = data.secure_url;

        if (!imageUploadUrl) {
          alert('Failed to upload the image. Please try again.');
          return;
        }
      }

      const payload = {
        username: formData.username,
        image: imageUploadUrl || '',
        password: formData.password
      };

      const apiResponse = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await apiResponse.json();
      if (apiResponse.ok) {
        localStorage.setItem('token', formData.username);
        setIsFadingOut(true);

        setTimeout(() => {
          settoken(formData.username);
        }, 1000); // Matches the transition duration
      } else {
        alert(result.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setisloading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {isloading && (
        <div className="fixed top-0 left-0 min-w-full h-screen flex items-center justify-center z-[100] bg-black bg-opacity-40">
          <img src="/loading.gif" className="w-24" alt="" />
        </div>
      )}
      <div
        className={`flex items-center justify-center min-h-screen bg-transparent ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-1000`}
      >
        <div className="relative w-full px-6 py-8 space-y-8 bg-transparent">
          <form onSubmit={handleSubmit} className="space-y-6 md:w-[40vw] w-[60vw] mx-auto">
            <div className="flex flex-col md:flex-row justify-center mb-6 items-center space-x-4 space-y-2">
              <img src="/signup.gif" className="w-44 h-24" alt="Signup Illustration" />
              <div
                onClick={handleImageClick}
                className="relative w-28 h-28 rounded-full border-2 border-green-300 cursor-pointer overflow-hidden group bg-white/50 hover:bg-white/60 transition-all"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-8 h-8 text-green-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-green-500" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white/50 placeholder-green-400"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-green-500" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white/50 placeholder-green-400"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-green-500" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white/50 placeholder-green-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
            <p className="text-center text-lg text-white">
              Already have an account?{' '}
              <span onClick={toLogin} className="text-green-700 hover:text-green-900 text-lg font-bold cursor-pointer">
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
