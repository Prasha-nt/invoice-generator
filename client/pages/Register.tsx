import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LevitationLogo from '../components/LevitationLogo';

// Carousel images
const heroImages = [
  { src: '/reg.png', alt: 'Connecting People With Technology' },
  { src: '/reg1.png', alt: 'Innovation at Levitation Infotech' },
  { src: '/reg2.png', alt: 'Streamline Your Business' },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ Auto-slide effect for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      // Use the modulo operator to cycle through images repeatedly
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000); // 2 seconds per slide

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setEmailError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { mockAuthService } = await import('../services/mockAuth');
      const result = await mockAuthService.register(name, email, password);

      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-[#1F1F1F] shadow-md shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Using a placeholder image for the logo */}
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium text-lg">levitation</span>
                <span className="text-gray-400 text-sm">Infotech</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-[#CCF575] text-black font-medium px-5 py-2 rounded hover:bg-lime-300 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#141414]">
          <div className="w-full max-w-md">
            {/* Registration Form */}
            <div>
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Sign up to begin journey
              </h2>
              <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base">
                This is a basic signup page for a Levitation Infotech assignment.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Enter your name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full w-full bg-[#202020] border border-[#424647] rounded-lg px-4 py-3 text-white placeholder-[#424647] focus:outline-none focus:border-[#CCF575] text-sm lg:text-base"
                    placeholder="Enter your name"
                    required
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    This name will be displayed with your inquiry
                  </p>
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full w-full bg-[#202020] border border-[#424647] rounded-lg px-4 py-3 text-white placeholder-[#424647] focus:outline-none focus:border-[#CCF575] text-sm lg:text-base"
                    placeholder="Enter Email ID"
                    required
                  />
                  {emailError && (
                    <p className="text-red-400 text-sm mt-1">{emailError}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    Any further updates will be forwarded to this Email ID
                  </p>
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full w-full bg-[#202020] border border-[#424647] rounded-lg px-4 py-3 text-white placeholder-[#424647] focus:outline-none focus:border-[#CCF575] text-sm lg:text-base"
                    placeholder="Enter the Password"
                    required
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Any further updates will be forwarded on this Email ID
                  </p>
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-400 bg-opacity-10 border border-red-400 border-opacity-20 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#303030] text-[#CCF575] font-medium px-6 py-3 rounded-lg hover:bg-[#CCF575] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                  <span className="text-gray-400 text-sm text-center sm:text-left">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#CCF575] hover:text-lime-300 transition-colors">
                      Login
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - Carousel Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8 bg-[#141414]">
            <div className="w-full h-full max-w-lg max-h-[600px] aspect-[4/3] rounded-xl overflow-hidden ">
                 <div
                    className="flex h-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {heroImages.map((img, index) => (
                      // By wrapping the image in a div with padding, we create a gap.
                      <div key={index} className="w-full flex-shrink-0 p-2">
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover flex-shrink-0 rounded-xl"
                            // onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x600/FF0000/FFFFFF?text=Image+Error'; }}
                          />
                      </div>
                    ))}
                  </div>

                  
                  
            </div>
        </div>
      </div>
    </div>
  );
}

