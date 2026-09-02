import React, { useState, useRef } from 'react';
import { 
  Video, 
  Volume2, 
  VolumeX, 
  Upload, 
  Play, 
  Pause, 
  Check, 
  Sparkles, 
  Trash2, 
  FolderPlus, 
  Smartphone, 
  FileVideo, 
  Music, 
  Layers, 
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { AppSettings, PrayerKey } from '../types';
import { MUAZZIN_PRESETS, soundEngine } from '../utils/audioSynthesizer';
import { saveMediaToDB, deleteMediaFromDB } from '../utils/mediaStorage';

interface AdhanTabSectionProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onPlayAdhan: (prayerKey: PrayerKey) => void;
}

const PRAYERS_LIST: { key: PrayerKey; nameAr: string; shortName: string; defaultDescription: string }[] = [
  { key: 'fajr', nameAr: 'صلاة الفجر', shortName: 'الفجر', defaultDescription: 'أذان الفجر (الصلاة خير من النوم)' },
  { key: 'dhuhr', nameAr: 'صلاة الظهر', shortName: 'الظهر', defaultDescription: 'أذان صلاة الظهر' },
  { key: 'asr', nameAr: 'صلاة العصر', shortName: 'العصر', defaultDescription: 'أذان صلاة العصر' },
  { key: 'maghrib', nameAr: 'صلاة المغرب', shortName: 'المغرب', defaultDescription: 'أذان صلاة المغرب عند الغروب' },
  { key: 'isha', nameAr: 'صلاة العشاء', shortName: 'العشاء', defaultDescription: 'أذان صلاة العشاء' },
  { key: 'jumuah', nameAr: 'صلاة الجمعة المباركة', shortName: 'الجمعة', defaultDescription: 'أذان صلاة الجمعة' },
];

