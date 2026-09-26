import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music, 
  Disc, 
  ListMusic, 
  X, 
  Upload, 
  Check, 
  Plus, 
  Flame,
  Radio
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import type { InstaTrack } from '../../types/heartVault';

export const InstaMusicPlayer: React.FC = () => {
  const { 
    config, 
    isInstaPlaying, 
    setIsInstaPlaying, 
    currentTrackIndex, 
    setCurrentTrackIndex,
    toggleInstaMusic,
    nextInstaTrack,
    prevInstaTrack,
    addInstaTrack
  } = useExperience();

  const insta = config.instaMusic;
  const tracks = insta?.tracks || [];
  const currentTrack: InstaTrack | undefined = tracks[currentTrackIndex] || tracks[0];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(insta?.volume ?? 0.7);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  // Custom song form in picker modal
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Synchronize audio element when track or playing state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.volume = isMuted ? 0 : volume;

    if (isInstaPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser policy until interaction
        });
      }
    } else {
      audio.pause();
    }
  }, [isInstaPlaying, currentTrackIndex, currentTrack?.audioUrl, volume, isMuted]);

  // First interaction auto-play trigger
  useEffect(() => {
    if (!insta?.autoPlayOnInteract || hasInteracted || isInstaPlaying) return;

    const handleFirstGesture = () => {
      setHasInteracted(true);
      if (audioRef.current && !isInstaPlaying) {
        audioRef.current.play().then(() => {
          setIsInstaPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [insta?.autoPlayOnInteract, hasInteracted, isInstaPlaying]);

  const handleTrackEnded = () => {
    nextInstaTrack();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSelectTrack = (idx: number) => {
    vaultAudio.playHeartCollect();
    setCurrentTrackIndex(idx);
    setIsInstaPlaying(true);
    setIsPickerOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const customTrack: InstaTrack = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'My Audio File',
        category: 'Custom',
        coverUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
        audioUrl: objectUrl,
      };
      addInstaTrack(customTrack);
      setCurrentTrackIndex(tracks.length);
      setIsInstaPlaying(true);
      vaultAudio.playCelebrationBurst();
    }
  };

  const handleAddCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAudioUrl.trim()) return;

    const customTrack: InstaTrack = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Instagram Audio',
      category: 'Custom',
      coverUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
      audioUrl: newAudioUrl.trim(),
    };

    addInstaTrack(customTrack);
    setCurrentTrackIndex(tracks.length);
    setIsInstaPlaying(true);
    setNewTitle('');
    setNewArtist('');
    setNewAudioUrl('');
    setShowAddForm(false);
    vaultAudio.playCelebrationBurst();
  };

  if (!insta?.enabled || !currentTrack) return null;

  return (
    <>
      {/* Real continuous audio background element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="auto"
        onEnded={handleTrackEnded}
      />

      {/* Floating Instagram Reels Music Widget */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm">
        <AnimatePresence mode="wait">
          {isMinimized ? (
            /* Minimized Pill Button */
            <motion.button
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-midnight-950/90 border border-rose-500/30 text-rose-300 backdrop-blur-xl shadow-xl hover:border-rose-400 transition-all hover:scale-105"
            >
              <div className="relative">
                <Disc className={`w-4 h-4 ${isInstaPlaying ? 'animate-spin text-rose-400' : 'text-slate-400'}`} />
                {isInstaPlaying && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <span className="text-[11px] font-sans font-medium text-white truncate max-w-[120px]">
                {currentTrack.title}
              </span>
            </motion.button>
          ) : (
            /* Full Instagram Reel Music Sticker Card */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-midnight-950/90 backdrop-blur-xl border border-rose-500/30 p-3 sm:p-3.5 shadow-2xl shadow-rose-950/40 text-slate-100 space-y-2.5 w-72 sm:w-80 overflow-hidden"
            >
              {/* Top Bar: Reel Audio Badge & Controls */}
              <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shrink-0">
                    <Music className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-[10px] font-sans tracking-wider uppercase font-medium text-rose-300 truncate">
                      INSTA REEL AUDIO
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Song Picker Toggle */}
                  <button
                    onClick={() => {
                      vaultAudio.playCardHover();
                      setIsPickerOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Choose Instagram Reel Track"
                  >
                    <ListMusic className="w-3.5 h-3.5 text-rose-300" />
                  </button>

                  {/* Minimize Widget */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Minimize Player"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Middle Row: Spinning Vinyl + Marquee Song Info */}
              <div className="flex items-center gap-3">
                {/* Rotating Vinyl Disc */}
                <div 
                  onClick={toggleInstaMusic}
                  className="relative w-11 h-11 rounded-full cursor-pointer shrink-0 group"
                >
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className={`w-full h-full object-cover rounded-full border border-rose-500/40 shadow-md ${
                      isInstaPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '8s' }}
                  />
                  <div className="absolute inset-0 rounded-full bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                    <div className="w-3 h-3 rounded-full bg-midnight-950 border border-white/50" />
                  </div>
                </div>

                {/* Track Details & Visualizer Bars */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-serif text-white font-medium truncate leading-tight">
                    {currentTrack.title}
                  </p>
                  <p className="text-[11px] font-sans text-rose-300/90 truncate font-light">
                    {currentTrack.artist}
                  </p>

                  {/* Dancing Audio Equalizer */}
                  <div className="flex items-center gap-0.5 mt-1 h-2.5">
                    {[6, 12, 8, 14, 10, 4, 11, 7, 13, 9].map((h, i) => (
                      <span
                        key={i}
                        className={`w-0.5 rounded-full transition-all duration-300 ${
                          isInstaPlaying
                            ? 'bg-gradient-to-t from-rose-500 to-violet-400 animate-pulse'
                            : 'bg-white/20'
                        }`}
                        style={{
                          height: isInstaPlaying ? `${(h * 0.7) + (i % 2 === 0 ? 2 : 0)}px` : '3px',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Play / Pause Big Button */}
                <button
                  onClick={() => {
                    vaultAudio.playCardHover();
                    toggleInstaMusic();
                  }}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
                  aria-label={isInstaPlaying ? 'Pause' : 'Play'}
                >
                  {isInstaPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Bottom Row: Next, Prev, Volume Slider */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      vaultAudio.playCardHover();
                      prevInstaTrack();
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                    title="Previous Track"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      vaultAudio.playCardHover();
                      nextInstaTrack();
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                    title="Next Track"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/10 rounded-lg accent-rose-400 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instagram Trending Songs Picker Modal */}
      <AnimatePresence>
        {isPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPickerOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-midnight-950/95 border border-rose-500/30 p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-white">Instagram Reel Audios</h3>
                    <p className="text-[11px] text-slate-400">Choose trending romantic songs or add your own</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Bar (Upload & Add Song) */}
              <div className="flex items-center gap-2 py-3">
                <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans text-rose-300 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-rose-400" />
                  <span>Upload Local Song (MP3)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setShowAddForm((prev) => !prev)}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-sans text-rose-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? 'Close URL Form' : 'Add Link'}</span>
                </button>
              </div>

              {/* Add Custom Audio Form */}
              {showAddForm && (
                <form onSubmit={handleAddCustomSong} className="p-4 mb-3 rounded-2xl bg-midnight-900 border border-rose-500/20 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Song Title..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="p-2 rounded-lg bg-midnight-950 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400"
                    />
                    <input
                      type="text"
                      placeholder="Artist Name..."
                      value={newArtist}
                      onChange={(e) => setNewArtist(e.target.value)}
                      className="p-2 rounded-lg bg-midnight-950 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Direct MP3 / Audio Stream URL (https://...)..."
                    value={newAudioUrl}
                    onChange={(e) => setNewAudioUrl(e.target.value)}
                    className="w-full p-2 rounded-lg bg-midnight-950 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs font-medium"
                  >
                    Add to Playlist
                  </button>
                </form>
              )}

              {/* Track List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {tracks.map((t, idx) => {
                  const isCurrent = idx === currentTrackIndex;

                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTrack(idx)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-sm'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      {/* Album Cover */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={t.coverUrl}
                          alt={t.title}
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && isInstaPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-serif text-white truncate font-medium">
                            {t.title}
                          </h4>
                          {t.category && (
                            <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                              {t.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-sans text-slate-400 truncate mt-0.5">
                          {t.artist}
                        </p>
                      </div>

                      {/* Play Status */}
                      <div className="shrink-0">
                        {isCurrent ? (
                          <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded-full bg-white/5 text-slate-400 flex items-center justify-center group-hover:text-white">
                            <Play className="w-3.5 h-3.5 translate-x-0.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
