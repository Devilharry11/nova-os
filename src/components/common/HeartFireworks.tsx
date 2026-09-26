import React, { useEffect, useRef } from 'react';
import { vaultAudio } from '../../utils/vaultAudio';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'streamer' | 'sparkle';
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  wobble: number;
  wobbleSpeed: number;
}

interface HeartFireworksProps {
  triggerKey?: number | string | boolean;
  autoStart?: boolean;
}

export const HeartFireworks: React.FC<HeartFireworksProps> = ({
  triggerKey,
  autoStart = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<FireworkParticle[]>([]);

  const launchCelebrationBurst = (originX?: number, originY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    vaultAudio.playCelebrationBurst();

    // 3 or 4 cluster centers
    const bursts = [
      { x: originX ?? width * 0.5, y: originY ?? height * 0.38, count: 60 },
      { x: width * 0.28, y: height * 0.45, count: 40 },
      { x: width * 0.72, y: height * 0.42, count: 40 },
    ];

    const colors = [
      '#ff8fa3',
      '#e05a88',
      '#ffd166',
      '#c77dff',
      '#ffffff',
      '#ff4d6d',
      '#f72585',
      '#f4a261',
    ];

    bursts.forEach((burst, bIdx) => {
      setTimeout(() => {
        for (let i = 0; i < burst.count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 8 + 3;
          const randType = Math.random();
          const type: FireworkParticle['type'] =
            randType < 0.45
              ? 'heart'
              : randType < 0.7
              ? 'star'
              : randType < 0.85
              ? 'streamer'
              : 'sparkle';

          particlesRef.current.push({
            x: burst.x,
            y: burst.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2, // initial upward push
            alpha: 1,
            decay: Math.random() * 0.012 + 0.008,
            size:
              type === 'heart'
                ? Math.random() * 10 + 8
                : type === 'star'
                ? Math.random() * 8 + 6
                : type === 'streamer'
                ? Math.random() * 14 + 10
                : Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.15,
            gravity: type === 'streamer' ? 0.08 : 0.12,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.1 + 0.05,
          });
        }
      }, bIdx * 220);
    });
  };

  useEffect(() => {
    const handleGlobalTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number }>;
      launchCelebrationBurst(customEvent.detail?.x, customEvent.detail?.y);
    };

    window.addEventListener('trigger-heart-fireworks', handleGlobalTrigger);
    return () => window.removeEventListener('trigger-heart-fireworks', handleGlobalTrigger);
  }, []);

  useEffect(() => {
    if (triggerKey !== undefined && triggerKey !== false) {
      launchCelebrationBurst();
    }
  }, [triggerKey]);

  useEffect(() => {
    if (autoStart) {
      launchCelebrationBurst();
    }
  }, [autoStart]);

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

    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rot: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, topCurveHeight / 3, 0, size);
      ctx.bezierCurveTo(size, topCurveHeight / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rot: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * size,
          -Math.sin(((18 + i * 72) * Math.PI) / 180) * size
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * (size * 0.45),
          -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size * 0.45)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawStreamer = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rot: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillRect(-size / 2, -2, size, 4);
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.vx *= 0.985;
        p.vy += p.gravity;
        p.vy *= 0.985;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.7;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height + 50) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.rotation);
        } else if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.rotation);
        } else if (p.type === 'streamer') {
          drawStreamer(ctx, p.x, p.y, p.size, p.rotation);
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
};

