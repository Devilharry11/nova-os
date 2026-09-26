import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface CelestialCanvasProps {
  reducedMotion?: boolean;
}

export const CelestialCanvas: React.FC<CelestialCanvasProps> = ({ reducedMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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

    const mouse = { x: -1000, y: -1000, radius: 100 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize stars
    const starCount = Math.min(Math.floor((width * height) / 12000), 90);
    const starColors = ['#ffffff', '#ffcad4', '#e8a598', '#d8b4e2'];
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.2;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.6,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Initialize drifting romantic embers (starlight dust)
    const emberCount = 20;
    const emberColors = ['rgba(224, 90, 136, 0.4)', 'rgba(157, 114, 255, 0.35)', 'rgba(232, 165, 152, 0.4)'];
    const embers: Ember[] = [];

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1, // Float gently upwards
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Stars with subtle twinkle
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!reducedMotion) {
          star.phase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.phase) * 0.25;
        }

        // Mouse gentle interaction
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let extraGlow = 0;
        if (dist < mouse.radius) {
          extraGlow = (1 - dist / mouse.radius) * 0.4;
        }

        ctx.save();
        ctx.globalAlpha = Math.min(Math.max(star.alpha + extraGlow, 0.1), 1);
        ctx.fillStyle = star.color;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 2;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render Embers
      if (!reducedMotion) {
        for (let i = 0; i < embers.length; i++) {
          const emb = embers[i];
          emb.x += emb.vx;
          emb.y += emb.vy;

          if (emb.y < 0) emb.y = height;
          if (emb.x < 0) emb.x = width;
          if (emb.x > width) emb.x = 0;

          ctx.save();
          ctx.globalAlpha = emb.alpha;
          ctx.fillStyle = emb.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = emb.color;
          ctx.beginPath();
          ctx.arc(emb.x, emb.y, emb.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Soft romantic background gradients */}
      <div className="absolute -top-32 -left-32 w-[35rem] h-[35rem] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[40rem] h-[40rem] bg-violet-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[35rem] h-[35rem] bg-rose-950/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
