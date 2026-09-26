import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { TypographyPreset } from '../../types/heartVault';

interface CinematicTypographyProps {
  text: string;
  preset?: TypographyPreset;
  fontFamily?: 'serif' | 'display' | 'sans' | 'handwriting';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontWeight?: 'light' | 'normal' | 'medium' | 'bold';
  color?: string;
  glow?: boolean;
  align?: 'left' | 'center' | 'right';
  delay?: number;
  duration?: number;
  maxWidth?: string;
  className?: string;
  reducedMotion?: boolean;
}

export const CinematicTypography: React.FC<CinematicTypographyProps> = ({
  text,
  preset = 'minimal-cinematic',
  fontFamily = 'serif',
  fontSize = 'xl',
  fontWeight = 'normal',
  color = '#ffffff',
  glow = true,
  align = 'center',
  delay = 0.2,
  duration = 1.2,
  maxWidth,
  className = '',
  reducedMotion = false,
}) => {
  // Typewriter state
  const isTypewriter = preset === 'typewriter' && !reducedMotion;
  const [typedLength, setTypedLength] = useState(isTypewriter ? 0 : text.length);

  useEffect(() => {
    if (!isTypewriter) return;

    let current = 0;
    const intervalTime = Math.max(30, Math.min(80, (duration * 1000) / text.length));

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        current++;
        setTypedLength(current);
        if (current >= text.length) {
          clearInterval(interval);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, isTypewriter, duration, delay]);

  // Font family mapping
  const getFontClass = () => {
    switch (fontFamily) {
      case 'display':
        return 'font-display';
      case 'sans':
        return 'font-sans';
      case 'handwriting':
        return 'font-handwriting';
      case 'serif':
      default:
        return 'font-serif';
    }
  };

  // Font size mapping
  const getSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm';
      case 'base':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case '2xl':
        return 'text-2xl sm:text-3xl';
      case '3xl':
        return 'text-3xl sm:text-4xl';
      case '4xl':
        return 'text-4xl sm:text-5xl md:text-6xl';
      case 'xl':
      default:
        return 'text-xl sm:text-2xl';
    }
  };

  // Font weight mapping
  const getWeightClass = () => {
    switch (fontWeight) {
      case 'light':
        return 'font-light';
      case 'medium':
        return 'font-medium';
      case 'bold':
        return 'font-bold';
      case 'normal':
      default:
        return 'font-normal';
    }
  };

  // Alignment class
  const getAlignClass = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center mx-auto';
    }
  };

  const styleObj: React.CSSProperties = {
    color,
    maxWidth: maxWidth || '100%',
    textShadow: glow ? `0 0 20px ${color}88, 0 0 40px ${color}44` : undefined,
  };

  // If reduced motion, render simple static/fade
  if (reducedMotion) {
    return (
      <div
        className={`${getFontClass()} ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed`}
        style={styleObj}
      >
        {text}
      </div>
    );
  }

  // Preset 1: Typewriter
  if (preset === 'typewriter') {
    return (
      <div
        className={`${getFontClass()} ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed`}
        style={styleObj}
      >
        <span>{text.slice(0, typedLength)}</span>
        {typedLength < text.length && (
          <span className="inline-block w-2 h-[1em] bg-rose-400 ml-1 animate-pulse align-middle" />
        )}
      </div>
    );
  }

  // Preset 2: Letter-by-Letter Reveal
  if (preset === 'letter-by-letter') {
    const letters = text.split('');
    return (
      <motion.div
        className={`${getFontClass()} ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed flex flex-wrap justify-center`}
        style={styleObj}
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.35,
              delay: delay + index * 0.025,
              ease: 'easeOut',
            }}
            className={char === ' ' ? 'w-2' : ''}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Preset 3: Split-Text (Word by Word)
  if (preset === 'split-text') {
    const words = text.split(' ');
    return (
      <div
        className={`${getFontClass()} ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed flex flex-wrap justify-center gap-x-2 gap-y-1`}
        style={styleObj}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.08,
              type: 'spring',
              stiffness: 100,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  // Preset 4: Kinetic Text
  if (preset === 'kinetic') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
        animate={{ opacity: 1, scale: [0.8, 1.04, 1], rotate: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className={`${getFontClass()} ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed`}
        style={styleObj}
      >
        {text}
      </motion.div>
    );
  }

  // Preset 5: Handwritten Reveal
  if (preset === 'handwritten') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: duration * 1.2, delay, ease: 'easeOut' }}
        className={`font-handwriting ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed tracking-wide`}
        style={styleObj}
      >
        {text}
      </motion.div>
    );
  }

  // Preset 6: Minimal Cinematic
  if (preset === 'minimal-cinematic') {
    return (
      <motion.div
        initial={{ opacity: 0, letterSpacing: '0.25em', filter: 'blur(3px)' }}
        animate={{ opacity: 1, letterSpacing: '0.12em', filter: 'blur(0px)' }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`${getFontClass()} ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed uppercase`}
        style={styleObj}
      >
        {text}
      </motion.div>
    );
  }

  // Preset 7: Default Fade In
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={`${getFontClass()} ${getSizeClass()} ${getWeightClass()} ${getAlignClass()} ${className} leading-relaxed`}
      style={styleObj}
    >
      {text}
    </motion.div>
  );
};
