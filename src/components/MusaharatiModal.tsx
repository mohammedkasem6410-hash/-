import React, { useEffect, useRef, useState } from 'react';
import { Moon, Volume2, VolumeX, X, BellRing, Sparkles, Clock, Music } from 'lucide-react';
import { MusaharatiSettings, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { soundEngine } from '../utils/audioSynthesizer';

interface MusaharatiModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MusaharatiSettings;
  language?: Language;
}

export const MusaharatiModal: React.FC<MusaharatiModalProps> = ({
  isOpen,
  onClose,
  settings,
  language = 'ar',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    setIsPlaying(true);

    // If user selected custom audio/video from their phone
    if (settings.customMediaUrl) {
      if (settings.customMediaType === 'video') {
        if (videoRef.current) {
          videoRef.current.volume = settings.volume ?? 0.9;
          videoRef.current.play().catch((err) => console.log('Video play error:', err));
        }
      } else {
        if (audioRef.current) {
          audioRef.current.volume = settings.volume ?? 0.9;
          audioRef.current.play().catch((err) => console.log('Audio play error:', err));
        }
      }
    } else {
      // Play authentic traditional preset synth chant
      soundEngine.playTakbeerTone(settings.volume ?? 0.85);
      const interval = setInterval(() => {
        soundEngine.playGentleBell(settings.volume ?? 0.7);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-gradient-to-b from-[#142323] via-[#0F1A1A] to-[#0A1010] border-2 border-amber-500/40 shadow-2xl shadow-amber-950/40 text-stone-100 flex flex-col">
        {/* Top Glowing Header with Lantern Icon */}
        <div className="relative h-48 bg-gradient-to-t from-[#142323] to-amber-950/60 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Decorative Stars / Lights */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-stone-300 hover:text-white transition-colors border border-stone-700"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Drum / Moon Animated Icon */}
          <div className="relative w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3 animate-pulse">
            <Moon className="w-10 h-10 text-amber-300 fill-amber-400/30" />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-600 text-stone-950">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-full">
            {t.musaharatiTitle}
          </span>
        </div>

        {/* Custom Video / Audio Container */}
        {settings.customMediaUrl && (
          <div className="px-6 py-2">
            {settings.customMediaType === 'video' ? (
              <video
                ref={videoRef}
                src={settings.customMediaUrl}
                controls
                autoPlay
                className="w-full max-h-56 rounded-2xl border border-amber-500/30 bg-black shadow-inner"
              />
            ) : (
              <audio
                ref={audioRef}
                src={settings.customMediaUrl}
                controls
                autoPlay
                className="w-full mt-2"
              />
            )}
          </div>
        )}

        {/* Spiritual Messages & Traditional Call */}
        <div className="p-6 space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-amber-300 font-serif leading-snug">
              {t.wakeUpForSuhoor}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-medium">
              {t.suhoorBlessing}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
            {settings.customMediaName ? (
              <p className="flex items-center justify-center gap-1.5 font-mono">
                <Music className="w-4 h-4 text-amber-400" />
                <span>{settings.customMediaName}</span>
              </p>
            ) : (
              <p>«اصحى يا نايم وحد الدايم.. طاب السحور يا صائمين.. بركة وطمأنينة ونور»</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-stone-950" />
              <span>{t.dismiss || 'إيقاف والاستيقاظ للسحور'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
