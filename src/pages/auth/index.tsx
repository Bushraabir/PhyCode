import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { BeakerIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import AuthModal from '@/components/Modals/AuthModal';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';

const AuthPage = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const openLoginModal = () => {
    setAuthModalState({ isOpen: true, type: "login" });
  };

  return (
    <div className="bg-gradient-to-br from-blue-950 via-gray-900 to-black min-h-screen text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md" />
        <main className="pt-24 pb-20">
          <section className="relative text-center py-20 -mt-20">
            <div className="absolute inset-0 overflow-hidden opacity-20">
              {[...Array(30)].map((_, i) => (
                <span
                  key={i}
                  className="absolute bg-emerald-400 rounded-full opacity-30 animate-pulse"
                  style={{
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">
              <section className="text-center mb-28">
                <h1 className="text-7xl font-extrabold mb-10 tracking-tight animate-fadeIn bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 ">
                  PhyCode
                </h1>
              </section>
            </div>
          </section>

          <section className="relative py-16 bg-gray-800/30 rounded-xl shadow-2xl -mt-16 z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <div className="flex items-start p-6 hover:bg-gray-700/50 rounded-lg transition-all duration-300">
                <BeakerIcon className="h-12 w-12 text-emerald-400 flex-shrink-0 mr-4" />
                <div>
                  <h2 className="text-3xl font-bold mb-3 text-blue-300">Physics Concepts</h2>
                  <p className="text-gray-300 text-lg">
                    Explore mechanics, electromagnetism, and quantum physics through hands-on coding.
                  </p>
                </div>
              </div>
              <div className="flex items-start p-6 hover:bg-gray-700/50 rounded-lg transition-all duration-300">
                <CodeBracketIcon className="h-12 w-12 text-emerald-400 flex-shrink-0 mr-4" />
                <div>
                  <h2 className="text-3xl font-bold mb-3 text-blue-300">DSA in Physics</h2>
                  <p className="text-gray-300 text-lg">
                    Apply algorithms and data structures to simulate and solve complex physics challenges.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <p className="text-3xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            Lets code...
          </p>
          <div className="flex justify-center gap-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={openLoginModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Now
            </button>
            <a
              href="/demo"
              className="bg-transparent border-2 border-emerald-500 hover:bg-emerald-500 text-emerald-300 hover:text-white font-bold py-4 px-10 rounded-full transition-all duration-300"
            >
              See Demo
            </a>
          </div>
        </main>
        <footer className="text-center absolute bottom-0 text-gray-500">
          <p>&copy; {new Date().getFullYear()} PhyCode. All Rights Reserved.</p>
        </footer>
        <AuthModal />
      </div>
    </div>
  );
};

export default AuthPage;
