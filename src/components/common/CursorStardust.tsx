import React, { useEffect, useRef } from 'react';
import { useExperience } from '../../context/ExperienceContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  type: 'star' | 'heart' | 'sparkle';
  rotation: number;
  rotationSpeed: number;
}

export const CursorStardust: React.FC = () => {
  const { config } = useExperience();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (config.theme.motion.reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const colors = ['#ff8fa3', '#e05a88', '#ffd166', '#c77dff', '#ffffff', '#f4a261'];

    let lastX = -100;
    let lastY = -100;

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, topCurveHeight / 3, 0, size);
      // top right curve
      ctx.bezierCurveTo(size, topCurveHeight / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw4PointStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        ctx.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.28),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.28)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const addTrailParticle = (x: number, y: number) => {
      const isHeart = Math.random() < 0.25;
      const isStar = !isHeart && Math.random() < 0.5;

      particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.4, // slight rise
        size: isHeart ? Math.random() * 6 + 5 : isStar ? Math.random() * 5 + 4 : Math.random() * 3 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: isHeart ? 'heart' : isStar ? 'star' : 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
      });

      // Limit particle array size
      if (particles.length > 180) {
        particles.shift();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 7) {
        const count = Math.min(Math.floor(dist / 8), 4);
        for (let i = 0; i < count; i++) {
          const interpX = lastX + (e.clientX - lastX) * (i / count);
          const interpY = lastY + (e.clientY - lastY) * (i / count);
          addTrailParticle(interpX, interpY);
        }
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Burst on click!
      const burstCount = 14;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 2.8 + 1.2;
        const isHeart = Math.random() < 0.35;
        const isStar = !isHeart && Math.random() < 0.5;

        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isHeart ? Math.random() * 7 + 6 : isStar ? Math.random() * 6 + 4 : Math.random() * 3 + 2,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: isHeart ? 'heart' : isStar ? 'star' : 'sparkle',
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.rotation);
        } else if (p.type === 'star') {
          draw4PointStar(ctx, p.x, p.y, p.size, p.rotation);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [config.theme.motion.reducedMotion]);

  if (config.theme.motion.reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
