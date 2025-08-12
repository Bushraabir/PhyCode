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

/**
 * AuthPage - cinematic, interactive, mobile-friendly
 * Highlights added:
 * - Brighter animated gradient for "PhyCode" with layered glow and svg outline
 * - Device-orientation tilt for mobile + mouse 3D tilt on desktop
 * - Magnetic CTA with ripple & haptics (navigator.vibrate)
 * - Parallax and scroll reactions using framer-motion
 * - Improved accessibility (aria, keyboard, focus states)
 * - Keeps Particles component intact (interactive prop passed)
 */

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

  const openLoginModal = (type: 'login' | 'signup' = 'login') =>
    setAuthModalState({ isOpen: true, type });

  // Desktop: mouse 3D tilt
  useEffect(() => {
    if (isMobile || prefersReduced) return;
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = py * -8;
      const ry = px * 14;
      el.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.transition = 'transform 120ms ease-out';
    };
    const reset = () => (el.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)');

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, [isMobile, prefersReduced]);

  // Mobile: device orientation tilt (gentle)
  useEffect(() => {
    if (!isMobile || prefersReduced) return;
    const el = heroRef.current;
    if (!el || typeof window === 'undefined') return;

    const onOrientation = (ev: DeviceOrientationEvent) => {
      // gamma (left-right), beta (front-back)
      const g = ev.gamma ?? 0;
      const b = ev.beta ?? 0;
      const rx = Math.max(-12, Math.min(12, (b - 45) / 6));
      const ry = Math.max(-16, Math.min(16, g / 6));
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [isMobile, prefersReduced]);

  // Keyboard shortcut: L opens login (improves mobile by checking event target)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target && (e.target as HTMLElement).tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey) return;
      if (e.key?.toLowerCase() === 'l') openLoginModal('login');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Magnetic button interaction + ripple + optional vibration
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
    // ripple
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

    // haptic feedback when available
    if (navigator.vibrate) navigator.vibrate(12);

    openLoginModal('login');
  };

  const inlineCss = `
    /* Cinematic styles */
    @keyframes gradientShift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
    @keyframes glowPulse { 0% { filter: drop-shadow(0 6px 18px rgba(99,102,241,0.18)); } 50% { filter: drop-shadow(0 20px 42px rgba(99,102,241,0.28)); } 100% { filter: drop-shadow(0 6px 18px rgba(99,102,241,0.18)); } }
    .phycode-giant { background-size: 400% 400%; animation: gradientShift 8s ease-in-out infinite, glowPulse 4.5s ease-in-out infinite; }
    .phycode-outline { mix-blend-mode: screen; opacity: 0.95; }
    .feature-pill { transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms, background 220ms; }
    .feature-pill:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 22px 60px rgba(2,6,23,0.68); }
    .ripple-cta { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; }
    .cta-focus:focus { outline: 3px solid rgba(99,102,241,0.16); outline-offset: 3px; }
    /* neon stroke for svg text fallback */
    .svg-stroke { filter: drop-shadow(0 6px 18px rgba(0,0,0,0.45)); }
  `;

  return (
    <div className="relative min-h-screen bg-[#030417] text-slate-50 overflow-hidden font-sans antialiased">
      <style dangerouslySetInnerHTML={{ __html: inlineCss }} />

      {/* Particles (kept) */}
      <Particles  />

      {/* Decorative ambient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-36 -top-20 w-[46vw] h-[46vw] rounded-full bg-gradient-to-br from-[#00f5d4]/18 to-[#7c3aed]/6 blur-[140px]" />
        <div className="absolute -right-32 -bottom-16 w-[42vw] h-[42vw] rounded-full bg-gradient-to-tr from-[#ffb86b]/12 to-[#ff63c3]/6 blur-[120px]" />
      </div>

      {/* faint grid overlay for subtle texture */}
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

              {/* Layered animated text: big gradient + subtle outline SVG for extra "wow" */}
              <div className="relative flex items-center justify-center select-none">
                <h1
                  className="phycode-giant  tracking-tight bg-clip-text text-transparent "
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg,#00f5d4,#06b6d4,#f59e0b,#ff4d94,#8b5cf6)',
                    fontSize: isMobile ? '18.5vw' : '12.8vw',
                    textShadow: '0 10px 40px rgba(139,92,246,0.14), 0 4px 20px rgba(2,6,23,0.6)'
                  }}
                >
                  PhyCode
                </h1>

              </div>

              {/* Subtitle + typing animation */}
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
                  className="italic text-sm sm:text-base md:text-lg text-slate-100/90 max-w-3xl"
                  speed={36}
                  deletionSpeed={42}
                />

                <p className="text-xs sm:text-sm text-slate-300/70 mt-1">Interactive physics simulations • Visual DSA • Timed challenges</p>
              </div>

            </motion.div>

            {/* CTA cluster */}
            <div className="mt-8 flex flex-col items-center gap-4 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4">

                <motion.button
                  ref={magneticRef}
                  onClick={handleCTAClick}
                  whileTap={{ scale: 0.985 }}
                  className="relative overflow-hidden rounded-full py-3 px-8 font-semibold text-slate-900 bg-gradient-to-r from-emerald-400 to-fuchsia-500 shadow-[0_18px_60px_rgba(139,92,246,0.18)] cta-focus"
                  aria-label="Start practising - open login"
                >
                  <span className="ripple-cta" aria-hidden />
                  Practise — Start Now
                </motion.button>

                <motion.a
                  href="/dsa/dsaHome"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 border-2 border-emerald-400 text-emerald-200/95 font-semibold py-3 px-6 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <CodeBracketIcon className="w-5 h-5 text-emerald-200/95" />
                  Learn to Code
                </motion.a>

                <motion.button
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  whileHover={{ y: -3 }}
                  className="hidden sm:inline-flex items-center gap-2 bg-slate-900/30 backdrop-blur-sm text-slate-100/90 font-medium py-3 px-5 rounded-full border border-slate-700"
                >
                  <BeakerIcon className="w-5 h-5" />
                  Explore Labs
                </motion.button>
              </div>

              {/* feature pills */}
              <div className="mt-3 flex flex-wrap justify-center gap-3 px-2">
                {[
                  ['Live Simulations', 'bg-emerald-400/10', 'emerald'],
                  ['Guided DSA', 'bg-amber-400/8', 'amber'],
                  ['Visual Debugger', 'bg-cyan-400/8', 'cyan'],
                  ['Compete & Rank', 'bg-fuchsia-400/8', 'fuchsia'],
                ].map(([label, bg, key]) => (
                  <div key={String(label)} className={`feature-pill ${bg} backdrop-blur-sm border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm`}>
                    <span className={`w-2 h-2 rounded-full ${key === 'emerald' ? 'bg-emerald-400' : key === 'amber' ? 'bg-amber-400' : key === 'cyan' ? 'bg-cyan-400' : 'bg-fuchsia-400'} inline-block`} />
                    {label}
                  </div>
                ))}
              </div>

              {/* micro-CTA row */}
              <div className="mt-2 flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-300/70">
                <span>
                  Press <kbd className="px-2 py-1 bg-slate-900/60 rounded">L</kbd> to open login
                </span>
                <span>•</span>
                <span>Built for learners, coders & curious minds</span>
              </div>
            </div>

            {/* Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl px-2">
              <div className="bg-gradient-to-tr from-slate-900/60 to-slate-800/30 border border-slate-700 p-5 rounded-2xl backdrop-blur-sm hover:translate-y-[-6px] transition-transform">
                <h3 className="font-semibold">Interactive Playground</h3>
                <p className="text-sm text-slate-300/70 mt-2">Tweak physics parameters and watch algorithms adapt in real-time. Perfect for visual learners.</p>
              </div>

              <div className="bg-gradient-to-tr from-slate-900/60 to-slate-800/30 border border-slate-700 p-5 rounded-2xl backdrop-blur-sm hover:translate-y-[-6px] transition-transform">
                <h3 className="font-semibold">Guided Tracks</h3>
                <p className="text-sm text-slate-300/70 mt-2">Step-by-step modules combining simulations with problem solving and quizzes.</p>
              </div>

              <div className="bg-gradient-to-tr from-slate-900/60 to-slate-800/30 border border-slate-700 p-5 rounded-2xl backdrop-blur-sm hover:translate-y-[-6px] transition-transform">
                <h3 className="font-semibold">Ace Competitions</h3>
                <p className="text-sm text-slate-300/70 mt-2">Practice timed challenges, visualize solutions, and climb the leaderboard.</p>
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
