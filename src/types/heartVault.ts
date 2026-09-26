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

export type VoiceNoteConfig = {
  enabled: boolean;
  title: string;
  audioUrl: string;
  duration?: string;
  recordedDate?: string;
  senderName?: string;
};

export type LetterConfig = {
  title: string;
  body: string;
  signature: string;
  finalMessage: string;
  revealStyle: RevealStyle;
  voiceNote?: VoiceNoteConfig;
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

export type SyncedLyricLine = {
  time: number;
  text: string;
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
  vinylSpinning?: boolean;
  lyrics?: SyncedLyricLine[];
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

export type TimelineMilestone = {
  id: string;
  title: string;
  date: string;
  location?: string;
  description: string;
  imageUrl?: string;
  icon?: 'sparkles' | 'coffee' | 'heart' | 'car' | 'plane' | 'star' | 'camera';
};

export type LoveReason = {
  id: string;
  number: number;
  title: string;
  text: string;
  category?: 'sweet' | 'humorous' | 'deep' | 'promise';
};

export type BucketListItem = {
  id: string;
  title: string;
  category: 'travel' | 'romantic' | 'adventure' | 'cozy';
  completed: boolean;
  targetDate?: string;
  note?: string;
};

export type OpenWhenEnvelope = {
  id: string;
  trigger: string;
  subtitle?: string;
  message: string;
  photoUrl?: string;
  category?: 'miss-you' | 'sad-day' | 'cant-sleep' | 'mad-at-me' | 'celebrate' | 'remind-love';
  sealColor?: string;
};

export type ChatGptSurpriseConfig = {
  enabled: boolean;
  modelName: string;
  partnerName: string;
  partnerPhotoUrl: string;
  defaultQuery: string;
  aiResponseIntro: string;
  aiVerdict: string;
  compliments: string[];
  tagline: string;
};

export type ExperienceConfig = {
  title: string;
  coupleNames: string;
  startDate?: string;
  welcomeMessage: string;
  welcomeSubtext: string;
  questions: Question[];
  timeline: TimelineMilestone[];
  memories: MemoryItem[];
  loveReasons: LoveReason[];
  bucketList: BucketListItem[];
  openWhen: OpenWhenEnvelope[];
  chatgpt: ChatGptSurpriseConfig;
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
  | 'timeline'
  | 'portal' 
  | 'scrapbook' 
  | 'openWhen'
  | 'chatgpt'
  | 'loveNotes'
  | 'bucketList'
  | 'letter' 
  | 'final'
  | 'constellation'
  | 'music'
  | 'video';

