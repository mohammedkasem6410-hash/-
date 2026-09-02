import React, { useEffect, useRef, useState } from 'react';
import { 
  Bell, 
  Clock, 
  Volume2, 
  VolumeX, 
  X, 
  Moon, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Volume1
} from 'lucide-react';
import { AppSettings, ApproachingAlertItem, Language, PrayerKey } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { soundEngine } from '../utils/audioSynthesizer';

export interface TriggeredAlertEvent {
  type: 'approaching_alert' | 'musaharati';
  prayerKey?: PrayerKey;
  prayerName?: string;
  minutesBefore?: number;
  label: string;
  soundType?: string;
  customAudioUrl?: string;
  volume?: number;
}

interface FullScreenAlertModalProps {
  alertEvent: TriggeredAlertEvent | null;
  onClose: () => void;
  onSnooze: (minutes: number) => void;
  settings: AppSettings;
}

const PRAYER_BACKGROUNDS: Record<string, string> = {
  fajr: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80',
  sunrise: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  dhuhr: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80',
  asr: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
  maghrib: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80',
  isha: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1600&q=80',
  jumuah: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
  musaharati: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=80',
};

export const FullScreenAlertModal: React.FC<FullScreenAlertModalProps> = ({
  alertEvent,
  onClose,
  onSnooze,
  settings,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [countdown, setCountdown] = useState<number>(60);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const lang: Language = settings.language || 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;
  const isRtl = lang === 'ar';

  useEffect(() => {
    if (!alertEvent) return;

    // Reset countdown
    setCountdown(alertEvent.minutesBefore ? alertEvent.minutesBefore * 60 : 60);

    const volume = alertEvent.volume ?? 0.85;

    // Handle Custom Phone Audio URL
    if (alertEvent.customAudioUrl) {
      try {
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = new Audio();
        }
        audioPlayerRef.current.src = alertEvent.customAudioUrl;
        audioPlayerRef.current.volume = volume;
        audioPlayerRef.current.loop = true;
        audioPlayerRef.current.play().catch((e) => console.warn('Audio play error:', e));
      } catch (err) {
        console.warn(err);
      }
    } else if (alertEvent.type === 'musaharati') {
      soundEngine.playMusaharatiPreset(settings.musaharati?.presetId || 'ya_nayem', volume);
    } else {
      soundEngine.playAlertSound(alertEvent.soundType || 'gentle_bell', volume);
    }

    // Interval for countdown display
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      soundEngine.stopAll();
    };
  }, [alertEvent, settings.musaharati?.presetId]);

  if (!alertEvent) return null;

  const bgImage = alertEvent.type === 'musaharati'
    ? PRAYER_BACKGROUNDS.musaharati
    : (alertEvent.prayerKey ? PRAYER_BACKGROUNDS[alertEvent.prayerKey] || PRAYER_BACKGROUNDS.fajr : PRAYER_BACKGROUNDS.fajr);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (isMuted) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.muted = false;
      }
      setIsMuted(false);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.muted = true;
      }
      soundEngine.stopAll();
      setIsMuted(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background Graphic with Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

      {/* Main Alert Card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-neutral-900/90 border border-amber-500/30 shadow-2xl p-6 sm:p-8 text-center space-y-6 backdrop-blur-md">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          {alertEvent.type === 'musaharati'
            ? t.musaharatiTitle
            : (alertEvent.prayerName ? `${t.alertsTitle} — ${alertEvent.prayerName}` : t.alertsTitle)}
        </div>

        {/* Central Graphic & Title */}
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/30 to-emerald-500/20 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            {alertEvent.type === 'musaharati' ? (
              <Moon className="w-10 h-10 text-amber-300 animate-bounce" />
            ) : (
              <Bell className="w-10 h-10 text-amber-300 animate-wiggle" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {alertEvent.label}
          </h2>

          {alertEvent.minutesBefore && (
            <p className="text-sm font-semibold text-amber-400/90">
              {settings.language === 'ar' 
                ? `متبقي ${alertEvent.minutesBefore} دقيقة على موعد الأذان`
                : `${alertEvent.minutesBefore} minutes remaining until Adhan`}
            </p>
          )}
        </div>

        {/* Live Countdown Display */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center gap-4">
          <Clock className="w-5 h-5 text-amber-400" />
          <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-widest">
            {formatCountdown(countdown)}
          </span>
          <button
            type="button"
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>
        </div>

        {/* Action Buttons: Snooze & Dismiss */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => onSnooze(5)}
            className="w-full py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            {t.snooze5Min}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            {t.dismissAlert}
          </button>
        </div>
      </div>
    </div>
  );
};
