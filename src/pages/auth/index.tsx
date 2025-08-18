'use client';

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { BeakerIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import AuthModal from '@/components/Modals/AuthModal';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Particles from '@/components/particles/particles';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const AuthPage = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const magneticRef = useRef<HTMLButtonElement | null>(null);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -44]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openLoginModal = (type: 'login' | 'register' | 'forgotPassword' = 'login') =>
    setAuthModalState({ isOpen: true, type });

  useEffect(() => {
    if (!isMobile || prefersReduced) return;
    const el = heroRef.current;
    if (!el || typeof window === 'undefined') return;

    const onOrientation = (ev: DeviceOrientationEvent) => {
      const g = ev.gamma ?? 0;
      const b = ev.beta ?? 0;
      const rx = Math.max(-12, Math.min(12, (b - 45) / 6));
      const ry = Math.max(-16, Math.min(16, g / 6));
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [isMobile, prefersReduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target && (e.target as HTMLElement).tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey) return;
      if (e.key?.toLowerCase() === 'l') openLoginModal('login');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const btn = magneticRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      if (isMobile) return;
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.06}px, ${dy * 0.04}px) scale(1.035)`;
    };
    const reset = () => (btn.style.transform = 'translate(0,0) scale(1)');

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', reset);
    return () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', reset);
    };
  }, [isMobile]);

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const span = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.style.width = span.style.height = `${size}px`;
    span.style.borderRadius = '50%';
    span.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.06))';
    span.style.transform = 'scale(0)';
    span.style.opacity = '0.95';
    span.style.pointerEvents = 'none';
    span.style.transition = 'transform 650ms cubic-bezier(.2,.9,.2,1), opacity 650ms';
    target.appendChild(span);
    requestAnimationFrame(() => (span.style.transform = 'scale(1)'));
    setTimeout(() => span.style.opacity = '0', 420);
    setTimeout(() => span.remove(), 800);

    if (navigator.vibrate) navigator.vibrate(12);

    openLoginModal('login');
  };

  const inlineCss = `

    .cta-focus:focus { outline: 3px solid rgba(252,197,123,0.16); outline-offset: 3px; }
    .svg-stroke { filter: drop-shadow(0 6px 18px rgba(0,0,0,0.45)); }
  `;

  return (
    <div className="relative min-h-screen bg-slateBlack text-softSilver overflow-hidden font-sans antialiased">
      <style dangerouslySetInnerHTML={{ __html: inlineCss }} />

      <Particles />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-36 -top-20 w-[46vw] h-[46vw] rounded-full bg-gradient-to-br from-tealBlue/18 to-deepPlum/6 blur-[140px]" />
        <div className="absolute -right-32 -bottom-16 w-[42vw] h-[42vw] rounded-full bg-gradient-to-tr from-goldenAmber/12 to-softOrange/6 blur-[120px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />

      <div className="relative z-20 max-w-8xl mx-auto px-6 lg:px-12">
        <Navbar />

        <main className="min-h-[85vh] flex items-center justify-center">
          <section className="w-full flex flex-col items-center text-center gap-6">

            <motion.div
              ref={heroRef}
              style={{ y: yParallax }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="relative flex flex-col items-center justify-center max-w-5xl"
              aria-hidden={false}
            >

              <div className="relative flex items-center justify-center select-none">
                <h1
                  className=" text-deepPlum tracking-tight font-heading font-bold"
                  style={{
                    fontSize: isMobile ? '18.5vw' : '12.8vw',
                   
                  }}
                >
                  PhyCode
                </h1>
              </div>

              <div className="mt-4 flex flex-col items-center gap-2 px-4">
                <TypeAnimation
                  sequence={[
                    'Code the universe — learn by building.',
                    4200,
                    'Simulate. Visualize. Optimize.',
                    4200,
                    'From Newton to algorithms — one playground.',
                    4200,
                  ]}
                  wrapper="p"
                  cursor
                  repeat={Infinity}
                  className="italic text-sm sm:text-base md:text-lg text-softSilver/90 max-w-3xl"
                  speed={36}
                  deletionSpeed={42}
                />

                <p className="text-xs sm:text-sm text-softSilver/70 mt-1">Interactive physics simulations • Visual DSA • Timed challenges</p>
              </div>

            </motion.div>

            <div className="mt-8 flex flex-col items-center gap-4 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4">

                <motion.button
                  ref={magneticRef}
                  onClick={handleCTAClick}
                  whileTap={{ scale: 0.985 }}
                  className="relative overflow-hidden rounded-full py-3 px-8 font-semibold text-slateBlack bg-gradient-to-r from-tealBlue to-goldenAmber shadow-[0_18px_60px_rgba(252,197,123,0.18)] cta-focus"
                  aria-label="Start practising - open login"
                >
                  <span className="ripple-cta" aria-hidden />
                  Practise — Start Now
                </motion.button>

                <motion.a
                  href="/dsa/dsaHome"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 border-2 border-tealBlue text-tealBlue font-semibold py-3 px-6 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealBlue"
                >
                  <CodeBracketIcon className="w-5 h-5 text-tealBlue" />
                  Learn to Code
                </motion.a>

                <motion.button
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  whileHover={{ y: -3 }}
                  className="hidden sm:inline-flex items-center gap-2 bg-charcoalBlack/30 backdrop-blur-sm text-softSilver/90 font-medium py-3 px-5 rounded-full border border-slateBlack"
                >
                  <BeakerIcon className="w-5 h-5" />
                  Explore Labs
                </motion.button>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row  gap-3 text-xs text-softSilver/70">
                <span>
                  Press <kbd className="px-2 py-1 bg-charcoalBlack/60 rounded">L</kbd> to open login
                </span>
                <span>•</span>
                <span>Built for learners, coders & curious minds</span>
              </div>
            </div>

          </section>
        </main>
      </div>

      <AuthModal />
    </div>
  );
};

export default AuthPage;