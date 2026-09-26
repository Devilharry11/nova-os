import React from 'react';
import { 
  Video as VideoIcon, 
  Upload, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';

export const VideoEditor: React.FC = () => {
  const { config, updateVideo } = useExperience();
  const video = config.video;

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Safe local object URL for preview without storing large video binary in localStorage
      const objectUrl = URL.createObjectURL(file);
      updateVideo({ videoUrl: objectUrl });
      vaultAudio.playHeartCollect();
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateVideo({ posterUrl: event.target.result as string });
          vaultAudio.playHeartCollect();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-white">Personalized Edit Video</h2>
          <p className="text-xs text-slate-400 mt-1">
            Display a personalized couple video or motion montage with custom framing and emotional overlays.
          </p>
        </div>

        <button
          onClick={() => updateVideo({ enabled: !video.enabled })}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-medium uppercase tracking-wider transition-all border ${
            video.enabled
              ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-sm'
              : 'bg-white/5 text-slate-400 border-white/10'
          }`}
        >
          {video.enabled ? 'Section Enabled' : 'Section Hidden'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-2 space-y-5">
          {/* Video Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Video Title
            </label>
            <input
              type="text"
              value={video.title}
              onChange={(e) => updateVideo({ title: e.target.value })}
              placeholder="e.g. Our Chapters in Motion"
              className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Video Source (URL / File Upload) */}
          <div className="space-y-2">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Video Source (MP4 / WebM URL or Local Video File)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={video.videoUrl}
                onChange={(e) => updateVideo({ videoUrl: e.target.value })}
                placeholder="Paste video stream URL (https://...)..."
                className="flex-1 p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
              />
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-rose-300" />
                <span>Upload Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-500">
              Uploaded video files use temporary local memory URLs for safe previewing without bloating browser storage.
            </p>
          </div>

          {/* Poster Thumbnail */}
          <div className="space-y-2">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Video Poster / Thumbnail Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={video.posterUrl || ''}
                onChange={(e) => updateVideo({ posterUrl: e.target.value })}
                placeholder="Paste thumbnail image URL..."
                className="flex-1 p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
              />
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer transition-colors shrink-0">
                <ImageIcon className="w-3.5 h-3.5 text-rose-300" />
                <span>Upload Poster</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Cinematic Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['16:9', '9:16', '4:3', '1:1'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => updateVideo({ aspectRatio: ratio })}
                  className={`p-2.5 rounded-xl border text-xs font-sans transition-all ${
                    video.aspectRatio === ratio
                      ? 'bg-rose-500/20 border-rose-400 text-white font-medium shadow-sm'
                      : 'bg-midnight-950/50 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{ratio}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {ratio === '16:9' ? 'Widescreen' : ratio === '9:16' ? 'Reels / Stories' : ratio === '4:3' ? 'Vintage' : 'Square'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Video Text Overlay
            </label>
            <input
              type="text"
              value={video.overlayText || ''}
              onChange={(e) => updateVideo({ overlayText: e.target.value })}
              placeholder="e.g. You are my favorite view..."
              className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Intro & Outro Messages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Introductory Text
              </label>
              <textarea
                rows={2}
                value={video.introText || ''}
                onChange={(e) => updateVideo({ introText: e.target.value })}
                placeholder="e.g. Some memories are too alive for a still photograph..."
                className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Outro Message
              </label>
              <textarea
                rows={2}
                value={video.outroText || ''}
                onChange={(e) => updateVideo({ outroText: e.target.value })}
                placeholder="e.g. Every second with you is a frame I would replay forever..."
                className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Video Frame Preview */}
        <div className="space-y-3">
          <label className="text-xs font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Framing Preview</span>
          </label>

          <div className="vault-card rounded-2xl p-4 border border-rose-500/20 shadow-xl space-y-3">
            <div className={`relative w-full rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center ${
              video.aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[200px] mx-auto' : 'aspect-video'
            }`}>
              {video.posterUrl ? (
                <img
                  src={video.posterUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <VideoIcon className="w-10 h-10 text-slate-600" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full bg-rose-600/80 flex items-center justify-center text-white">
                  ▶
                </span>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-serif text-white font-medium">{video.title || 'Untitled Video'}</h4>
              <p className="text-[11px] font-sans text-rose-300 font-light mt-0.5">
                Ratio: {video.aspectRatio} &bull; {video.overlayText ? 'Overlay active' : 'No overlay'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
