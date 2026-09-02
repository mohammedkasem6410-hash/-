import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  Heart, 
  BookOpen,
  Maximize2
} from 'lucide-react';
import { AppSettings, PrayerKey } from '../types';
import { MUAZZIN_PRESETS, soundEngine } from '../utils/audioSynthesizer';

interface AdhanVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerKey: PrayerKey;
  settings: AppSettings;
}

const PRAYER_TITLES: Record<PrayerKey, string> = {
  fajr: 'أذان صلاة الفجر',
  sunrise: 'شروق الشمس',
  dhuhr: 'أذان صلاة الظهر',
  asr: 'أذان صلاة العصر',
  maghrib: 'أذان صلاة المغرب',
  isha: 'أذان صلاة العشاء',
  jumuah: 'أذان صلاة الجمعة المباركة',
  qiyam: 'وقت قيام الليل',
};

const DUA_AFTER_ADHAN = 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ، حَلَّتْ لَهُ شَفَاعَتِي يَوْمَ الْقِيَامَةِ';

export const AdhanVideoModal: React.FC<AdhanVideoModalProps> = ({
  isOpen,
  onClose,
  prayerKey,
  settings,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showDua, setShowDua] = useState(false);
  const [isPlayingDuaAudio, setIsPlayingDuaAudio] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const adhanConfigKey = prayerKey === 'jumuah' ? 'jumuah' : prayerKey;
  const config = settings.adhanConfig[adhanConfigKey] || settings.adhanConfig.dhuhr;

  // Resolve preset or custom media
  const preset = MUAZZIN_PRESETS.find(p => p.id === config?.muazzinId) || MUAZZIN_PRESETS[0];
  const videoSrc = config?.customMediaUrl || preset.videoUrl;
  const audioSrc = config?.customMediaUrl || preset.audioUrl;
  const isCustomUserVideo = Boolean(config?.customMediaUrl);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        new Intl.DateTimeFormat('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: !settings.twentyFourHourFormat,
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.twentyFourHourFormat]);

  // Autoplay video/audio on open
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setShowDua(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.warn('Video autoplay requires user interaction:', err);
        });
      }
    }
  }, [isOpen, videoSrc]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handlePlayDuaAudio = () => {
    setIsPlayingDuaAudio(true);
    soundEngine.speakArabic(DUA_AFTER_ADHAN);
    setTimeout(() => setIsPlayingDuaAudio(false), 12000);
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full max-w-5xl h-[85vh] sm:h-[88vh] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 flex flex-col bg-slate-950">
        
        {/* Background Video (or user custom video) */}
        <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            autoPlay
            loop
            muted={isMuted}
            poster={preset.posterImage}
            className="w-full h-full object-cover opacity-80 filter brightness-90"
            onEnded={() => setShowDua(true)}
          />
          {/* Subtle Dark Gradient Overlay for perfect text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        </div>

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 backdrop-blur-md flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span className="text-xs sm:text-sm font-extrabold text-emerald-200">
                {isCustomUserVideo ? 'فيديو مخصص من هاتفك' : preset.nameAr}
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-300 font-mono bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-700/50 backdrop-blur-md">
              {settings.city.nameAr} - {currentTimeStr}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFullScreen}
              className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700/60 backdrop-blur-md transition-colors"
              title="ملء الشاشة"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white shadow-lg transition-colors"
              title="إغلاق الأذان"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Content: Prayer Callout & Islamic Verse */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-block text-xs sm:text-sm font-semibold tracking-widest text-amber-400 uppercase bg-amber-950/60 border border-amber-500/40 px-4 py-1 rounded-full backdrop-blur-md">
              حيّ على الصلاة • حيّ على الفلاح
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg font-['Amiri',serif]">
              {PRAYER_TITLES[prayerKey]}
            </h2>

            <p className="text-sm sm:text-base text-emerald-300 font-medium max-w-lg mx-auto drop-shadow-md">
              «إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا»
            </p>

            {prayerKey === 'fajr' && (
              <div className="inline-block px-4 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/50 text-indigo-200 text-xs sm:text-sm font-bold shadow-lg">
                الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Post-Adhan Du'a & Media Controls */}
        <div className="relative z-10 p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl border-t border-emerald-900/40">
          {/* Post-Adhan Du'a Drawer */}
          {showDua ? (
            <div className="mb-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                دعاء ما بعد سماع الأذان (مستجاب)
              </div>
              <p className="text-sm sm:text-base font-bold text-white font-['Amiri',serif] leading-relaxed">
                «{DUA_AFTER_ADHAN}»
              </p>
              <button
                onClick={handlePlayDuaAudio}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingDuaAudio ? 'جاري قراءة الدعاء...' : 'استماع للدعاء'}</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <button
                onClick={() => setShowDua(true)}
                className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-amber-500/30"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>عرض دعاء ما بعد الأذان</span>
              </button>
            </div>
          )}

          {/* Player Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 transition-transform active:scale-95"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className={`p-3 rounded-2xl border transition-colors ${
                  isMuted
                    ? 'bg-rose-950/60 border-rose-800 text-rose-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                }`}
                title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              تم وأداء الصلاة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
