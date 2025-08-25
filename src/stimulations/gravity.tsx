import React, { useState, useRef, useEffect } from 'react';

interface SimulationProps {
  // Optional props if needed in the future
}

const GravityStimulation: React.FC<SimulationProps> = () => {
  const [initialVelocity, setInitialVelocity] = useState<number>(20); // m/s
  const [angle, setAngle] = useState<number>(45); // degrees
  const [gravity, setGravity] = useState<number>(9.81); // m/s²
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const scale = 10; // Pixels per meter for scaling
  const groundY = 300; // Y position of ground in canvas

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setTime((prevTime) => prevTime + 0.016); // ~60 FPS delta time
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#E8ECEF'; // softSilver
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    // Calculate position
    const thetaRad = (angle * Math.PI) / 180;
    const x = initialVelocity * Math.cos(thetaRad) * time * scale;
    const y = groundY - (initialVelocity * Math.sin(thetaRad) * time - 0.5 * gravity * time ** 2) * scale;

    // Draw projectile (ball)
    if (y <= groundY) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI); // Ball radius 10px
      ctx.fillStyle = '#007880'; // tealBlue
      ctx.fill();

      // Draw trajectory line (simple, from start to current)
      ctx.strokeStyle = '#FDC57B'; // goldenAmber
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Stop simulation when it hits ground
      setIsRunning(false);
      setTime(0);
    }
  }, [time, initialVelocity, angle, gravity, isRunning]);

  const startSimulation = () => {
    setTime(0);
    setIsRunning(true);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slateBlack text-softSilver font-sans">
      <h1 className="text-4xl font-heading mb-8 text-goldenAmber">Projectile Motion Simulation</h1>
      <div className="bg-charcoalBlack p-6 rounded-lg shadow-lg mb-8 w-96">
        <label className="block mb-4">
          Initial Velocity (m/s):
          <input
            type="number"
            value={initialVelocity}
            onChange={(e) => setInitialVelocity(Number(e.target.value))}
            className="ml-2 p-2 bg-deepPlum text-softSilver rounded"
            min="0"
            disabled={isRunning}
          />
        </label>
        <label className="block mb-4">
          Launch Angle (degrees):
          <input
            type="number"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="ml-2 p-2 bg-deepPlum text-softSilver rounded"
            min="0"
            max="90"
            disabled={isRunning}
          />
        </label>
        <label className="block mb-4">
          Gravity (m/s²):
          <input
            type="number"
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="ml-2 p-2 bg-deepPlum text-softSilver rounded"
            min="0"
            disabled={isRunning}
          />
        </label>
        <div className="flex justify-between">
          <button
            onClick={startSimulation}
            className="px-4 py-2 bg-tealBlue text-softSilver rounded hover:bg-goldenAmber transition"
            disabled={isRunning}
          >
            Start
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-crimsonRed text-softSilver rounded hover:bg-softOrange transition"
          >
            Reset
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-emeraldGreen bg-charcoalBlack"
      />
      <p className="mt-4 text-emeraldGreen">
        {isRunning ? 'Simulation running...' : 'Adjust parameters and start the simulation.'}
      </p>
    </div>
  );
};

export default GravityStimulation;