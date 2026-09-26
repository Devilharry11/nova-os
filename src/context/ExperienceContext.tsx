import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  ExperienceConfig, 
  CoupleScreen, 
  Question, 
  MemoryItem, 
  LetterConfig, 
  ThemeConfig,
  MusicConfig,
  VideoConfig,
  TypographyItem,
  InstaTrack,
  InstaMusicConfig,
  TimelineMilestone,
  LoveReason,
  BucketListItem,
  ChatGptSurpriseConfig
} from '../types/heartVault';
import { DEFAULT_EXPERIENCE } from '../data/defaultExperience';
import { vaultAudio } from '../utils/vaultAudio';

interface ExperienceContextType {
  config: ExperienceConfig;
  updateConfig: (patch: Partial<ExperienceConfig>) => void;
  updateQuestion: (question: Question) => void;
  addQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  updateMemory: (memory: MemoryItem) => void;
  addMemory: (memory: MemoryItem) => void;
  deleteMemory: (id: string) => void;
  updateLetter: (letter: Partial<LetterConfig>) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateMusic: (music: Partial<MusicConfig>) => void;
  updateVideo: (video: Partial<VideoConfig>) => void;
  updateTypographyItem: (item: TypographyItem) => void;
  addTypographyItem: (item: TypographyItem) => void;
  deleteTypographyItem: (id: string) => void;
  
  // Love Story Timeline
  updateTimelineMilestone: (milestone: TimelineMilestone) => void;
  addTimelineMilestone: (milestone: TimelineMilestone) => void;
  deleteTimelineMilestone: (id: string) => void;

  // Reasons Why I Love You
  updateLoveReason: (reason: LoveReason) => void;
  addLoveReason: (reason: LoveReason) => void;
  deleteLoveReason: (id: string) => void;

  // Couple Bucket List
  toggleBucketItem: (id: string) => void;
  addBucketItem: (item: BucketListItem) => void;
  deleteBucketItem: (id: string) => void;

  // ChatGPT AI Surprise
  updateChatGpt: (patch: Partial<ChatGptSurpriseConfig>) => void;

  resetToDefaults: () => void;
  
