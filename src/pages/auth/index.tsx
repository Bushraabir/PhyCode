'use client';

import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { BeakerIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import AuthModal from '@/components/Modals/AuthModal';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Particles from '@/components/particles/particles';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const openLoginModal = () => {
    setAuthModalState({ isOpen: true, type: 'login' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slateBlack via-charcoalBlack to-black text-softSilver font-sans overflow-hidden">
      <Particles />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />

        <main className="pt-28 pb-24">
          {/* Hero Section */}
          <section className="text-center py-32 sm:py-40">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight font-heading bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400 drop-shadow-[0_5px_15px_rgba(255,255,255,0.1)]"
            >
              PhyCode
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.3 }}
              className="mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 max-w-3xl mx-auto px-6 leading-relaxed hover:scale-[1.02] transition-transform duration-300 ease-out"
            >
              <span className="bg-gradient-to-r from-white/80 to-white/50 bg-clip-text text-transparent">
                Master physics through code. Master code through physics.
              </span>
            </motion.p>
          </section>



          {/* Call to Action */}
          <div className="text-center ">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-3xl text-softSilver mb-10"
            >
              Let’s code...
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button
                onClick={openLoginModal}
                className="bg-goldenAmber hover:bg-tealBlue text-slateBlack hover:text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Now
              </button>
              <a
                href="/demo"
                className="bg-transparent border-2 border-emeraldGreen hover:bg-emeraldGreen text-emeraldGreen hover:text-white font-bold py-4 px-10 rounded-full transition-all duration-300"
              >
                See Demo
              </a>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-softSilver/50 mt-24 border-t border-softSilver/10">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-goldenAmber font-bold">PhyCode</span>. All Rights Reserved.
          </p>
        </footer>
      </div>

      <AuthModal />
    </div>
  );
};

export default AuthPage;