export const AdhanTabSection: React.FC<AdhanTabSectionProps> = ({
  settings,
  onUpdateSettings,
  onPlayAdhan,
}) => {
  const [selectedPrayerTab, setSelectedPrayerTab] = useState<PrayerKey | 'all'>('all');
  const [uploadStatus, setUploadStatus] = useState<{ prayerKey: PrayerKey | 'all'; message: string; isError?: boolean } | null>(null);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<{ url: string; isVideo: boolean; title: string } | null>(null);

  // Hidden file inputs refs
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const prayerFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Helper to update specific prayer Adhan config
  const updateAdhanForPrayer = (prayerKey: PrayerKey, updates: Partial<AppSettings['adhanConfig'][PrayerKey]>) => {
    onUpdateSettings({
      ...settings,
      adhanConfig: {
        ...settings.adhanConfig,
        [prayerKey]: {
          ...settings.adhanConfig[prayerKey],
          ...updates,
        },
      },
    });
  };

  // Helper to update ALL prayers at once
  const updateAdhanForAllPrayers = (updates: Partial<AppSettings['adhanConfig'][PrayerKey]>) => {
    const updatedAdhanConfig = { ...settings.adhanConfig };
    PRAYERS_LIST.forEach((p) => {
      updatedAdhanConfig[p.key] = {
        ...updatedAdhanConfig[p.key],
        ...updates,
      };
    });
    onUpdateSettings({
      ...settings,
      adhanConfig: updatedAdhanConfig,
    });
  };

  // Handle uploading custom video or audio file from phone for a SPECIFIC prayer
  const handlePhoneFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, prayerKey: PrayerKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus({ prayerKey, message: 'جاري تحميل وحفظ الملف من هاتفك...' });
      const isVideo = file.type.startsWith('video');
      const mediaId = `custom_adhan_${prayerKey}`;
      const objectUrl = await saveMediaToDB(mediaId, file.name, isVideo ? 'video' : 'audio', file);

      updateAdhanForPrayer(prayerKey, {
        enabled: true,
        type: isVideo ? 'video' : 'audio',
        customMediaUrl: objectUrl,
        customMediaName: file.name,
        customMediaType: isVideo ? 'video' : 'audio',
      });

      setUploadStatus({ 
        prayerKey, 
        message: `تم تعيين ${isVideo ? 'فيديو' : 'صوت'} الأذان من هاتفك بنجاح (${file.name})` 
      });
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setUploadStatus({ prayerKey, message: 'تعذر تحميل الملف، يرجى المحاولة بملف آخر', isError: true });
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  // Handle BULK upload for ALL prayers at once from phone
  const handleBulkPhoneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus({ prayerKey: 'all', message: 'جاري حفظ وتعميم الملف على جميع الصلوات...' });
      const isVideo = file.type.startsWith('video');
      const mediaId = 'custom_adhan_all_prayers';
      const objectUrl = await saveMediaToDB(mediaId, file.name, isVideo ? 'video' : 'audio', file);

      updateAdhanForAllPrayers({
        enabled: true,
        type: isVideo ? 'video' : 'audio',
        customMediaUrl: objectUrl,
        customMediaName: file.name,
        customMediaType: isVideo ? 'video' : 'audio',
      });

      setUploadStatus({ 
        prayerKey: 'all', 
        message: `تم تعميم ${isVideo ? 'فيديو' : 'صوت'} الأذان من هاتفك على جميع الصلوات الخمس بنجاح!` 
      });
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setUploadStatus({ prayerKey: 'all', message: 'تعذر تحميل الملف، يرجى المحاولة مجدداً', isError: true });
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  // Remove custom media and revert
  const handleRemoveCustomMedia = async (prayerKey: PrayerKey) => {
    try {
      await deleteMediaFromDB(`custom_adhan_${prayerKey}`);
      updateAdhanForPrayer(prayerKey, {
        customMediaUrl: undefined,
        customMediaName: undefined,
        customMediaType: undefined,
      });
      setUploadStatus({ prayerKey, message: 'تمت إزالة الملف واستعادة الإعداد الافتراضي' });
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply single prayer custom media to all prayers
  const handleApplyToAll = (prayerKey: PrayerKey) => {
    const currentConfig = settings.adhanConfig[prayerKey];
    if (!currentConfig.customMediaUrl) return;

    updateAdhanForAllPrayers({
      type: currentConfig.type,
      customMediaUrl: currentConfig.customMediaUrl,
      customMediaName: currentConfig.customMediaName,
      customMediaType: currentConfig.customMediaType,
      muazzinId: currentConfig.muazzinId,
    });

    setUploadStatus({
      prayerKey: 'all',
      message: `تم تعميم ملف (${currentConfig.customMediaName}) على جميع الصلوات!`,
    });
    setTimeout(() => setUploadStatus(null), 4000);
  };

  const displayedPrayers = selectedPrayerTab === 'all' 
    ? PRAYERS_LIST 
    : PRAYERS_LIST.filter(p => p.key === selectedPrayerTab);

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3636] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1A3636] to-[#254949] text-[#D6BD98] flex items-center justify-center shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <span>اختيار الأذان (صوت وصورة من هاتفك)</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            يمكنك رفع وتعيين مقاطع الفيديو أو الملفات الصوتية الخاصة بالأذان من ذاكرة هاتفك/جهازك مباشرة لكل صلاة.
          </p>
        </div>

        {/* Global Bulk Upload Button */}
        <div>
          <input
            type="file"
            ref={bulkFileInputRef}
            onChange={handleBulkPhoneUpload}
            accept="video/*,audio/*,.mp4,.webm,.mov,.mkv,.mp3,.wav,.m4a,.ogg"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => bulkFileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1A3636] hover:bg-[#254949] text-[#D6BD98] font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            <FolderPlus className="w-4 h-4 text-[#D6BD98]" />
            <span>رفع فيديو/صوت وتعميمه على كل الصلوات</span>
          </button>
        </div>
      </div>

      {/* Global Upload Status Alert */}
      {uploadStatus && (
        <div className={`p-4 rounded-2xl font-bold text-xs flex items-center gap-2.5 shadow-md ${
          uploadStatus.isError ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-600 text-white'
        }`}>
          {uploadStatus.isError ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {/* Hero Guidance Banner for Picking Phone Media */}
      <div className="bg-gradient-to-br from-[#1A3636] to-[#254949] text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-right">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D6BD98] bg-white/10 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>أذان مخصص من ذاكرة هاتفك</span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#FDFCF8]">
            حرية كاملة لاختيار صوت وصورة الأذان المفضل لديك
          </h3>
          <p className="text-xs text-stone-200 leading-relaxed max-w-xl">
            اختر أي ملف فيديو (MP4 / WebM) أو ملف صوتي (MP3 / M4A / WAV) مسجل في هاتفك، وسيتم حفظه وتشغيله تلقائياً بصوت وصورة فائقة الدقة عند دخول وقت الصلاة.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => bulkFileInputRef.current?.click()}
            className="px-5 py-3 rounded-2xl bg-[#D6BD98] hover:bg-[#cbb089] text-[#1A3636] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>اختر ملف من الهاتف الآن</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Prayer */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedPrayerTab('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shadow-2xs ${
            selectedPrayerTab === 'all'
              ? 'bg-[#1A3636] text-[#D6BD98] border-[#1A3636]'
              : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200/80'
          }`}
        >
          <span>جميع الصلوات ({PRAYERS_LIST.length})</span>
        </button>

        {PRAYERS_LIST.map((p) => {
          const cfg = settings.adhanConfig[p.key];
          const hasCustom = Boolean(cfg?.customMediaUrl);

          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelectedPrayerTab(p.key)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shadow-2xs flex items-center gap-1.5 ${
                selectedPrayerTab === p.key
                  ? 'bg-[#1A3636] text-[#D6BD98] border-[#1A3636]'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200/80'
              }`}
            >
              <span>{p.shortName}</span>
              {hasCustom && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="ملف من الهاتف مخصص"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* PRAYERS ADHAN CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedPrayers.map((prayer) => {
          const config = settings.adhanConfig[prayer.key] || {
            enabled: true,
            type: 'video',
            muazzinId: 'makkah_live',
            volume: 0.9,
          };
          const hasCustom = Boolean(config.customMediaUrl);
          const activePreset = MUAZZIN_PRESETS.find(m => m.id === config.muazzinId) || MUAZZIN_PRESETS[0];

          return (
            <div
              key={prayer.key}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between gap-4 shadow-sm ${
                config.enabled ? 'border-stone-200/90' : 'border-stone-200/50 opacity-60'
              }`}
            >
              {/* Hidden file input for this specific prayer */}
              <input
                type="file"
                ref={(el) => { prayerFileInputRefs.current[prayer.key] = el; }}
                onChange={(e) => handlePhoneFileUpload(e, prayer.key)}
                accept="video/*,audio/*,.mp4,.webm,.mov,.mkv,.mp3,.wav,.m4a,.ogg"
                className="hidden"
              />

              {/* Top Row: Prayer Title + Adhan Switch */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1A3636] flex items-center gap-2">
                    <span>{prayer.nameAr}</span>
                    {hasCustom && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {config.customMediaType === 'video' ? '🎥 فيديو من الهاتف' : '🔊 صوت من الهاتف'}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">{prayer.defaultDescription}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-600">
                    {config.enabled ? 'مفعل' : 'معطل'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updateAdhanForPrayer(prayer.key, { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Phone Media Picker Box (The Highlighted Feature) */}
              <div className="p-4 rounded-2xl bg-[#F7F5F0] border-2 border-dashed border-[#D6BD98]/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A3636] flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#D6BD98]" />
                    <span>ملف الأذان من هاتفك / جهازك:</span>
                  </span>
                  {hasCustom && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomMedia(prayer.key)}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded"
                      title="إزالة هذا الملف"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>إزالة</span>
                    </button>
                  )}
                </div>

                {hasCustom ? (
                  <div className="space-y-2.5">
                    {/* Active Uploaded File Info */}
                    <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          {config.customMediaType === 'video' ? <FileVideo className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {config.customMediaName || 'ملف مخصص من هاتفك'}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-semibold">
                            جاهز للتشغيل عند وقت الصلاة
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => prayerFileInputRefs.current[prayer.key]?.click()}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#1A3636] bg-stone-100 hover:bg-stone-200 rounded-lg shrink-0 transition-colors"
                      >
                        تغيير
                      </button>
                    </div>

                    {/* Live Preview / Player if Video */}
                    {config.customMediaType === 'video' && config.customMediaUrl && (
                      <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-36 relative border border-stone-300">
                        <video
                          src={config.customMediaUrl}
                          controls
                          className="w-full h-full object-contain"
                          playsInline
                        />
                      </div>
                    )}

                    {/* Live Preview if Audio */}
                    {config.customMediaType === 'audio' && config.customMediaUrl && (
                      <div className="bg-white p-2 rounded-xl border border-stone-200">
                        <audio
                          src={config.customMediaUrl}
                          controls
                          className="w-full h-8"
                        />
                      </div>
                    )}

                    {/* Apply to all button */}
                    <button
                      type="button"
                      onClick={() => handleApplyToAll(prayer.key)}
                      className="w-full py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>تعميم هذا الملف على جميع الصلوات الخمس</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 space-y-2">
                    <p className="text-xs text-stone-600">
                      لم تختر ملفاً بعد. يمكنك اختيار فيديو أو صوت من هاتفك الآن.
                    </p>
                    <button
                      type="button"
                      onClick={() => prayerFileInputRefs.current[prayer.key]?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1A3636] hover:bg-[#254949] text-[#D6BD98] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>📱 اختر فيديو أو صوت الأذان من هاتفك</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Fallback / Alternative Presets if user wants */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  أو اختر من تسجيلات الحرمين المتاحة (احتياطياً):
                </label>
                <select
                  value={config.muazzinId}
                  onChange={(e) => updateAdhanForPrayer(prayer.key, { muazzinId: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-stone-200 focus:border-[#1A3636] rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
                >
                  {MUAZZIN_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.nameAr} - {preset.locationAr} (صوت وفيديو)
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Toggle & Volume Slider */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">نمط التشغيل:</span>
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => updateAdhanForPrayer(prayer.key, { type: 'video' })}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        config.type === 'video'
                          ? 'bg-[#1A3636] text-[#D6BD98] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>فيديو وصوت</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateAdhanForPrayer(prayer.key, { type: 'audio' })}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        config.type === 'audio'
                          ? 'bg-[#1A3636] text-[#D6BD98] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>صوت فقط</span>
                    </button>
                  </div>
                </div>

                {/* Volume Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span className="font-semibold">مستوى الصوت:</span>
                    <span className="font-bold font-mono text-[#1A3636]">
                      {Math.round((config.volume ?? 0.9) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={config.volume ?? 0.9}
                    onChange={(e) => updateAdhanForPrayer(prayer.key, { volume: parseFloat(e.target.value) })}
                    className="w-full accent-[#1A3636] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Test Adhan Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onPlayAdhan(prayer.key)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-[#1A3636] hover:text-[#D6BD98] text-stone-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs group"
                >
                  <Play className="w-4 h-4 fill-current group-hover:text-[#D6BD98]" />
                  <span>معاينة وتشغيل أذان {prayer.nameAr} كاملاً</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
