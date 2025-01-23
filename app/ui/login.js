import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

const Login = ({ toSignup, settoken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isloading, setisloading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSubmit = async (e) => {
    setisloading(true);
    e.preventDefault();
    let result = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    let data = await result.json();
    if (data.message === 'Login successful') {
      localStorage.setItem('token', formData.username);

      // Start fade-out animation
      setIsFadingOut(true);

      // Delay the settoken call until fade-out is complete
      setTimeout(() => {
        settoken(formData.username);
        setIsFadingOut(false); // Reset fade-out state (optional)
      }, 1000); // Match the CSS transition duration
    } else {
      alert(data.message || 'Login failed. Please try again.');
    }
    setisloading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {isloading && (
        <div className="fixed top-0 left-0 min-w-full h-screen flex items-center justify-center z-[100] bg-black bg-opacity-40">
          <img src="/loading.gif" className="w-24" alt="" />
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        {/* Centering container */}
        <div
          className={`relative w-full px-6 py-8 space-y-8 bg-transparent ${
            isFadingOut ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-1000`}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img src="/login.gif" alt="" />
            <h2 className="text-2xl font-semibold text-green-800">Welcome Back</h2>
            <p className="text-green-600 mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 md:w-[40vw] w-[60vw] mx-auto"
          >
            {/* Username Field */}
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

            {/* Password Field */}
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
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-lg text-white">
              Don't have an account?{' '}
              <span
                onClick={() => toSignup()}
                className="text-green-700 hover:text-green-900 text-lg font-bold cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
