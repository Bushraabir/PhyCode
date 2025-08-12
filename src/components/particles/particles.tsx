import React, { useRef, useEffect } from "react";

const NUM_PARTICLES = 30;
const MAX_CONNECTION_DISTANCE = 300;
const PARTICLE_SPEED = 0.3;
const PULSE_SPEED = 0.002;

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{
    x: number;
    y: number;
    r: number;
    baseVx: number;
    baseVy: number;
    vx: number;
    vy: number;
    hue: number;
    pulse: number;
    pulseDir: number;
  }>>([]);
  const mouse = useRef<{ x: number | null; y: number | null; clickTime: number }>({ x: null, y: null, clickTime: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const createParticle = () => {
      const baseVx = (Math.random() - 0.5) * PARTICLE_SPEED;
      const baseVy = (Math.random() - 0.5) * PARTICLE_SPEED;
      const hue = 180 + Math.random() * 60; // Wider hue range for more color variety
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 20 + 10, // Smaller radius range for tighter visuals
        baseVx,
        baseVy,
        vx: baseVx,
        vy: baseVy,
        hue,
        pulse: Math.random() * 0.5 + 1.2, // Tighter pulse range for smoother effect
        pulseDir: Math.random() < 0.5 ? 1 : -1,
      };
    };

    particles.current = Array.from({ length: NUM_PARTICLES }, createParticle);

    const drawHeptagon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rotation: number) => {
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i) / 7 + rotation;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const draw = (time: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Particle-to-particle connections
      for (let i = 0; i < particles.current.length; i++) {
        const a = particles.current[i];

        for (let j = i + 1; j < particles.current.length; j++) {
          const b = particles.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < MAX_CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${a.hue}, 90%, 70%, ${0.7 * (1 - dist / MAX_CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Mouse-to-particle connections
        const m = mouse.current;
        if (m.x !== null && m.y !== null) {
          const dist = Math.hypot(a.x - m.x, a.y - m.y);
          if (dist < MAX_CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${a.hue}, 95%, 75%, ${0.9 * (1 - dist / MAX_CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            // Smooth velocity boost on mouse interaction
            const angle = Math.atan2(m.y - a.y, m.x - a.x);
            a.vx += Math.cos(angle) * 0.05;
            a.vy += Math.sin(angle) * 0.05;
          }
        }
      }

      // Draw particles
      for (let p of particles.current) {
        const radius = p.r * p.pulse;

        // Enhanced glow gradient
        const glow = ctx.createRadialGradient(p.x, p.y, radius * 0.3, p.x, p.y, radius * 1.2);
        glow.addColorStop(0, `hsla(${p.hue}, 95%, 80%, 0.9)`);
        glow.addColorStop(0.5, `hsla(${p.hue}, 85%, 60%, 0.4)`);
        glow.addColorStop(1, `hsla(${p.hue}, 80%, 40%, 0)`);

        // Fill glowing inner heptagon
        ctx.fillStyle = glow;
        drawHeptagon(ctx, p.x, p.y, radius, p.x * 0.005 + time * 0.0002); // Smoother rotation
        ctx.fill();

        // Outer ring with dynamic glow
        ctx.strokeStyle = `hsla(${p.hue}, 95%, 85%, 0.5)`;
        ctx.lineWidth = 1.8;
        drawHeptagon(ctx, p.x, p.y, radius * 1.15, p.x * 0.005 + time * 0.0002);
        ctx.stroke();

        // Update motion with damping for smoother movement
        p.x += p.vx;
        p.y += p.vy;

        // Smoothly return to base velocity
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        // Smoother pulse effect
        p.pulse += PULSE_SPEED * p.pulseDir;
        if (p.pulse > 1.8 || p.pulse < 0.8) p.pulseDir *= -1;

        // Elastic bounce from canvas edges
        if (p.x < radius || p.x > width - radius) {
          p.vx *= -0.8;
          p.x = Math.max(radius, Math.min(width - radius, p.x));
        }
        if (p.y < radius || p.y > height - radius) {
          p.vy *= -0.8;
          p.y = Math.max(radius, Math.min(height - radius, p.y));
        }

        // Click burst effect with easing
        const timeSinceClick = Date.now() - mouse.current.clickTime;
        if (timeSinceClick < 300 && Math.hypot(p.x - (mouse.current.x || 0), p.y - (mouse.current.y || 0)) < 150) {
          const strength = 1 - timeSinceClick / 300;
          p.vx += (Math.random() - 0.5) * 3 * strength;
          p.vy += (Math.random() - 0.5) * 3 * strength;
        }
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleClick = () => {
      mouse.current.clickTime = Date.now();
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Reposition particles to avoid clumping
      particles.current = particles.current.map((p) => ({
        ...p,
        x: Math.random() * width,
        y: Math.random() * height,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-opacity duration-500"
        style={{ opacity: 0.3 }}
      />

    </div>
  );
};

export default Particles;