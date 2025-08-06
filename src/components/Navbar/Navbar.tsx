import React, { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';

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




  const setAuthModalState = useSetRecoilState(authModalState);

  const openLoginModal = () => {
    setAuthModalState({ isOpen: true, type: 'login' });
  };
  const opensignupModal = () => {
    setAuthModalState({ isOpen: true, type: 'register' });
  };
  
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-slateBlack/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">

        {/* Right Side Menu (All Desktop Links) */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/features"
            className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
          >
            Features
          </a>
          <a
            href="/community"
            className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
          >
            Community
          </a>
          <a
            onClick={openLoginModal}
            className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
          >
            Sign In
          </a>
          <a
            onClick={opensignupModal}
            className="relative bg-gradient-to-r from-deepPlum to-goldenAmber hover:from-goldenAmber hover:to-deepPlum text-slateBlack font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-600 transform hover:-translate-y-1"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-softSilver hover:text-tealBlue focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
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
        <div className="md:hidden bg-slateBlack/95 backdrop-blur-xl shadow-lg animate-slideInDown">
          <div className="flex flex-col items-center gap-4 py-6">
            <a
              href="/features"
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/community"
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </a>
            <a
              onClick={openLoginModal}
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
              
            >
              Sign In
            </a>
            <a
              onClick={opensignupModal}
              className="relative bg-gradient-to-r from-deepPlum to-goldenAmber hover:from-goldenAmber hover:to-deepPlum text-slateBlack font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-600 transform hover:-translate-y-1.5"
              
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
        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
