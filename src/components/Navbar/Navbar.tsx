import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">

        {/* Right Side Menu (All Desktop Links) */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/features"
            className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
          >
            Features
          </a>
          <a
            href="/community"
            className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
          >
            Community
          </a>
          <a
            href="/sign-in"
            className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
          >
            Sign In
          </a>
          <a
            href="/sign-up"
            className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-200 hover:text-cyan-400 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col items-center gap-4 py-6">
            <a
              href="/features"
              className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/community"
              className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </a>
            <a
              href="/sign-in"
              className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </a>
            <a
              href="/sign-up"
              className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* Custom Slide Animation */}
      <style jsx>{`
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .md\\:hidden.animate {
          animation: slideInDown 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
