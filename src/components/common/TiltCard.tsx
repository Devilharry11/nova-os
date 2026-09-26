import React, { useRef, useState, useCallback } from 'react';
import { vaultAudio } from '../../utils/vaultAudio';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  enableSound?: boolean;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  glare = true,
  enableSound = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: 'translate(-50%, -50%)',
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'transform 0.1s ease-out',
      });

      if (glare) {
        setGlareStyle({
          opacity: 0.18,
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.2s ease',
        });
      }
    },
    [maxTilt, scale, glare]
  );

  const handleMouseEnter = () => {
    if (enableSound) {
      vaultAudio.playCardHover();
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
    });
    setGlareStyle((prev) => ({
      ...prev,
      opacity: 0,
      transition: 'opacity 0.5s ease',
    }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Holographic Specular Glare Sheen */}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-72 h-72 rounded-full blur-2xl radial-glare"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 143, 163, 0.2) 40%, transparent 70%)',
            ...glareStyle,
          }}
        />
      )}
    </div>
  );
};
