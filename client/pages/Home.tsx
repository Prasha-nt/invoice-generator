import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LevitationLogo from '../components/LevitationLogo';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slider functionality
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      title: "Professional Team",
      description: "Connecting people with technology"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Modern Workspace",
      description: "Building innovative solutions"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80",
      title: "Tech Excellence",
      description: "Empowering business growth"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LevitationLogo size="md" />
              <div>
                <span className="text-white font-medium text-lg">levitation</span>
                <span className="text-gray-400 text-sm ml-2">infotech</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#CCF575] text-black font-medium px-4 py-2 rounded hover:bg-lime-300 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Invoice Generator
                  <span className="block text-[#CCF575]">Made Simple</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Create professional invoices in seconds. Manage your products, 
                  calculate totals automatically, and generate PDF invoices with ease.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-[#CCF575] text-black font-semibold px-8 py-4 rounded-lg hover:bg-lime-300 transition-colors text-center"
                >
                  Start Creating Invoices
                </Link>
                <Link
                  to="/login"
                  className="border border-slate-600 text-white font-medium px-8 py-4 rounded-lg hover:bg-slate-800 transition-colors text-center"
                >
                  Already have account?
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="bg-slate-800 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <LevitationLogo size="lg" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Easy Product Management</h3>
                  <p className="text-gray-400 text-sm">Add multiple products with automatic calculations</p>
                </div>
                <div className="text-center">
                  <div className="bg-slate-800 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <LevitationLogo size="lg" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Professional PDFs</h3>
                  <p className="text-gray-400 text-sm">Generate professional invoice PDFs instantly</p>
                </div>
                <div className="text-center">
                  <div className="bg-slate-800 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <LevitationLogo size="lg" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Auto Calculations</h3>
                  <p className="text-gray-400 text-sm">Automatic GST and total calculations</p>
                </div>
              </div>
            </div>

            {/* Right Side - Auto Slider */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                      <div className="p-8">
                        <h3 className="text-white text-2xl font-bold mb-2">{slide.title}</h3>
                        <p className="text-gray-200">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-[#CCF575]' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                >
                  →
                </button>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-2xl max-w-sm">
                <div className="flex items-center space-x-3 mb-4">
                <LevitationLogo size="md" />
                <span className="font-medium">levitation</span>
              </div>
                <h4 className="font-bold text-lg mb-2">Connecting People with Technology</h4>
                <p className="text-gray-600 text-sm">
                  Professional invoice generation made simple and efficient for your business needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}
