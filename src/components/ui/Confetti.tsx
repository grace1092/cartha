'use client';

import React, { useEffect, useRef } from 'react';

interface ConfettiConfig {
  spread?: number;
  ticks?: number;
  gravity?: number;
  decay?: number;
  startVelocity?: number;
  colors?: string[];
  origin?: { x: number; y: number };
}

interface ConfettiProps {
  active: boolean;
  config?: ConfettiConfig;
}

const Confetti: React.FC<ConfettiProps> = ({ 
  active, 
  config = {} 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);

  const defaultConfig: Required<ConfettiConfig> = {
    spread: 50,
    ticks: 60,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 20,
    colors: ['#f43f5e', '#8b5cf6', '#06d6a0', '#ffd23f', '#fb8500'],
    origin: { x: 0.5, y: 0.5 }
  };

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      decay: number;
      gravity: number;
      ticks: number;
      totalTicks: number;

             constructor() {
         this.x = canvas!.width * finalConfig.origin.x;
         this.y = canvas!.height * finalConfig.origin.y;
        
        const angle = (Math.random() * finalConfig.spread - finalConfig.spread / 2) * (Math.PI / 180);
        const velocity = Math.random() * finalConfig.startVelocity;
        
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        
        this.color = finalConfig.colors[Math.floor(Math.random() * finalConfig.colors.length)];
        this.decay = finalConfig.decay;
        this.gravity = finalConfig.gravity;
        this.ticks = 0;
        this.totalTicks = finalConfig.ticks;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.decay;
        this.vy *= this.decay;
        this.ticks++;
        
        return this.ticks < this.totalTicks;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = 1 - (this.ticks / this.totalTicks);
        
        // Draw confetti as rectangles
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
        
        ctx.restore();
      }
    }

    // Create initial particles
    const createParticles = (count: number = 50) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        const alive = particle.update();
        if (alive) {
          particle.draw(ctx);
        }
        return alive;
      });

      // Continue animation if particles exist
      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    // Start confetti
    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
    };
  }, [active, finalConfig]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default Confetti; 