  // Instagram Background Music Engine
  isInstaPlaying: boolean;
  setIsInstaPlaying: (playing: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (idx: number) => void;
  toggleInstaMusic: () => void;
  nextInstaTrack: () => void;
  prevInstaTrack: () => void;
  updateInstaMusic: (patch: Partial<InstaMusicConfig>) => void;
  addInstaTrack: (track: InstaTrack) => void;
  deleteInstaTrack: (id: string) => void;

  // Host Private Security & Authentication
  isHostAuthenticated: boolean;
  isHostAuthModalOpen: boolean;
  setIsHostAuthModalOpen: (open: boolean) => void;
  authenticateHost: (pin: string) => boolean;
  lockHost: () => void;
  updateHostPin: (newPin: string) => void;

  // Partner Sharing & Sync
  generatePartnerShareLink: () => string;
  partnerWelcomeMessage: string | null;
  clearPartnerWelcomeMessage: () => void;

  // Navigation & Couple Experience State
  viewMode: 'couple' | 'studio';
  setViewMode: (mode: 'couple' | 'studio') => void;
  currentScreen: CoupleScreen;
  setScreen: (screen: CoupleScreen) => void;
  collectedHearts: number;
  collectedStars: number;
  answeredQuestions: Record<string, string>;
  answerQuestion: (questionId: string, answer: string, reward: number) => void;
  activeMemoryIndex: number;
  setActiveMemoryIndex: (index: number) => void;
  restartExperience: () => void;
}

const STORAGE_KEY = 'heart_vault_config_v1';
const HOST_AUTH_KEY = 'heart_vault_host_auth_token_v1';

const ExperienceContext = createContext<ExperienceContextType | null>(null);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partnerWelcomeMessage, setPartnerWelcomeMessage] = useState<string | null>(null);

  // Load config from URL (?vault=...) or localStorage with safe fallback merging
  const [config, setConfig] = useState<ExperienceConfig>(() => {
    // 1. Check if partner opened a shared vault link
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        let vaultParam = urlParams.get('vault');
        if (!vaultParam && window.location.hash.startsWith('#vault=')) {
          vaultParam = window.location.hash.replace('#vault=', '');
        }

        if (vaultParam) {
          try {
            const decodedJson = decodeURIComponent(atob(vaultParam));
            const parsed = JSON.parse(decodedJson);
            if (parsed && typeof parsed === 'object') {
              const merged: ExperienceConfig = {
                ...DEFAULT_EXPERIENCE,
                ...parsed,
                music: { ...DEFAULT_EXPERIENCE.music, ...(parsed.music || {}) },
                video: { ...DEFAULT_EXPERIENCE.video, ...(parsed.video || {}) },
                letter: {
                  ...DEFAULT_EXPERIENCE.letter,
                  ...(parsed.letter || {}),
                  voiceNote: {
                    ...DEFAULT_EXPERIENCE.letter.voiceNote,
                    ...(parsed.letter?.voiceNote || {}),
                  },
                },
                timeline: parsed.timeline && parsed.timeline.length > 0 ? parsed.timeline : DEFAULT_EXPERIENCE.timeline,
                loveReasons: parsed.loveReasons && parsed.loveReasons.length > 0 ? parsed.loveReasons : DEFAULT_EXPERIENCE.loveReasons,
                bucketList: parsed.bucketList && parsed.bucketList.length > 0 ? parsed.bucketList : DEFAULT_EXPERIENCE.bucketList,
                chatgpt: {
                  ...DEFAULT_EXPERIENCE.chatgpt,
                  ...(parsed.chatgpt || {}),
                },
                startDate: parsed.startDate || DEFAULT_EXPERIENCE.startDate,
                instaMusic: {
                  ...DEFAULT_EXPERIENCE.instaMusic,
                  ...(parsed.instaMusic || {}),
                  tracks: parsed.instaMusic?.tracks && parsed.instaMusic.tracks.length > 0
                    ? parsed.instaMusic.tracks
                    : DEFAULT_EXPERIENCE.instaMusic.tracks,
                },
                hostSecurity: {
                  ...DEFAULT_EXPERIENCE.hostSecurity,
                  ...(parsed.hostSecurity || {}),
                },
                typography: parsed.typography && parsed.typography.length > 0 
                  ? parsed.typography 
                  : DEFAULT_EXPERIENCE.typography,
              };

              // Automatically cache on partner's device
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                // Clean URL query param cleanly without refresh
                window.history.replaceState({}, document.title, window.location.pathname);
              } catch {}

              return merged;
            }
          } catch {
            // Ignored
          }
        }
      }
    } catch {}

    // 2. Load from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_EXPERIENCE,
          ...parsed,
          music: { ...DEFAULT_EXPERIENCE.music, ...(parsed.music || {}) },
          video: { ...DEFAULT_EXPERIENCE.video, ...(parsed.video || {}) },
          letter: {
            ...DEFAULT_EXPERIENCE.letter,
            ...(parsed.letter || {}),
            voiceNote: {
              ...DEFAULT_EXPERIENCE.letter.voiceNote,
              ...(parsed.letter?.voiceNote || {}),
            },
          },
          timeline: parsed.timeline && parsed.timeline.length > 0 ? parsed.timeline : DEFAULT_EXPERIENCE.timeline,
          loveReasons: parsed.loveReasons && parsed.loveReasons.length > 0 ? parsed.loveReasons : DEFAULT_EXPERIENCE.loveReasons,
          bucketList: parsed.bucketList && parsed.bucketList.length > 0 ? parsed.bucketList : DEFAULT_EXPERIENCE.bucketList,
          chatgpt: {
            ...DEFAULT_EXPERIENCE.chatgpt,
            ...(parsed.chatgpt || {}),
          },
          startDate: parsed.startDate || DEFAULT_EXPERIENCE.startDate,
          instaMusic: {
            ...DEFAULT_EXPERIENCE.instaMusic,
            ...(parsed.instaMusic || {}),
            tracks: parsed.instaMusic?.tracks && parsed.instaMusic.tracks.length > 0
              ? parsed.instaMusic.tracks
              : DEFAULT_EXPERIENCE.instaMusic.tracks,
          },
          hostSecurity: {
            ...DEFAULT_EXPERIENCE.hostSecurity,
            ...(parsed.hostSecurity || {}),
          },
          typography: parsed.typography && parsed.typography.length > 0 
            ? parsed.typography 
            : DEFAULT_EXPERIENCE.typography,
        };
      }
    } catch {
      // Ignored
    }
    return DEFAULT_EXPERIENCE;
  });

  // Mode and Journey State
  const [viewMode, setViewModeState] = useState<'couple' | 'studio'>('couple');
  const [currentScreen, setCurrentScreen] = useState<CoupleScreen>('welcome');
  const [collectedHearts, setCollectedHearts] = useState<number>(0);
  const [collectedStars, setCollectedStars] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});
  const [activeMemoryIndex, setActiveMemoryIndex] = useState<number>(0);

  // Host Authentication State
  const [isHostAuthenticated, setIsHostAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HOST_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isHostAuthModalOpen, setIsHostAuthModalOpen] = useState<boolean>(false);

  // Instagram Music State
  const [isInstaPlaying, setIsInstaPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(() => {
    return config.instaMusic?.currentTrackIndex || 0;
  });

  // Check URL parameter (?host=1 or ?admin=1)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('host') || params.has('admin')) {
        if (!isHostAuthenticated) {
          setIsHostAuthModalOpen(true);
        }
      }
    } catch {
      // Ignored
    }
  }, [isHostAuthenticated]);

  // Protected ViewMode setter
  const setViewMode = (mode: 'couple' | 'studio') => {
    if (mode === 'studio' && !isHostAuthenticated) {
      setIsHostAuthModalOpen(true);
      return;
    }
    setViewModeState(mode);
  };

  const authenticateHost = (pin: string): boolean => {
    const validPin = config.hostSecurity?.pin || '1402';
    if (pin.trim() === validPin.trim()) {
      setIsHostAuthenticated(true);
      try {
        localStorage.setItem(HOST_AUTH_KEY, 'true');
      } catch {}
      setIsHostAuthModalOpen(false);
      vaultAudio.playCelebrationBurst();
      return true;
    }
    return false;
  };

  const lockHost = () => {
    setIsHostAuthenticated(false);
    try {
      localStorage.removeItem(HOST_AUTH_KEY);
    } catch {}
    setViewModeState('couple');
    vaultAudio.playSoftTransition();
  };

  const updateHostPin = (newPin: string) => {
    setConfig((prev) => ({
      ...prev,
      hostSecurity: {
        ...prev.hostSecurity,
        pin: newPin,
      },
    }));
  };

  // Instagram Music Handlers
  const toggleInstaMusic = () => {
    setIsInstaPlaying((prev) => !prev);
  };

  const nextInstaTrack = () => {
    const total = config.instaMusic.tracks.length;
    if (total === 0) return;
    const nextIdx = (currentTrackIndex + 1) % total;
    setCurrentTrackIndex(nextIdx);
    setIsInstaPlaying(true);
  };

  const prevInstaTrack = () => {
    const total = config.instaMusic.tracks.length;
    if (total === 0) return;
    const prevIdx = (currentTrackIndex - 1 + total) % total;
    setCurrentTrackIndex(prevIdx);
    setIsInstaPlaying(true);
  };

  const updateInstaMusic = (patch: Partial<InstaMusicConfig>) => {
    setConfig((prev) => ({
      ...prev,
      instaMusic: { ...prev.instaMusic, ...patch },
    }));
  };

  const addInstaTrack = (track: InstaTrack) => {
    setConfig((prev) => ({
      ...prev,
      instaMusic: {
        ...prev.instaMusic,
        tracks: [...prev.instaMusic.tracks, track],
      },
    }));
  };

  const deleteInstaTrack = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      instaMusic: {
        ...prev.instaMusic,
        tracks: prev.instaMusic.tracks.filter((t) => t.id !== id),
      },
    }));
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignored
    }
  }, [config]);

  const updateConfig = (patch: Partial<ExperienceConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const updateQuestion = (question: Question) => {
    setConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === question.id ? question : q)),
    }));
  };

  const addQuestion = (question: Question) => {
    setConfig((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
  };

  const deleteQuestion = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const reorderQuestions = (startIndex: number, endIndex: number) => {
    setConfig((prev) => {
      const list = [...prev.questions];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      return { ...prev, questions: list };
    });
  };

  const updateMemory = (memory: MemoryItem) => {
    setConfig((prev) => ({
      ...prev,
      memories: prev.memories.map((m) => (m.id === memory.id ? memory : m)),
    }));
  };

  const addMemory = (memory: MemoryItem) => {
    setConfig((prev) => ({
      ...prev,
      memories: [...prev.memories, memory],
    }));
  };

  const deleteMemory = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  const updateLetter = (letter: Partial<LetterConfig>) => {
    setConfig((prev) => ({
      ...prev,
      letter: { ...prev.letter, ...letter },
    }));
  };

  const updateTheme = (theme: Partial<ThemeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...theme },
    }));
  };

  const updateMusic = (music: Partial<MusicConfig>) => {
    setConfig((prev) => ({
      ...prev,
      music: { ...prev.music, ...music },
    }));
  };

  const updateVideo = (video: Partial<VideoConfig>) => {
    setConfig((prev) => ({
      ...prev,
      video: { ...prev.video, ...video },
    }));
  };

  const updateTypographyItem = (item: TypographyItem) => {
    setConfig((prev) => ({
      ...prev,
      typography: prev.typography.map((t) => (t.id === item.id ? item : t)),
    }));
  };

  const addTypographyItem = (item: TypographyItem) => {
    setConfig((prev) => ({
      ...prev,
      typography: [...prev.typography, item],
    }));
  };

  const deleteTypographyItem = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      typography: prev.typography.filter((t) => t.id !== id),
    }));
  };

  // Timeline handlers
  const updateTimelineMilestone = (milestone: TimelineMilestone) => {
    setConfig((prev) => ({
      ...prev,
      timeline: prev.timeline.map((m) => (m.id === milestone.id ? milestone : m)),
    }));
  };

  const addTimelineMilestone = (milestone: TimelineMilestone) => {
    setConfig((prev) => ({
      ...prev,
      timeline: [...prev.timeline, milestone],
    }));
  };

  const deleteTimelineMilestone = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((m) => m.id !== id),
    }));
  };

  // Love Reasons handlers
  const updateLoveReason = (reason: LoveReason) => {
    setConfig((prev) => ({
      ...prev,
      loveReasons: prev.loveReasons.map((r) => (r.id === reason.id ? reason : r)),
    }));
  };

  const addLoveReason = (reason: LoveReason) => {
    setConfig((prev) => ({
      ...prev,
      loveReasons: [...prev.loveReasons, reason],
    }));
  };

  const deleteLoveReason = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      loveReasons: prev.loveReasons.filter((r) => r.id !== id),
    }));
  };

  // Bucket list handlers
  const toggleBucketItem = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      bucketList: prev.bucketList.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b)),
    }));
    vaultAudio.playHeartCollect();
  };

  const addBucketItem = (item: BucketListItem) => {
    setConfig((prev) => ({
      ...prev,
      bucketList: [...prev.bucketList, item],
    }));
  };

  const deleteBucketItem = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      bucketList: prev.bucketList.filter((b) => b.id !== id),
    }));
  };

  // ChatGPT Surprise handler
  const updateChatGpt = (patch: Partial<ChatGptSurpriseConfig>) => {
    setConfig((prev) => ({
      ...prev,
      chatgpt: { ...prev.chatgpt, ...patch },
    }));
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_EXPERIENCE);
    localStorage.removeItem(STORAGE_KEY);
    restartExperience();
  };

  const answerQuestion = (questionId: string, answer: string, reward: number) => {
    setAnsweredQuestions((prev) => ({ ...prev, [questionId]: answer }));
    setCollectedHearts((prev) => prev + reward);
    setCollectedStars((prev) => prev + 1);
    vaultAudio.playHeartCollect();
  };

  const restartExperience = () => {
    setCurrentScreen('welcome');
    setCollectedHearts(0);
    setCollectedStars(0);
    setAnsweredQuestions({});
    setActiveMemoryIndex(0);
  };

  const setScreen = (screen: CoupleScreen) => {
    vaultAudio.playSoftTransition();
    setCurrentScreen(screen);
  };

  const generatePartnerShareLink = (): string => {
    try {
      // Omit hostSecurity pin for security so partner cannot alter admin pin
      const { hostSecurity, ...safeConfig } = config;
      const jsonStr = JSON.stringify(safeConfig);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}?vault=${encoded}`;
    } catch {
      return window.location.href;
    }
  };

  const clearPartnerWelcomeMessage = () => {
    setPartnerWelcomeMessage(null);
  };

  return (
    <ExperienceContext.Provider
      value={{
        config,
        updateConfig,
        updateQuestion,
        addQuestion,
        deleteQuestion,
        reorderQuestions,
        updateMemory,
        addMemory,
        deleteMemory,
        updateLetter,
        updateTheme,
        updateMusic,
        updateVideo,
        updateTypographyItem,
        addTypographyItem,
        deleteTypographyItem,
        // Love Story Timeline
        updateTimelineMilestone,
        addTimelineMilestone,
        deleteTimelineMilestone,
        // Reasons Why I Love You
        updateLoveReason,
        addLoveReason,
        deleteLoveReason,
        // Couple Bucket List
        toggleBucketItem,
        addBucketItem,
        deleteBucketItem,
        resetToDefaults,
        // Instagram Background Music
        isInstaPlaying,
        setIsInstaPlaying,
        currentTrackIndex,
        setCurrentTrackIndex,
        toggleInstaMusic,
        nextInstaTrack,
        prevInstaTrack,
        updateInstaMusic,
        addInstaTrack,
        deleteInstaTrack,
        // Host Security & Auth
        isHostAuthenticated,
        isHostAuthModalOpen,
        setIsHostAuthModalOpen,
        authenticateHost,
        lockHost,
        updateHostPin,
        // Partner Sharing & Sync
        generatePartnerShareLink,
        partnerWelcomeMessage,
        clearPartnerWelcomeMessage,
        // Navigation & Journey
        viewMode,
        setViewMode,
        currentScreen,
        setScreen,
        collectedHearts,
        collectedStars,
        answeredQuestions,
        answerQuestion,
        activeMemoryIndex,
        setActiveMemoryIndex,
        restartExperience,
        updateChatGpt,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
};

