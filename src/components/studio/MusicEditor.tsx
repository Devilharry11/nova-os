import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  Sparkles, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Disc,
  Radio,
  Volume2
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import type { InstaTrack } from '../../types/heartVault';

export const MusicEditor: React.FC = () => {
  const { 
    config, 
    updateMusic, 
    updateInstaMusic, 
    addInstaTrack, 
    deleteInstaTrack,
    currentTrackIndex,
    setCurrentTrackIndex,
    setIsInstaPlaying
  } = useExperience();

  const music = config.music;
  const insta = config.instaMusic;

  const [musicSection, setMusicSection] = useState<'insta' | 'anthem'>('insta');

  // Test play for featured song
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const audioTestRef = useRef<HTMLAudioElement | null>(null);

  // Test play for insta tracks inside editor
  const [previewTrackUrl, setPreviewTrackUrl] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Add custom track state
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newCategory, setNewCategory] = useState<'Romantic Reel' | 'Aesthetic Lofi' | 'Trending Duet' | 'Custom'>('Romantic Reel');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTestPlay = () => {
    const audio = audioTestRef.current;
    if (!audio) return;

    if (isPlayingTest) {
      audio.pause();
      setIsPlayingTest(false);
    } else {
      audio.play().then(() => {
        setIsPlayingTest(true);
      }).catch(() => {
        setIsPlayingTest(false);
      });
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      updateMusic({ audioUrl: objectUrl });
      vaultAudio.playHeartCollect();
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateMusic({ coverUrl: event.target.result as string });
          vaultAudio.playHeartCollect();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreviewTrack = (url: string) => {
    if (previewTrackUrl === url) {
      previewAudioRef.current?.pause();
      setPreviewTrackUrl(null);
    } else {
      setPreviewTrackUrl(url);
      setTimeout(() => {
        previewAudioRef.current?.play().catch(() => {});
      }, 50);
    }
  };

  const handleAddInstaTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAudioUrl.trim()) return;

    const track: InstaTrack = {
      id: `insta-${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Instagram Artist',
      category: newCategory,
      coverUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
      audioUrl: newAudioUrl.trim(),
    };

    addInstaTrack(track);
    setNewTitle('');
    setNewArtist('');
    setNewAudioUrl('');
    setShowAddForm(false);
    vaultAudio.playCelebrationBurst();
  };

  const handleUploadInstaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const track: InstaTrack = {
        id: `insta-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'My Audio File',
        category: 'Custom',
        coverUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
        audioUrl: objectUrl,
      };
      addInstaTrack(track);
      vaultAudio.playCelebrationBurst();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hidden Audio Elements */}
      <audio
        ref={audioTestRef}
        src={music.audioUrl}
        onEnded={() => setIsPlayingTest(false)}
      />
      {previewTrackUrl && (
        <audio
          ref={previewAudioRef}
          src={previewTrackUrl}
          onEnded={() => setPreviewTrackUrl(null)}
        />
      )}

      {/* Header and Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white">Music & Sound Studio</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure Instagram-style background songs and the romantic featured anthem card.
          </p>
        </div>

        {/* Section switcher pills */}
        <div className="inline-flex p-1 rounded-xl bg-midnight-900 border border-white/10">
          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              setMusicSection('insta');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${
              musicSection === 'insta'
                ? 'bg-rose-500/20 text-rose-300 font-medium border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>Instagram Background Songs</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              setMusicSection('anthem');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${
              musicSection === 'anthem'
                ? 'bg-rose-500/20 text-rose-300 font-medium border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5 text-violet-400" />
            <span>Screen 6 Song Card</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: INSTAGRAM BACKGROUND SONGS */}
      {musicSection === 'insta' && (
        <div className="space-y-6">
          {/* Top Quick Settings Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Enable/Disable Background Music */}
            <div className="p-4 rounded-2xl vault-glass border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-sans font-medium text-white">Background Music</span>
                <p className="text-[10px] text-slate-400">Continuous playback across all pages</p>
              </div>
              <button
                type="button"
                onClick={() => updateInstaMusic({ enabled: !insta.enabled })}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  insta.enabled ? 'bg-rose-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    insta.enabled ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Play on First Tap */}
            <div className="p-4 rounded-2xl vault-glass border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-sans font-medium text-white">Auto-Play on Tap</span>
                <p className="text-[10px] text-slate-400">Smoothly start on first screen click</p>
              </div>
              <button
                type="button"
                onClick={() => updateInstaMusic({ autoPlayOnInteract: !insta.autoPlayOnInteract })}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  insta.autoPlayOnInteract ? 'bg-rose-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    insta.autoPlayOnInteract ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Volume Control */}
            <div className="p-4 rounded-2xl vault-glass border border-white/10 flex flex-col justify-center space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-white flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Music Volume</span>
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {Math.round((insta.volume ?? 0.7) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={insta.volume ?? 0.7}
                onChange={(e) => updateInstaMusic({ volume: Number(e.target.value) })}
                className="w-full h-1 bg-midnight-950/80 rounded-lg accent-rose-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Instagram Reel Tracks ({insta.tracks.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-rose-300" />
                <span>Upload Song (MP3)</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleUploadInstaFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setShowAddForm((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs font-sans font-medium shadow-glow-rose transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Close Link Form' : 'Add Custom Song Link'}</span>
              </button>
            </div>
          </div>

          {/* Add Song Form */}
          {showAddForm && (
            <form onSubmit={handleAddInstaTrack} className="p-5 rounded-2xl vault-card border border-rose-500/30 space-y-4">
              <h3 className="text-sm font-sans font-medium text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-400" />
                <span>Add Audio Link to Playlist</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-sans uppercase tracking-widest text-slate-400 block mb-1">
                    Song Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Until I Found You"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-midnight-950/90 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-sans uppercase tracking-widest text-slate-400 block mb-1">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stephen Sanchez"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-midnight-950/90 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-sans uppercase tracking-widest text-slate-400 block mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-midnight-950/90 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-400"
                  >
                    <option value="Romantic Reel">Romantic Reel</option>
                    <option value="Aesthetic Lofi">Aesthetic Lofi</option>
                    <option value="Trending Duet">Trending Duet</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-sans uppercase tracking-widest text-slate-400 block mb-1">
                  Direct Audio Stream URL (MP3 / Audio URL)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... direct audio stream"
                  value={newAudioUrl}
                  onChange={(e) => setNewAudioUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-midnight-950/90 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium"
                >
                  Add Song to Vault
                </button>
              </div>
            </form>
          )}

          {/* Tracks List */}
          <div className="space-y-2.5">
            {insta.tracks.map((track, idx) => {
              const isDefault = idx === currentTrackIndex;
              const isPlayingThis = previewTrackUrl === track.audioUrl;

              return (
                <div
                  key={track.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all gap-3 ${
                    isDefault
                      ? 'bg-rose-500/10 border-rose-500/40 shadow-sm'
                      : 'bg-midnight-900/50 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Album Art with Play button */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 group">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => togglePreviewTrack(track.audioUrl)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-80 hover:opacity-100 transition-opacity"
                        title={isPlayingThis ? 'Pause Preview' : 'Play Preview'}
                      >
                        {isPlayingThis ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-serif text-white truncate font-medium">
                          {track.title}
                        </h4>
                        {isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-rose-500/30 text-rose-200 border border-rose-500/40 shrink-0">
                            DEFAULT SONG
                          </span>
                        )}
                        {track.category && (
                          <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10 shrink-0">
                            {track.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-sans text-slate-400 truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isDefault && (
                      <button
                        onClick={() => {
                          vaultAudio.playHeartCollect();
                          setCurrentTrackIndex(idx);
                          setIsInstaPlaying(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-rose-300 font-sans transition-colors"
                      >
                        Set as Active
                      </button>
                    )}

                    {insta.tracks.length > 1 && (
                      <button
                        onClick={() => {
                          vaultAudio.playCardHover();
                          deleteInstaTrack(track.id);
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove from playlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: SCREEN 6 FEATURED ANTHEM CARD */}
      {musicSection === 'anthem' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Settings */}
          <div className="lg:col-span-2 space-y-5">
            {/* Song Title & Artist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                  Anthem Title
                </label>
                <input
                  type="text"
                  value={music.title}
                  onChange={(e) => updateMusic({ title: e.target.value })}
                  placeholder="e.g. Golden Hour"
                  className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={music.artist}
                  onChange={(e) => updateMusic({ artist: e.target.value })}
                  placeholder="e.g. JVKE"
                  className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Audio Source */}
            <div className="space-y-2">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400 flex items-center justify-between">
                <span>Audio Source (MP3 / Audio URL)</span>
                {music.audioUrl && (
                  <button
                    type="button"
                    onClick={toggleTestPlay}
                    className="inline-flex items-center gap-1 text-xs text-rose-300 hover:text-white"
                  >
                    {isPlayingTest ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingTest ? 'Stop Test' : 'Test Audio'}</span>
                  </button>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={music.audioUrl}
                  onChange={(e) => updateMusic({ audioUrl: e.target.value })}
                  placeholder="Paste audio stream URL (https://...)..."
                  className="flex-1 p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-rose-300" />
                  <span>Upload Audio</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Cover Artwork URL / Upload */}
            <div className="space-y-2">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Album / Memory Cover Art
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={music.coverUrl}
                  onChange={(e) => updateMusic({ coverUrl: e.target.value })}
                  placeholder="Paste cover image URL..."
                  className="flex-1 p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer transition-colors shrink-0">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-300" />
                  <span>Upload Cover</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Intro & Outro Texts */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                  Introductory Romantic Quote
                </label>
                <textarea
                  rows={2}
                  value={music.introText || ''}
                  onChange={(e) => updateMusic({ introText: e.target.value })}
                  placeholder="e.g. Press play, close your eyes, and listen to the song that feels like you..."
                  className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                  Outro Message / Personal Thought
                </label>
                <textarea
                  rows={2}
                  value={music.outroText || ''}
                  onChange={(e) => updateMusic({ outroText: e.target.value })}
                  placeholder="e.g. Every lyric reminds me of the way you look at me under twilight..."
                  className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Mini Player Preview */}
          <div className="space-y-3">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Card Preview</span>
            </label>

            <div className="vault-card rounded-2xl p-5 border border-rose-500/20 shadow-xl space-y-4 text-center">
              <div className="relative aspect-square w-36 mx-auto rounded-xl overflow-hidden border border-white/10 bg-midnight-950 shadow-lg">
                <img
                  src={music.coverUrl}
                  alt={music.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-base font-serif text-white font-medium">{music.title || 'Untitled Song'}</h4>
                <p className="text-xs font-sans text-rose-300 font-light">{music.artist || 'Unknown Artist'}</p>
              </div>

              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-rose-500" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
