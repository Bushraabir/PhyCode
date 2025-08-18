import React, { useRef, useEffect } from "react";

// Refined constants for elegant, premium movement
const NUM_PARTICLES = 8;
const MAX_CONNECTION_DISTANCE = 180;
const BASE_PARTICLE_SPEED = 0.03;
const GRAVITY_STRENGTH = 0.00002;
const DAMPING = 0.62;
const REPULSION_FORCE = 40;
const ATTRACTION_FORCE = 4.5;
const MAX_VELOCITY = 1.5;
const MAX_ENERGY = 80; // Limit energy to prevent excessive growth
const MAX_GLOW_MULTIPLIER = 2.2; // Cap the glow size multiplier

// Premium symbol sets with sophisticated selection
const CODE_SYMBOLS = [
  '{ }', '< >', '===', '++', '--', '**', '//', '&&', '||', '!==',
  '??', '##', '%%', '=>', '~>', '${}', 'fn', 'if', 'for', 'try'
];

const PHYSICS_SYMBOLS = [
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ',
  'φ', 'ψ', 'ω', '∑', '∫', '∇', '∞', '∆', 'ℏ', '∂'
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  mass: number;
  charge: number;
  radius: number;
  hue: number;
  brightness: number;
  symbol: string;
  rotation: number;
  rotationSpeed: number;
  energy: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
  wavePhase: number;
  pulsePhase: number;
  type: 'physics' | 'code';
  targetHue: number;
  glowIntensity: number;
  hexRotation: number;
  symbolScale: number;
  symbolAlpha: number;
  eleganceModifier: number;
}

const PremiumParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef<{
    x: number | null;
    y: number | null;
    clickTime: number;
    isPressed: boolean;
    field: number;
  }>({ x: null, y: null, clickTime: 0, isPressed: false, field: 0 });
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const createParticle = (): Particle => {
      const mass = Math.random() * 1.5 + 1.0;
      const charge = Math.random() < 0.5 ? -1 : 1;
      const isPhysics = Math.random() < 0.5;
      const type = isPhysics ? 'physics' : 'code';
      
      // Premium color palette using your custom colors
      const baseHue = type === 'physics'
        ? 180 + Math.random() * 20  // Teal blue spectrum for physics
        : 315 + Math.random() * 30; // Deep plum spectrum for code

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * BASE_PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * BASE_PARTICLE_SPEED,
        ax: 0,
        ay: 0,
        mass,
        charge,
        radius: mass * 25 + 15,
        hue: baseHue,
        targetHue: baseHue,
        brightness: 70 + Math.random() * 10, // Slightly brighter for premium shine
        symbol: type === 'physics'
          ? PHYSICS_SYMBOLS[Math.floor(Math.random() * PHYSICS_SYMBOLS.length)]
          : CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.004, // Slower rotation for elegance
        energy: Math.random() * 15 + 8,
        trail: [],
        wavePhase: Math.random() * Math.PI * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        type,
        glowIntensity: 0.7 + Math.random() * 0.2, // Increased base intensity
        hexRotation: Math.random() * Math.PI / 3,
        symbolScale: 1.0,
        symbolAlpha: 0.9,
        eleganceModifier: Math.random() * 0.3 + 0.7,
      };
    };

    particles.current = Array.from({ length: NUM_PARTICLES }, createParticle);

    const calculateForces = (p1: Particle, p2: Particle) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const unitX = dx / distance;
      const unitY = dy / distance;

      // More elegant force calculations with refined balance
      const coulombForce = (p1.charge * p2.charge * REPULSION_FORCE) / (distance * distance + 80);
      const gravForce = (p1.mass * p2.mass * ATTRACTION_FORCE) / (distance * distance + 40);
      const netForce = gravForce - coulombForce;

      return {
        fx: unitX * netForce * p1.eleganceModifier,
        fy: unitY * netForce * p1.eleganceModifier,
      };
    };

    // Premium hexagon rendering with sophisticated styling
    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rotation: number = 0) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle, currentTime: number) => {
      const {
        x, y, radius, hue, brightness, symbol, rotation, energy, trail,
        type, pulsePhase, glowIntensity, hexRotation, symbolScale, symbolAlpha,
        eleganceModifier
      } = particle;

      // Convert custom colors to HSL values
      const colorMap = {
        tealBlue: { h: 184, s: 100, l: 26 },
        deepPlum: { h: 325, s: 26, l: 30 },
        goldenAmber: { h: 35, s: 97, l: 73 },
        emeraldGreen: { h: 145, s: 63, l: 49 },
        softSilver: { h: 200, s: 13, l: 93 },
      };

      const getThemeColor = (type: 'physics' | 'code', variant: 'base' | 'highlight' | 'accent' = 'base') => {
        if (type === 'physics') {
          switch (variant) {
            case 'highlight': return colorMap.tealBlue;
            case 'accent': return colorMap.emeraldGreen;
            default: return colorMap.tealBlue;
          }
        } else {
          switch (variant) {
            case 'highlight': return colorMap.deepPlum;
            case 'accent': return colorMap.goldenAmber;
            default: return colorMap.deepPlum;
          }
        }
      };

      const baseColor = getThemeColor(type);
      const accentColor = getThemeColor(type, 'accent');

      // Subtle, elegant pulsing with smoother amplitude
      const pulse = Math.sin(pulsePhase) * 0.06 + 1;
      const currentRadius = radius * pulse * eleganceModifier;

      // Premium trail system - more subtle and refined, with longer fade
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        const alpha = point.alpha * 0.25;
        const trailRadius = (currentRadius * alpha) / 2.5;
        const trailGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, trailRadius * 3
        );
        trailGradient.addColorStop(0, `hsla(${baseColor.h}, ${baseColor.s}%, ${brightness + 5}%, ${alpha})`);
        trailGradient.addColorStop(0.6, `hsla(${baseColor.h}, ${baseColor.s - 10}%, ${brightness - 5}%, ${alpha * 0.5})`);
        trailGradient.addColorStop(1, `hsla(${baseColor.h}, ${baseColor.s - 20}%, ${brightness - 15}%, 0)`);
        ctx.fillStyle = trailGradient;
        drawHexagon(ctx, point.x, point.y, trailRadius, hexRotation + i * 0.04);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      // Refined glow system - more sophisticated layering with size limiting
      const glowMultiplier = Math.min(MAX_GLOW_MULTIPLIER, 1.4 + energy / 150);
      const glowSize = currentRadius * glowMultiplier * glowIntensity;

      // Outer glow - soft and premium, with added subtlety
      const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      outerGlow.addColorStop(0, `hsla(${baseColor.h}, ${baseColor.s}%, ${brightness + 25}%, 0.06)`);
      outerGlow.addColorStop(0.3, `hsla(${baseColor.h}, ${baseColor.s - 10}%, ${brightness + 15}%, 0.12)`);
      outerGlow.addColorStop(0.7, `hsla(${baseColor.h}, ${baseColor.s - 20}%, ${brightness + 5}%, 0.06)`);
      outerGlow.addColorStop(1, `hsla(${baseColor.h}, ${baseColor.s - 30}%, ${brightness - 5}%, 0)`);
      ctx.fillStyle = outerGlow;
      drawHexagon(ctx, x, y, glowSize, hexRotation * 0.3);
      ctx.fill();

      // Middle glow - refined intensity
      const middleGlow = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 1.4);
      middleGlow.addColorStop(0, `hsla(${baseColor.h}, ${baseColor.s + 5}%, ${brightness + 18}%, 0.22)`);
      middleGlow.addColorStop(0.5, `hsla(${baseColor.h}, ${baseColor.s - 5}%, ${brightness + 8}%, 0.12)`);
      middleGlow.addColorStop(1, `hsla(${baseColor.h}, ${baseColor.s - 15}%, ${brightness - 2}%, 0)`);
      ctx.fillStyle = middleGlow;
      drawHexagon(ctx, x, y, currentRadius * 1.4, hexRotation * 0.6);
      ctx.fill();

      // Inner glow - elegant core with premium sheen
      const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 1.05);
      innerGlow.addColorStop(0, `hsla(${baseColor.h}, ${baseColor.s + 10}%, ${brightness + 22}%, 0.35)`);
      innerGlow.addColorStop(0.6, `hsla(${baseColor.h}, ${baseColor.s}%, ${brightness + 10}%, 0.18)`);
      innerGlow.addColorStop(1, `hsla(${baseColor.h}, ${baseColor.s - 10}%, ${brightness + 2}%, 0)`);
      ctx.fillStyle = innerGlow;
      drawHexagon(ctx, x, y, currentRadius * 1.05, hexRotation);
      ctx.fill();

      // Main hexagonal body - premium styling with custom theme colors
      ctx.fillStyle = `hsla(${baseColor.h}, ${baseColor.s + 8}%, ${brightness + 18}%, 0.82)`;
      drawHexagon(ctx, x, y, currentRadius * 0.75, hexRotation);
      ctx.fill();

      // Elegant border with premium finish and golden amber accent
      ctx.strokeStyle = `hsla(${accentColor.h}, ${accentColor.s}%, ${accentColor.l + 15}%, 0.55)`;
      ctx.lineWidth = 1.2;
      drawHexagon(ctx, x, y, currentRadius * 0.75, hexRotation);
      ctx.stroke();

      // Premium symbol rendering with excellent readability
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * 0.3);

      // Symbol backdrop - elegant contrast with charcoal black
      ctx.fillStyle = 'rgba(26, 26, 30, 0.85)'; // charcoalBlack with transparency
      drawHexagon(ctx, 0, 0, currentRadius * 0.6, 0);
      ctx.fill();

      // Symbol border for definition
      ctx.strokeStyle = `hsla(${accentColor.h}, ${accentColor.s - 20}%, ${accentColor.l}%, 0.35)`;
      ctx.lineWidth = 0.8;
      drawHexagon(ctx, 0, 0, currentRadius * 0.6, 0);
      ctx.stroke();

      // Premium typography with refined font weights
      const fontSize = Math.max(currentRadius * symbolScale * 0.7, 11);
      ctx.font = `${type === 'physics' ? '500' : '600'} ${fontSize}px ${type === 'physics' ? "'Inter', system-ui" : "'JetBrains Mono', monospace"}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Elegant text shadow with premium depth
      ctx.shadowColor = 'rgba(26, 26, 30, 0.8)'; // charcoalBlack shadow
      ctx.shadowBlur = 2.5;
      ctx.shadowOffsetX = 0.4;
      ctx.shadowOffsetY = 0.4;

      // Primary symbol - soft silver with golden accent
      ctx.fillStyle = `rgba(232, 236, 239, ${symbolAlpha})`; // softSilver
      ctx.fillText(symbol, 0, 0);

      // Subtle highlight for premium feel with golden amber
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = `hsla(${accentColor.h}, ${accentColor.s}%, ${accentColor.l + 20}%, ${symbolAlpha * 0.55})`;
      ctx.fillText(symbol, -0.25, -0.25);

      ctx.restore();

      // Refined energy field for high-energy particles with size control
      if (energy > 40) {
        const fieldAlpha = ((energy - 40) / (MAX_ENERGY - 40)) * 0.22;
        ctx.strokeStyle = `hsla(${baseColor.h}, ${baseColor.s + 10}%, ${brightness + 22}%, ${fieldAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([1.5, 3.5]);

        // Elegant orbital rings with smoother animation
        for (let ring = 1; ring <= 2; ring++) {
          const ringRadius = currentRadius * (1.6 + ring * 0.35) + Math.sin(currentTime * 0.0008 + ring) * 6;
          const ringRotation = hexRotation + (ring * Math.PI / 8) + (currentTime * 0.0006);
          drawHexagon(ctx, x, y, ringRadius, ringRotation);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
    };

    // Premium connection rendering with sophisticated effects
    const drawConnections = (ctx: CanvasRenderingContext2D, currentTime: number) => {
      for (let i = 0; i < particles.current.length; i++) {
        const a = particles.current[i];
        for (let j = i + 1; j < particles.current.length; j++) {
          const b = particles.current[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          
          if (distance < MAX_CONNECTION_DISTANCE) {
            const strength = Math.pow(1 - distance / MAX_CONNECTION_DISTANCE, 2.2);
            const flowPhase = currentTime * 0.0007;
            const flowOffset = Math.sin(flowPhase + distance * 0.005) * 0.18;
            
            const isPhysicsConnection = a.type === 'physics' && b.type === 'physics';
            const isMixedConnection = a.type !== b.type;

            if (isPhysicsConnection) {
              // Quantum connection - elegant wave with teal blue theme
              ctx.strokeStyle = `hsla(184, 100%, 50%, ${strength * 0.32})`;
              ctx.lineWidth = 0.8 + strength * 1.4;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              
              const segments = 10;
              for (let k = 1; k <= segments; k++) {
                const t = k / segments;
                const waveAmplitude = 8 * strength;
                const waveFreq = 2.5;
                const waveOffset = Math.sin(flowPhase * 1.4 + t * Math.PI * waveFreq) * waveAmplitude;
                const baseX = a.x + (b.x - a.x) * t;
                const baseY = a.y + (b.y - a.y) * t;
                const perpAngle = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2;
                const waveX = baseX + Math.cos(perpAngle) * waveOffset;
                const waveY = baseY + Math.sin(perpAngle) * waveOffset;
                ctx.lineTo(waveX, waveY);
              }
              ctx.stroke();

              // Elegant quantum particles with emerald green glow
              if (strength > 0.55) {
                const qPos = (Math.sin(flowPhase * 1.2) + 1) / 2;
                const qX = a.x + (b.x - a.x) * qPos;
                const qY = a.y + (b.y - a.y) * qPos;
                ctx.fillStyle = `hsla(145, 63%, 70%, 0.55)`;
                ctx.beginPath();
                ctx.arc(qX, qY, 1.2 + strength * 0.8, 0, Math.PI * 2);
                ctx.fill();
              }
            } else if (isMixedConnection) {
              // Mixed connection - sophisticated blend with deep plum
              ctx.strokeStyle = `hsla(325, 50%, 60%, ${strength * 0.28})`;
              ctx.lineWidth = 1.0 + strength * 1.0;
              ctx.setLineDash([5, 2.5, 1.5, 2.5]);
              ctx.lineDashOffset = -flowPhase * 28;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              const midX = (a.x + b.x) / 2 + flowOffset * 12;
              const midY = (a.y + b.y) / 2 + flowOffset * 10;
              ctx.quadraticCurveTo(midX, midY, b.x, b.y);
              ctx.stroke();
              ctx.setLineDash([]);
            } else {
              // Code connection - elegant digital flow with deep plum theme
              ctx.strokeStyle = `hsla(325, 50%, 65%, ${strength * 0.38})`;
              ctx.lineWidth = 1.2 + strength * 1.6;
              ctx.setLineDash([2.5, 5]);
              ctx.lineDashOffset = -flowPhase * 22;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              const controlOffset = 16;
              const midX = (a.x + b.x) / 2 + flowOffset * controlOffset;
              const midY = (a.y + b.y) / 2 + flowOffset * (controlOffset * 0.4);
              ctx.quadraticCurveTo(midX, midY, b.x, b.y);
              ctx.stroke();
              ctx.setLineDash([]);

              // Refined data packets with golden amber
              if (strength > 0.45) {
                const packetPhase = flowPhase * 1.1;
                const packetPos = (Math.sin(packetPhase) + 1) / 2;
                const packetX = a.x + (b.x - a.x) * packetPos;
                const packetY = a.y + (b.y - a.y) * packetPos;
                ctx.fillStyle = `hsla(35, 97%, 80%, 0.65)`;
                ctx.beginPath();
                ctx.arc(packetX, packetY, 1.8 + strength * 0.8, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }

        // Premium mouse interaction with enhanced elegance
        const m = mouse.current;
        if (m.x !== null && m.y !== null) {
          const distance = Math.hypot(a.x - m.x, a.y - m.y);
          const maxMouseDist = MAX_CONNECTION_DISTANCE * 1.4;
          
          if (distance < maxMouseDist) {
            const strength = 1 - distance / maxMouseDist;
            
            if (m.isPressed) {
              // Elegant energy field with teal blue theme
              ctx.strokeStyle = `hsla(184, 100%, 60%, ${strength * 0.45})`;
              ctx.lineWidth = 1.8 + strength * 1.8;
              const branches = 5;
              
              for (let branch = 0; branch < branches; branch++) {
                const branchAngle = (Math.PI * 2 * branch / branches) + (currentTime * 0.0012);
                const segments = 8;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                
                for (let k = 1; k <= segments; k++) {
                  const t = k / segments;
                  const segmentDist = distance * t * 0.75;
                  const baseAngle = Math.atan2(m.y - a.y, m.x - a.x);
                  const finalAngle = baseAngle + Math.sin(branchAngle) * 0.18 * (1 - t);
                  const jitter = (Math.random() - 0.5) * 10 * strength * (1 - t * 0.6);
                  const x = a.x + Math.cos(finalAngle) * segmentDist + jitter;
                  const y = a.y + Math.sin(finalAngle) * segmentDist + jitter;
                  ctx.lineTo(x, y);
                }
                ctx.stroke();
              }

              // Elegant energy core with golden amber
              ctx.fillStyle = `hsla(35, 97%, 85%, ${strength * 0.35})`;
              ctx.beginPath();
              ctx.arc(a.x, a.y, strength * 5, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Subtle attraction with soft silver
              ctx.strokeStyle = `hsla(200, 13%, 80%, ${strength * 0.22})`;
              ctx.lineWidth = 0.8 + strength * 0.8;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(m.x, m.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    const animate = (currentTime: number) => {
      if (!ctx) return;
      time.current = currentTime;

      // Premium background gradient with custom theme colors
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      bgGradient.addColorStop(0, 'rgba(51, 49, 59, 0.10)'); // slateBlack with transparency
      bgGradient.addColorStop(0.5, 'rgba(26, 26, 30, 0.12)'); // charcoalBlack
      bgGradient.addColorStop(1, 'rgba(98, 55, 78, 0.15)'); // deepPlum with transparency
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Enhanced physics simulation with energy limits
      for (let i = 0; i < particles.current.length; i++) {
        const particle = particles.current[i];
        particle.ax = 0;
        particle.ay = 0;

        // Inter-particle forces
        for (let j = 0; j < particles.current.length; j++) {
          if (i === j) continue;
          const other = particles.current[j];
          const forces = calculateForces(particle, other);
          particle.ax += forces.fx / particle.mass;
          particle.ay += forces.fy / particle.mass;
        }

        // Premium mouse interaction with controlled energy increase
        const m = mouse.current;
        if (m.x !== null && m.y !== null) {
          const dx = m.x - particle.x;
          const dy = m.y - particle.y;
          const distance = Math.max(Math.hypot(dx, dy), 1);
          
          if (distance < 300) {
            const force = m.isPressed ? 0.12 : 0.05;
            const influence = 1 / (distance * 0.01 + 1);
            const forceMultiplier = force * influence;
            particle.ax += (dx / distance) * forceMultiplier;
            particle.ay += (dy / distance) * forceMultiplier;
            particle.energy = Math.min(MAX_ENERGY, particle.energy + 1.2);
            
            const hueShift = Math.sin(currentTime * 0.0025) * 15;
            particle.targetHue = particle.hue + hueShift;
            particle.symbolScale = 1.0 + influence * 0.18;
            particle.symbolAlpha = 0.88 + influence * 0.12;
          } else {
            particle.symbolScale = Math.max(1.0, particle.symbolScale - 0.006);
            particle.symbolAlpha = Math.max(0.9, particle.symbolAlpha - 0.002);
          }
        }

        // Elegant wave behavior with refined oscillation
        particle.wavePhase += 0.007;
        const oscillation = Math.sin(particle.wavePhase) * 0.7;
        particle.ay += oscillation * 0.0004;
        particle.hexRotation += particle.rotationSpeed * 0.35;
        particle.ay += GRAVITY_STRENGTH;

        // Update velocity with elegant limiting
        particle.vx += particle.ax;
        particle.vy += particle.ay;
        const currentSpeed = Math.hypot(particle.vx, particle.vy);
        if (currentSpeed > MAX_VELOCITY) {
          const dampingFactor = MAX_VELOCITY / currentSpeed;
          particle.vx *= dampingFactor;
          particle.vy *= dampingFactor;
        }
        particle.vx *= DAMPING;
        particle.vy *= DAMPING;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Refined trail system with increased length
        const trailChance = 0.35;
        if (Math.random() < trailChance) {
          particle.trail.push({
            x: particle.x + (Math.random() - 0.5) * 1.2,
            y: particle.y + (Math.random() - 0.5) * 1.2,
            alpha: 0.85
          });
          if (particle.trail.length > 10) {
            particle.trail.shift();
          }
        }
        particle.trail.forEach(point => {
          point.alpha *= 0.92;
        });

        particle.rotation += particle.rotationSpeed;
        particle.energy = Math.max(15, particle.energy - 0.25);
        particle.pulsePhase += 0.010;
        
        const hueDistance = particle.targetHue - particle.hue;
        particle.hue += hueDistance * 0.03;

        // Elegant boundary handling with softer bounce
        const margin = particle.radius * 1.5;
        const bounceDamping = 0.45;
        
        if (particle.x < margin) {
          particle.vx = Math.abs(particle.vx) * bounceDamping;
          particle.x = margin;
          particle.energy = Math.min(MAX_ENERGY, particle.energy + 4);
        } else if (particle.x > width - margin) {
          particle.vx = -Math.abs(particle.vx) * bounceDamping;
          particle.x = width - margin;
          particle.energy = Math.min(MAX_ENERGY, particle.energy + 4);
        }
        
        if (particle.y < margin) {
          particle.vy = Math.abs(particle.vy) * bounceDamping;
          particle.y = margin;
          particle.energy = Math.min(MAX_ENERGY, particle.energy + 4);
        } else if (particle.y > height - margin) {
          particle.vy = -Math.abs(particle.vy) * bounceDamping;
          particle.y = height - margin;
          particle.energy = Math.min(MAX_ENERGY, particle.energy + 4);
        }
      }

      drawConnections(ctx, currentTime);
      for (const particle of particles.current) {
        drawParticle(ctx, particle, currentTime);
      }

      // Premium mouse field visualization with enhanced rings using teal blue theme
      if (mouse.current.isPressed && mouse.current.x !== null && mouse.current.y !== null) {
        const mouseEnergy = (Date.now() - mouse.current.clickTime) / 80;
        const basePulse = 35 + Math.sin(currentTime * 0.005) * 12;
        
        for (let ring = 1; ring <= 4; ring++) {
          const ringRadius = basePulse * ring * 0.55 + Math.sin(currentTime * 0.0035 + ring) * 8;
          const ringAlpha = (0.25 / ring) * Math.min(mouseEnergy / 7, 1);
          const ringRotation = currentTime * 0.0007 * ring;
          ctx.strokeStyle = `hsla(184, 100%, 60%, ${ringAlpha * 0.28})`;
          ctx.lineWidth = 1.8 - (ring * 0.25);
          ctx.setLineDash([3.5, 7]);
          ctx.lineDashOffset = -currentTime * 0.012 * ring;
          drawHexagon(ctx, mouse.current.x, mouse.current.y, ringRadius, ringRotation);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Elegant central core with premium gradient using golden amber
        const coreSize = 7 + Math.sin(currentTime * 0.007) * 2.5;
        const coreGradient = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, coreSize
        );
        coreGradient.addColorStop(0, 'hsla(35, 97%, 85%, 0.55)'); // goldenAmber
        coreGradient.addColorStop(0.5, 'hsla(184, 100%, 70%, 0.28)'); // tealBlue
        coreGradient.addColorStop(1, 'hsla(325, 50%, 65%, 0)'); // deepPlum fade
        ctx.fillStyle = coreGradient;
        drawHexagon(ctx, mouse.current.x, mouse.current.y, coreSize, currentTime * 0.0015);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouse.current.isPressed = true;
      mouse.current.clickTime = Date.now();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      particles.current.forEach(particle => {
        const distance = Math.hypot(particle.x - mouseX, particle.y - mouseY);
        if (distance < 150) {
          particle.energy = Math.min(MAX_ENERGY, particle.energy + 12);
          particle.symbolScale = Math.min(1.25, particle.symbolScale + 0.12);
        }
      });
    };

    const handleMouseUp = () => {
      mouse.current.isPressed = false;
      particles.current.forEach(particle => {
        particle.symbolScale = Math.max(1.0, particle.symbolScale - 0.06);
      });
    };

    const handleResize = () => {
      const oldWidth = width;
      const oldHeight = height;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      particles.current.forEach(particle => {
        particle.x = (particle.x / oldWidth) * width;
        particle.y = (particle.y / oldHeight) * height;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = touch.clientX - rect.left;
        mouse.current.y = touch.clientY - rect.top;
        mouse.current.isPressed = true;
        mouse.current.clickTime = Date.now();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = touch.clientX - rect.left;
        mouse.current.y = touch.clientY - rect.top;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      mouse.current.isPressed = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-opacity duration-1000 cursor-crosshair"
        style={{
          opacity: 0.88,
          background: `
            radial-gradient(ellipse at top left, rgba(98, 55, 78, 0.15) 0%, transparent 50%), 
            radial-gradient(ellipse at top right, rgba(0, 120, 128, 0.12) 0%, transparent 50%), 
            radial-gradient(ellipse at bottom center, rgba(51, 49, 59, 0.18) 0%, transparent 50%), 
            linear-gradient(135deg, rgba(26, 26, 30, 0.96) 0%, rgba(51, 49, 59, 0.94) 100%)
          `,
          backdropFilter: 'blur(0.6px)',
        }}
      />
      
      {/* Premium overlay for enhanced depth with custom theme colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/4 via-transparent to-purple-950/6 pointer-events-none" />
      
      {/* Subtle geometric pattern overlay with premium finesse using soft silver */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            repeating-conic-gradient(
              from 30deg at 50% 50%, 
              transparent 0deg, 
              rgba(232, 236, 239, 0.25) 60deg, 
              transparent 120deg 
            )
          `,
          backgroundSize: '180px 180px'
        }}
      />
      
      {/* Accessibility and SEO content */}
      <div className="sr-only">
        <h1>Premium Physics & Coding Particle System</h1>
        <p>
          An elegant, interactive particle simulation showcasing the harmony between
          physics and programming concepts through sophisticated hexagonal particles
          with refined animations and premium visual effects.
        </p>
        <p>
          Features include quantum-inspired connections, elegant energy fields,
          sophisticated typography, and responsive touch interactions for an
          immersive premium experience.
        </p>
        <p>
          Interact by moving your cursor to influence particles, or click and hold
          to create energy fields. Fully optimized for both desktop and mobile devices.
        </p>
      </div>
    </div>
  );
};

export default PremiumParticleSystem;