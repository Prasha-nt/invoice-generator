import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';

// ✅ Carousel images
const heroImages = [
  { src: '/reg.png', alt: 'Connecting People With Technology' },
  { src: '/reg1.png', alt: 'Innovation at Levitation Infotech' },
  { src: '/reg2.png', alt: 'Streamline Your Business' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    dispatch(loginStart());

    try {
      const { mockAuthService } = await import('../services/mockAuth');
      const result = await mockAuthService.login(email, password);

      if (result.success) {
        dispatch(loginSuccess({ user: result.data.user, token: result.data.token }));
        navigate('/products');
      } else {
        dispatch(loginFailure(result.message || 'Login failed'));
      }
    } catch (err) {
      dispatch(loginFailure('Network error. Please try again.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-[#1F1F1F] shadow-md shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Company Logo" className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="text-white font-medium text-lg">levitation</span>
                <span className="text-gray-400 text-sm">infotech</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="text-[#CCF575] font-medium px-4 py-2 rounded border border-[#CCF575] hover:bg-[#CCF575] hover:text-black transition-colors"
              >
                Connecting People With Technology
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* ✅ Left side - Carousel Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8  bg-[#141414]">
          <div className="w-full h-full max-w-lg max-h-[600px] aspect-[4/3] rounded-xl overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {heroImages.map((img, index) => (
                <div key={index} className="w-full flex-shrink-0 p-2">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#141414]">
          <div className="w-full max-w-md">
            <div>
              <div className="flex items-center space-x-3 mb-4 mt-12">
                <img src="/logo.png" alt="Company Logo" className="h-16 w-16" />
                <div>
                  <h1 className="text-white text-3xl font-bold">levitation</h1>
                  <p className="text-gray-400 text-lg">infotech</p>
                </div>
              </div>

              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Let the Journey Begin!
              </h2>
              <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base">
                This is basic login page which is used for levitation assignment purpose.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
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
                    This email will be displayed with your inquiry
                  </p>
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full w-full bg-[#202020] border border-[#424647] rounded-lg px-4 py-3 text-white placeholder-[#424647] focus:outline-none focus:border-[#CCF575] text-sm lg:text-base"
                    placeholder="Enter the Password"
                    required
                  />
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
                    {loading ? 'Logging in...' : 'Login now'}
                  </button>
                  <Link
                    to="/register"
                    className="text-gray-400 text-sm hover:text-white transition-colors text-center sm:text-right"
                  >
                    Forgot password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
