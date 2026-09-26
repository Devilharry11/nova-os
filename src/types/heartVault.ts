export type QuestionType = 'multiple-choice' | 'text' | 'memory' | 'yes-no';

export type Question = {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string;
  reward: number;
  feedback?: string;
  required: boolean;
};

export type AnimationPreset = 
  | 'starlight'
  | 'polaroid'
  | 'film'
  | 'scatter'
  | 'orbit'
  | 'cinema'
  | 'letter';

export type CaptionStyle = 'fade' | 'typewriter' | 'handwritten';

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'scatter';

export type MemoryItem = {
  id: string;
  imageUrl: string;
  mediaType?: 'photo' | 'video';
  videoUrl?: string;
  caption: string;
  date?: string;
  location?: string;
  animation: AnimationPreset;
  duration: number;
  captionStyle: CaptionStyle;
  transition: TransitionType;
};

export type RevealStyle = 'fade' | 'typewriter' | 'handwritten' | 'paragraph';

export type LetterConfig = {
  title: string;
  body: string;
  signature: string;
  finalMessage: string;
  revealStyle: RevealStyle;
};

export type ThemePreset = 'midnight-violet' | 'rose-gold' | 'celestial-noir';

export type ThemeConfig = {
  preset: ThemePreset;
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
    overlayOpacity: number;
    blur: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    glow: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  motion: {
    preset: 'calm' | 'balanced' | 'cinematic';
    particles: boolean;
    reducedMotion: boolean;
  };
  audio: {
    enabled: boolean;
    musicUrl?: string;
    volume: number;
  };
};

export type MusicConfig = {
  enabled: boolean;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  introText?: string;
  outroText?: string;
  visualizer: boolean;
};

export type VideoConfig = {
  enabled: boolean;
  title: string;
  description?: string;
  videoUrl: string;
  posterUrl?: string;
  introText?: string;
  outroText?: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  overlayText?: string;
};

export type TypographyPreset = 
  | 'fade-in' 
  | 'typewriter' 
  | 'kinetic' 
  | 'split-text' 
  | 'handwritten' 
  | 'minimal-cinematic' 
  | 'letter-by-letter';

export type TypographyItem = {
  id: string;
  text: string;
  preset: TypographyPreset;
  fontFamily?: 'serif' | 'display' | 'sans' | 'handwriting';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontWeight?: 'light' | 'normal' | 'medium' | 'bold';
  color?: string;
  glow?: boolean;
  align?: 'left' | 'center' | 'right';
  section?: 'welcome' | 'music' | 'video' | 'scrapbook' | 'portal' | 'letter' | 'final';
  delay?: number;
  duration?: number;
  maxWidth?: string;
};

export type InstaTrack = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  duration?: string;
  category?: 'Romantic Reel' | 'Aesthetic Lofi' | 'Trending Duet' | 'Custom';
};

export type InstaMusicConfig = {
  enabled: boolean;
  autoPlayOnInteract: boolean;
  volume: number;
  currentTrackIndex: number;
  tracks: InstaTrack[];
};

export type HostSecurityConfig = {
  pin: string;
  requirePin: boolean;
};

export type ExperienceConfig = {
  title: string;
  coupleNames: string;
  welcomeMessage: string;
  welcomeSubtext: string;
  questions: Question[];
  memories: MemoryItem[];
  theme: ThemeConfig;
  letter: LetterConfig;
  music: MusicConfig;
  video: VideoConfig;
  typography: TypographyItem[];
  instaMusic: InstaMusicConfig;
  hostSecurity: HostSecurityConfig;
  unlockStyle: 'heart-portal' | 'memory-galaxy' | 'secret-garden';
};

export type CoupleScreen = 
  | 'welcome' 
  | 'questions' 
  | 'constellation' 
  | 'portal' 
  | 'scrapbook' 
  | 'music'
  | 'video'
  | 'letter' 
  | 'final';
