import React, { useState, useRef } from 'react';
import { 
  Moon, 
  Sparkles, 
  Clock, 
  Volume2, 
  Play, 
  Square, 
  Upload, 
  Trash2, 
  Check, 
  Radio, 
  AlertCircle,
  FileAudio,
  FileVideo,
  Flame,
  RotateCcw
} from 'lucide-react';
import { AppSettings, MusaharatiSettings } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { soundEngine } from '../utils/audioSynthesizer';
import { saveMediaToDB, deleteMediaFromDB } from '../utils/mediaStorage';

interface MusaharatiTabSectionProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onTriggerTestMusaharati?: () => void;
}

export const MusaharatiTabSection: React.FC<MusaharatiTabSectionProps> = ({
  settings,
  onUpdateSettings,
  onTriggerTestMusaharati,
}) => {
  const t = TRANSLATIONS[settings.language || 'ar'] || TRANSLATIONS.ar;
  const isRtl = settings.language === 'ar';
  const musaharati = settings.musaharati || {
    enabled: true,
    timingMode: 'relative_fajr',
    minutesBeforeFajr: 60,
    fixedTime: '03:00',
    soundSource: 'preset',
    presetId: 'ya_nayem',
    volume: 0.9,
    onlyInRamadan: true,
  };

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [activePreviewType, setActivePreviewType] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const updateMusaharati = (partial: Partial<MusaharatiSettings>) => {
    onUpdateSettings({
      ...settings,
      musaharati: {
        ...musaharati,
        ...partial,
      },
    });
  };

  const handlePlayPreset = (presetId: string) => {
    if (isPlayingPreview && activePreviewType === presetId) {
      soundEngine.stopAll();
      setIsPlayingPreview(false);
      setActivePreviewType(null);
      return;
    }
    soundEngine.stopAll();
    setIsPlayingPreview(true);
    setActivePreviewType(presetId);
    soundEngine.playMusaharatiPreset(presetId, musaharati.volume);

    setTimeout(() => {
      setIsPlayingPreview(false);
      setActivePreviewType(null);
    }, 8000);
  };

  const handlePlayCustom = () => {
    if (!musaharati.customMediaUrl) return;

    if (isPlayingPreview && activePreviewType === 'custom') {
      if (customAudioPlayerRef.current) {
        customAudioPlayerRef.current.pause();
        customAudioPlayerRef.current.currentTime = 0;
      }
      setIsPlayingPreview(false);
      setActivePreviewType(null);
      return;
    }

    if (!customAudioPlayerRef.current) {
      customAudioPlayerRef.current = new Audio();
    }
    customAudioPlayerRef.current.src = musaharati.customMediaUrl;
    customAudioPlayerRef.current.volume = musaharati.volume;
    customAudioPlayerRef.current.play().then(() => {
      setIsPlayingPreview(true);
      setActivePreviewType('custom');
    }).catch(e => {
      console.warn('Playback error:', e);
    });

    customAudioPlayerRef.current.onended = () => {
      setIsPlayingPreview(false);
      setActivePreviewType(null);
    };
  };

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus(settings.language === 'ar' ? 'جاري حفظ الملف في ذاكرة هاتفك...' : 'Saving to device storage...');
      const mediaId = 'musaharati_custom_file';
      const isVideo = file.type.startsWith('video');
      const objectUrl = await saveMediaToDB(mediaId, file.name, isVideo ? 'video' : 'audio', file);

      updateMusaharati({
        soundSource: 'custom_phone',
        customMediaUrl: objectUrl,
        customMediaName: file.name,
        customMediaType: isVideo ? 'video' : 'audio',
      });

      setUploadStatus(settings.language === 'ar' ? 'تم تعيين صوت/فيديو المسحراتي بنجاح!' : 'File assigned successfully!');
      setTimeout(() => setUploadStatus(null), 3500);
    } catch (err) {
      console.error(err);
      setUploadStatus(settings.language === 'ar' ? 'حدث خطأ أثناء تحميل الملف' : 'Upload error');
    }
  };

  const handleRemoveCustomFile = async () => {
    try {
      await deleteMediaFromDB('musaharati_custom_file');
      updateMusaharati({
        soundSource: 'preset',
        customMediaUrl: undefined,
        customMediaName: undefined,
        customMediaType: undefined,
      });
      if (customAudioPlayerRef.current) {
        customAudioPlayerRef.current.pause();
      }
      setIsPlayingPreview(false);
    } catch (e) {
      console.error(e);
    }
  };

  const PRESET_OPTIONS: { id: MusaharatiSettings['presetId']; title: string; desc: string }[] = [
    {
      id: 'ya_nayem',
      title: t.musaharatiPresets.ya_nayem,
      desc: settings.language === 'ar' ? 'النداء الشعبي الأشهر مع دقات طبلة المسحراتي الحية' : 'Traditional drum with the famous wake-up chant',
    },
    {
      id: 'sahur_drum',
      title: t.musaharatiPresets.sahur_drum,
      desc: settings.language === 'ar' ? 'دقات وإيقاعات الطبلة التراثية الأصلية فقط' : 'Authentic Ramadan rhythmic drum beat only',
    },
    {
      id: 'traditional_chant',
      title: t.musaharatiPresets.traditional_chant,
      desc: settings.language === 'ar' ? 'نداء: يا عباد الله وحدوا الله.. قوموا لسحوركم' : 'Chanted call to remember Allah and wake up for Suhoor',
    },
    {
      id: 'makkah_sahur',
      title: t.musaharatiPresets.makkah_sahur,
      desc: settings.language === 'ar' ? 'نداء سحور الحرمين الشريفين والابتهالات' : 'Makkah and Madinah blessed Suhoor invocations',
    },
  ];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Ramadan Festive Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-transparent p-6 border border-amber-500/30">
        <div className="absolute top-0 end-0 p-6 opacity-15 pointer-events-none">
          <Moon className="w-32 h-32 text-amber-400" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {t.musaharatiTitle}
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-lg">
                {t.musaharatiDesc}
              </p>
            </div>
          </div>

          {/* Master Enable Switch */}
          <label className="flex items-center gap-3 cursor-pointer select-none bg-black/40 px-4 py-2.5 rounded-xl border border-white/10 hover:border-amber-400/40 transition">
            <span className="text-sm font-semibold text-white">
              {musaharati.enabled ? t.enabled : t.disabled}
            </span>
            <input
              type="checkbox"
              checked={musaharati.enabled}
              onChange={(e) => updateMusaharati({ enabled: e.target.checked })}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors relative ${musaharati.enabled ? 'bg-amber-500' : 'bg-white/20'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${musaharati.enabled ? 'start-6' : 'start-1'}`} />
            </div>
          </label>
        </div>
      </div>

      {musaharati.enabled && (
        <div className="space-y-6">
          {/* Section 1: Timing Mode */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t.musaharatiTimingMode}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Relative to Fajr */}
              <label 
                className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition ${
                  musaharati.timingMode === 'relative_fajr'
                    ? 'bg-amber-500/15 border-amber-400/60 shadow-lg shadow-amber-500/5'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Radio className={`w-4 h-4 ${musaharati.timingMode === 'relative_fajr' ? 'text-amber-400' : 'text-white/40'}`} />
                    {t.relativeFajrOption}
                  </span>
                  {musaharati.timingMode === 'relative_fajr' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-xs text-white/60">
                  {settings.language === 'ar' ? 'يحسب موعد السحور أوتوماتيكياً قبل أذان الفجر بالدقائق' : 'Calculates exact wake-up dynamically before Fajr'}
                </p>

                <input
                  type="radio"
                  name="musaharatiTiming"
                  className="sr-only"
                  checked={musaharati.timingMode === 'relative_fajr'}
                  onChange={() => updateMusaharati({ timingMode: 'relative_fajr' })}
                />

                {musaharati.timingMode === 'relative_fajr' && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <span className="text-xs text-white/80">{t.minutesBeforeFajrLabel}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={10}
                        max={180}
                        value={musaharati.minutesBeforeFajr}
                        onChange={(e) => updateMusaharati({ minutesBeforeFajr: Math.max(5, parseInt(e.target.value, 10) || 60) })}
                        className="w-20 px-3 py-1.5 rounded-lg bg-black/50 border border-amber-400/40 text-center font-bold text-amber-300 focus:outline-none"
                      />
                      <span className="text-xs text-white/60">{t.minutesShort}</span>
                    </div>
                  </div>
                )}
              </label>

              {/* Option 2: Fixed Time */}
              <label 
                className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition ${
                  musaharati.timingMode === 'fixed_time'
                    ? 'bg-amber-500/15 border-amber-400/60 shadow-lg shadow-amber-500/5'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Radio className={`w-4 h-4 ${musaharati.timingMode === 'fixed_time' ? 'text-amber-400' : 'text-white/40'}`} />
                    {t.fixedTimeOption}
                  </span>
                  {musaharati.timingMode === 'fixed_time' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-xs text-white/60">
                  {settings.language === 'ar' ? 'منبه يومي في وقت محدد وثابت تماماً' : 'Fixed clock alarm at a specified time'}
                </p>

                <input
                  type="radio"
                  name="musaharatiTiming"
                  className="sr-only"
                  checked={musaharati.timingMode === 'fixed_time'}
                  onChange={() => updateMusaharati({ timingMode: 'fixed_time' })}
                />

                {musaharati.timingMode === 'fixed_time' && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <span className="text-xs text-white/80">{t.exactTimeLabel}</span>
                    <input
                      type="time"
                      value={musaharati.fixedTime}
                      onChange={(e) => updateMusaharati({ fixedTime: e.target.value })}
                      className="px-3 py-1.5 rounded-lg bg-black/50 border border-amber-400/40 text-center font-bold text-amber-300 focus:outline-none"
                    />
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Section 2: Sound Source (Phone Custom vs Presets) */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              {settings.language === 'ar' ? 'صوت المسحراتي (من هاتفك أو النغمات التراثية)' : 'Musaharati Sound (Phone or Presets)'}
            </h4>

            {/* Custom Phone File Card */}
            <div className={`p-4 rounded-xl border transition ${
              musaharati.soundSource === 'custom_phone'
                ? 'bg-emerald-500/10 border-emerald-400/50'
                : 'bg-white/[0.02] border-white/10'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    {musaharati.customMediaType === 'video' ? <FileVideo className="w-5 h-5" /> : <FileAudio className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {musaharati.customMediaName || t.chooseAudioFromPhone}
                    </span>
                    <span className="text-xs text-white/60">
                      {musaharati.customMediaName
                        ? (settings.language === 'ar' ? 'ملف مخصص محفوظ في جهازك' : 'Custom file saved on device')
                        : (settings.language === 'ar' ? 'اختر أي ملف MP3, WAV, M4A أو فيديو من هاتفك' : 'Select audio or video from your device storage')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    className="hidden"
                    onChange={handleCustomUpload}
                  />

                  {musaharati.customMediaUrl ? (
                    <>
                      <button
                        type="button"
                        onClick={handlePlayCustom}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                          isPlayingPreview && activePreviewType === 'custom'
                            ? 'bg-amber-500 text-black'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isPlayingPreview && activePreviewType === 'custom' ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            {t.stopSound}
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            {t.testSound}
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {t.changeFile}
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveCustomFile}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition"
                        title={t.deleteCustomFile}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md flex items-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4" />
                      {t.chooseAudioFromPhone}
                    </button>
                  )}
                </div>
              </div>

              {uploadStatus && (
                <div className="mt-3 p-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-medium text-center">
                  {uploadStatus}
                </div>
              )}
            </div>

            {/* Presets List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-white/70 block">
                {t.musaharatiPresetSound}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_OPTIONS.map((p) => {
                  const isSelected = musaharati.soundSource === 'preset' && musaharati.presetId === p.id;
                  const isThisPlaying = isPlayingPreview && activePreviewType === p.id;

                  return (
                    <div
                      key={p.id}
                      onClick={() => updateMusaharati({ soundSource: 'preset', presetId: p.id })}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400/60 shadow'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className={`w-3 h-3 rounded-full border flex-shrink-0 ${
                          isSelected ? 'bg-amber-400 border-amber-400' : 'border-white/30'
                        }`} />
                        <div className="truncate">
                          <span className="text-xs font-bold text-white block truncate">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-white/50 block truncate">
                            {p.desc}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPreset(p.id);
                        }}
                        className={`p-2 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                          isThisPlaying
                            ? 'bg-amber-500 text-black'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        title={t.testSound}
                      >
                        {isThisPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
              <span className="text-xs text-white/80 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-white/50" />
                {t.volumeLabel}
              </span>
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={musaharati.volume}
                  onChange={(e) => updateMusaharati({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 bg-white/20 rounded-lg h-1.5 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-300 w-9 text-end">
                  {Math.round(musaharati.volume * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Extra Preferences & Test Trigger */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-sm font-bold text-white block">
                  {settings.language === 'ar' ? 'التفعيل خلال شهر رمضان المبارك فقط' : 'Active during Ramadan only'}
                </span>
                <span className="text-xs text-white/60">
                  {t.onlyInRamadanNotice}
                </span>
              </div>
              <input
                type="checkbox"
                checked={musaharati.onlyInRamadan}
                onChange={(e) => updateMusaharati({ onlyInRamadan: e.target.checked })}
                className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-white/60">
                {settings.language === 'ar' ? 'يمكنك اختبار تنبيه المسحراتي والشاشة المخصصة فوراً' : 'Test the live wake-up experience and screen right now'}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (onTriggerTestMusaharati) {
                    onTriggerTestMusaharati();
                  } else {
                    handlePlayPreset(musaharati.presetId);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                <Flame className="w-4 h-4" />
                {t.testMusaharati}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
