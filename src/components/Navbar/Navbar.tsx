import React, { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const openLoginModal = () => {
    setAuthModalState({ isOpen: true, type: 'login' });
  };
  const opensignupModal = () => {
    setAuthModalState({ isOpen: true, type: 'register' });
  };

  return (
    <nav
      className="sticky top-0 w-full z-50 bg-slateBlack bg-opacity-75 border-b border-deepPlum shadow-lg"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 sticky">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-goldenAmber hover:text-tealBlue transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold text-goldenAmber ml-4 md:ml-0">PhyCode</h1>
          </div>
          {/* Right Side Menu (All Desktop Links) */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
            >
              Home
            </a>
            <a
              href="/dsa/dsaHome"
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
            >
              DSA Roadmap
            </a>
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
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slateBlack/95 backdrop-blur-xl shadow-lg animate-slideInDown">
          <div className="flex flex-col items-center gap-4 py-6">
            <a
              href="/"
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/dsa/dsaHome"
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              DSA Roadmap
            </a>
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
              onClick={() => { openLoginModal(); setIsMenuOpen(false); }}
              className="text-softSilver hover:text-goldenAmber transition-colors duration-300 text-lg font-medium"
            >
              Sign In
            </a>
            <a
              onClick={() => { opensignupModal(); setIsMenuOpen(false); }}
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