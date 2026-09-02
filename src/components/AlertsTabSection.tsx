import React, { useState, useRef } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Volume2, 
  Clock, 
  Sparkles, 
  Check, 
  Copy, 
  Edit3, 
  Play, 
  Square,
  CheckCircle2, 
  X, 
  Smartphone,
  Music,
  Upload,
  ChevronDown,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { ApproachingAlertItem, AlertSoundType, PrayerKey } from '../types';
import { ALERT_SOUND_OPTIONS, soundEngine } from '../utils/audioSynthesizer';
import { saveMediaToDB, deleteMediaFromDB } from '../utils/mediaStorage';
import { PRAYER_VISUALS } from '../data/prayerImages';

interface AlertsTabSectionProps {
  alerts: ApproachingAlertItem[];
  onUpdateAlerts: (newAlerts: ApproachingAlertItem[]) => void;
  onOpenPrayersView?: () => void;
}

const PRAYER_DROPDOWN_KEYS: (PrayerKey | 'all')[] = [
  'all',
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
  'jumuah',
  'qiyam',
];

export const AlertsTabSection: React.FC<AlertsTabSectionProps> = ({
  alerts,
  onUpdateAlerts,
  onOpenPrayersView,
}) => {
  // Form State for creating / editing alert
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerKey | 'all'>('fajr');
  const [minutesBefore, setMinutesBefore] = useState<number>(15);
  const [label, setLabel] = useState<string>('الاستيقاظ والوضوء وسنة الصلاة');
  const [soundType, setSoundType] = useState<AlertSoundType>('makkah_chime');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | undefined>(undefined);
  const [customAudioName, setCustomAudioName] = useState<string | undefined>(undefined);
  const [volume, setVolume] = useState<number>(0.85);
  const [vibrate, setVibrate] = useState<boolean>(true);
  
  // Filter tab for viewing existing alerts
  const [activeFilterPrayer, setActiveFilterPrayer] = useState<PrayerKey | 'all'>('all');
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  
  // Sound testing state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // File input ref for phone audio upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [showToast, setShowToast] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const triggerToast = (message: string, isSuccess = true) => {
    setShowToast({ message, isSuccess });
    setTimeout(() => setShowToast(null), 3500);
  };

  // Get visual metadata for current selected prayer
  const activeVisual = PRAYER_VISUALS[selectedPrayer] || PRAYER_VISUALS.fajr;

  // Handle uploading audio file from phone for the form
  const handlePhoneAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const mediaId = `custom_alert_sound_${Date.now()}`;
      const objectUrl = await saveMediaToDB(mediaId, file.name, 'audio', file);
      setCustomAudioUrl(objectUrl);
      setCustomAudioName(file.name);
      triggerToast(`تم اختيار صوت التنبيه من هاتفك بنجاح: (${file.name})`);
    } catch (err) {
      console.error(err);
      triggerToast('تعذر تحميل الملف من هاتفك، يرجى اختيار ملف صوتي آخر', false);
    }
  };

  // Handle uploading audio from phone directly onto an existing card
  const handleCardPhoneAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>, alertId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const mediaId = `custom_alert_sound_${alertId}`;
      const objectUrl = await saveMediaToDB(mediaId, file.name, 'audio', file);
      const updated = alerts.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            customAudioUrl: objectUrl,
            customAudioName: file.name,
          };
        }
        return a;
      });
      onUpdateAlerts(updated);
      triggerToast(`تم تعيين صوت التنبيه من هاتفك: (${file.name})`);
    } catch (err) {
      console.error(err);
      triggerToast('تعذر تحميل الملف، يرجى المحاولة مجدداً', false);
    }
  };

  // Play test sound (either custom phone audio or built-in tone)
  const handleTestPlay = (audioUrl?: string, defaultSoundType?: AlertSoundType, playId: string = 'form') => {
    // If already playing this audio, stop it
    if (playingAudioId === playId) {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
        activeAudioElementRef.current.currentTime = 0;
      }
      setPlayingAudioId(null);
      return;
    }

    // Stop existing playback
    if (activeAudioElementRef.current) {
      activeAudioElementRef.current.pause();
      activeAudioElementRef.current.currentTime = 0;
    }

    setPlayingAudioId(playId);

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audio.volume = volume;
        activeAudioElementRef.current = audio;
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => {
          setPlayingAudioId(null);
          // Fallback to built-in tone
          soundEngine.playAlertSound(defaultSoundType || soundType, volume);
        };
        audio.play().catch(e => {
          console.log('Play error, falling back:', e);
          setPlayingAudioId(null);
          soundEngine.playAlertSound(defaultSoundType || soundType, volume);
        });
      } catch (e) {
        setPlayingAudioId(null);
        soundEngine.playAlertSound(defaultSoundType || soundType, volume);
      }
    } else {
      soundEngine.playAlertSound(defaultSoundType || soundType, volume);
      setTimeout(() => setPlayingAudioId(null), 3000);
    }
  };

  // Save or Update Alert
  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure minutes is a valid positive number
    const customMinutes = Math.max(1, Number(minutesBefore) || 1);

    if (editingAlertId) {
      // Edit existing alert
      const updated = alerts.map(a => {
        if (a.id === editingAlertId) {
          return {
            ...a,
            prayer: selectedPrayer === 'all' ? a.prayer : selectedPrayer,
            minutesBefore: customMinutes,
            label: label.trim() || `تنبيه قبل ${selectedPrayer}`,
            soundType,
            customAudioUrl,
            customAudioName,
            volume,
            vibrate,
          };
        }
        return a;
      });
      onUpdateAlerts(updated);
      setEditingAlertId(null);
      triggerToast('تم حفظ تعديلات التنبيه بنجاح!');
    } else {
      // Add new unlimited alert(s)
      if (selectedPrayer === 'all') {
        const prayersList: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const newAlerts: ApproachingAlertItem[] = prayersList.map(pk => ({
          id: `alert_${pk}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          prayer: pk,
          timingType: 'relative',
          minutesBefore: customMinutes,
          label: label.trim() || `تنبيه قبل صلاة ${PRAYER_VISUALS[pk]?.shortName || pk}`,
          enabled: true,
          soundType,
          customAudioUrl,
          customAudioName,
          volume,
          vibrate,
        }));
        onUpdateAlerts([...alerts, ...newAlerts]);
        triggerToast(`تمت إضافة 5 تنبيهات لجميع الصلوات (قبل بـ ${customMinutes} دقيقة) بنجاح!`);
      } else {
        const newAlert: ApproachingAlertItem = {
          id: `alert_${selectedPrayer}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          prayer: selectedPrayer,
          timingType: 'relative',
          minutesBefore: customMinutes,
          label: label.trim() || `تنبيه قبل صلاة ${PRAYER_VISUALS[selectedPrayer]?.shortName || selectedPrayer}`,
          enabled: true,
          soundType,
          customAudioUrl,
          customAudioName,
          volume,
          vibrate,
        };
        onUpdateAlerts([...alerts, newAlert]);
        triggerToast(`تمت إضافة التنبيه بنجاح (قبل بـ ${customMinutes} دقيقة)!`);
      }
    }

    // Reset fields
    setLabel('الاستيقاظ والوضوء وسنة الصلاة');
  };

  // Toggle Alert
  const handleToggleAlert = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
    onUpdateAlerts(updated);
  };

  // Delete Alert
  const handleDeleteAlert = async (alert: ApproachingAlertItem) => {
    if (alert.customAudioUrl) {
      await deleteMediaFromDB(`custom_alert_sound_${alert.id}`).catch(() => {});
    }
    const updated = alerts.filter(a => a.id !== alert.id);
    onUpdateAlerts(updated);
    if (editingAlertId === alert.id) {
      setEditingAlertId(null);
    }
    triggerToast('تم حذف التنبيه');
  };

  // Duplicate Alert
  const handleDuplicateAlert = (alert: ApproachingAlertItem) => {
    const duplicate: ApproachingAlertItem = {
      ...alert,
      id: `alert_${alert.prayer}_${Date.now()}_dup`,
      label: `${alert.label} (نسخة إضافية)`,
    };
    onUpdateAlerts([...alerts, duplicate]);
    triggerToast('تم تكرار التنبيه بنجاح');
  };

  // Edit Alert
  const handleStartEdit = (alert: ApproachingAlertItem) => {
    setEditingAlertId(alert.id);
    setSelectedPrayer(alert.prayer);
    setMinutesBefore(alert.minutesBefore);
    setLabel(alert.label);
    setSoundType(alert.soundType);
    setCustomAudioUrl(alert.customAudioUrl);
    setCustomAudioName(alert.customAudioName);
    setVolume(alert.volume ?? 0.85);
    setVibrate(alert.vibrate ?? true);
    
    const formEl = document.getElementById('add-alert-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingAlertId(null);
    setLabel('الاستيقاظ والوضوء وسنة الصلاة');
    setCustomAudioUrl(undefined);
    setCustomAudioName(undefined);
    setMinutesBefore(15);
  };

  // Filtered alerts list
  const displayedAlerts = alerts.filter(a => {
    if (activeFilterPrayer === 'all') return true;
    return a.prayer === activeFilterPrayer;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Hidden file input for phone audio in form */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhoneAudioUpload}
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac,.webm"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3636] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1A3636] text-[#D6BD98] flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <span>تنبيهات قبل الصلاة والأذان</span>
            <span className="text-xs font-normal text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              عدد غير محدود ({alerts.length} تنبيه مضاف)
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            اختر الصلاة، وحدد أي مدة بالدقائق على مزاجك، واختر صوت التنبيه من ذاكرة هاتفك مع صور روحانية معبرة لكل صلاة.
          </p>
        </div>

        {onOpenPrayersView && (
          <button
            type="button"
            onClick={onOpenPrayersView}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1A3636] bg-[#F7F5F0] hover:bg-[#eae5d8] rounded-xl border border-[#D6BD98]/60 transition-colors self-start sm:self-auto"
          >
            <span>عرض جدول المواقيت</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className={`p-3.5 rounded-2xl text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
          showToast.isSuccess ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          {showToast.isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
          <span>{showToast.message}</span>
        </div>
      )}

      {/* SECTION 1: ADD / EDIT ALERT WITH PRAYER VISUAL IMAGE & PHONE AUDIO */}
      <div id="add-alert-form" className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        {/* Visual Header with Image for Selected Prayer */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-900">
          <img
            src={activeVisual.imageUrl}
            alt={activeVisual.nameAr}
            className="w-full h-full object-cover opacity-80 transition-all duration-700 hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${activeVisual.colorAccent} via-stone-950/60 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white`} />
          
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white pointer-events-none">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[#D6BD98] border border-white/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>صورة معبرة للصلاة المختارة</span>
              </span>
              <span className="text-xs font-serif font-semibold text-stone-200/90 hidden sm:inline">
                {activeVisual.spiritualQuote}
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#FDFCF8]">
                {editingAlertId ? 'تعديل التنبيه المختار:' : 'إضافة تنبيه جديد:'} {activeVisual.nameAr}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light mt-0.5 max-w-xl">
                {activeVisual.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAlert} className="p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Prayer Dropdown Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                ١. اختر الصلاة من القائمة المنسدلة: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedPrayer}
                  onChange={(e) => {
                    const val = e.target.value as PrayerKey | 'all';
                    setSelectedPrayer(val);
                    if (val === 'fajr') setLabel('الاستيقاظ لسنة الفجر والوضوء');
                    else if (val === 'dhuhr') setLabel('الاستعداد لصلاة الظهر وسنتها الراتبة');
                    else if (val === 'asr') setLabel('الاستعداد لصلاة العصر والتأهب');
                    else if (val === 'maghrib') setLabel('الدعاء المستجاب قبل المغرب وسنته');
                    else if (val === 'isha') setLabel('الاستعداد لصلاة العشاء والوتر');
                    else if (val === 'jumuah') setLabel('التبكير لصلاة الجمعة وقراءة الكهف');
                    else if (val === 'qiyam') setLabel('الاستيقاظ لقيام الليل والوتر');
                    else setLabel('الاستعداد والوضوء قبل دخول وقت الصلاة');
                  }}
                  className="w-full appearance-none bg-[#F7F5F0] border-2 border-[#D6BD98]/60 focus:border-[#1A3636] rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none transition-colors cursor-pointer pl-10 shadow-2xs"
                >
                  {PRAYER_DROPDOWN_KEYS.map((key) => {
                    const vis = PRAYER_VISUALS[key];
                    return (
                      <option key={key} value={key}>
                        {vis.nameAr} - ({vis.description})
                      </option>
                    );
                  })}
                </select>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-stone-500">
                يمكنك اختيار صلاة محددة أو اختيار "جميع الصلوات الخمس" لتطبيق التنبيه عليها معاً.
              </p>
            </div>

            {/* 2. Custom Duration Input (يكتبها على مزاجه بحرية تامة دون فرض خيارات) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                ٢. اكتب المدة قبل الأذان بالدقائق (على مزاجك): <span className="text-rose-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="300"
                  required
                  value={minutesBefore}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setMinutesBefore(isNaN(val) ? 0 : val);
                  }}
                  placeholder="اكتب عدد الدقائق بحرية (مثال: 7، 12، 25، 40...)"
                  className="w-full bg-[#F7F5F0] border-2 border-[#D6BD98]/80 focus:border-[#1A3636] rounded-2xl px-4 py-3 text-base font-bold font-mono text-stone-900 focus:outline-none transition-colors text-center shadow-2xs placeholder:text-stone-400 placeholder:text-xs"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1A3636] bg-[#D6BD98]/30 px-2 py-0.5 rounded-lg font-sans">
                  دقيقة قبل الأذان
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-amber-50/70 border border-amber-200/70 p-2 rounded-xl">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  اكتب أي عدد تريده من الدقائق حسب رغبتك، وسيتم تنبيهك في الوقت الدقيق الذي حددته.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-stone-100">
            {/* 3. Custom Audio From Phone (اختيار التنبيه من الهاتف) */}
            <div className="space-y-2 bg-[#F7F5F0] p-4 rounded-2xl border border-stone-200/90">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1A3636] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#D6BD98]" />
                  <span>٣. صوت / نغمة التنبيه من هاتفك:</span>
                </label>
                {customAudioUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAudioUrl(undefined);
                      setCustomAudioName(undefined);
                      triggerToast('تمت إزالة صوت الهاتف والرجوع للنغمات الأساسية');
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-rose-200"
                  >
                    <X className="w-3 h-3" />
                    <span>إزالة</span>
                  </button>
                )}
              </div>

              {customAudioUrl ? (
                <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {customAudioName || 'ملف صوتي من الهاتف'}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        تم تعيينه بنجاح لصوت هذا التنبيه
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTestPlay(customAudioUrl, undefined, 'form')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        playingAudioId === 'form'
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {playingAudioId === 'form' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{playingAudioId === 'form' ? 'إيقاف' : 'تجربة'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      تغيير
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1A3636] hover:bg-[#254949] text-[#D6BD98] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>📱 اختر ملف صوت التنبيه من ذاكرة هاتفك</span>
                  </button>

                  {/* Fallback Built-in tone option */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-600 shrink-0">أو نغمة جاهزة:</span>
                    <select
                      value={soundType}
                      onChange={(e) => setSoundType(e.target.value as AlertSoundType)}
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none"
                    >
                      {ALERT_SOUND_OPTIONS.map((snd) => (
                        <option key={snd.id} value={snd.id}>
                          {snd.nameAr}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleTestPlay(undefined, soundType, 'form_builtin')}
                      className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors"
                      title="تجربة النغمة الجاهزة"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Alert Title / Custom Label */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                ٤. نص أو عنوان التنبيه:
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="مثال: الاستيقاظ لصلاة الفجر وقراءة أذكار الصباح"
                className="w-full bg-[#F7F5F0] border border-stone-200 focus:border-[#1A3636] rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none transition-colors shadow-2xs"
              />
              <p className="text-[11px] text-stone-500">
                النص الذي سيظهر على شاشة هاتفك عند حلول موعد التنبيه.
              </p>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vibrate}
                  onChange={(e) => setVibrate(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1A3636] focus:ring-0 cursor-pointer"
                />
                <span>تفعيل الاهتزاز في الهاتف</span>
              </label>

              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-stone-500" />
                <span>مستوى الصوت: {Math.round(volume * 100)}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {editingAlertId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  إلغاء
                </button>
              )}

              <button
                type="submit"
                className="flex-1 sm:flex-none px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#1A3636] to-[#254949] hover:from-[#254949] hover:to-[#1A3636] text-[#D6BD98] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {editingAlertId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{editingAlertId ? 'حفظ التعديلات' : 'إضافة التنبيه إلى القائمة'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SECTION 2: LIST OF CONFIGURED ALERTS WITH SPIRITUAL IMAGES & PHONE AUDIO */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-serif font-bold text-[#1A3636]">
              قائمة التنبيهات المضافة ({alerts.length} تنبيه)
            </h3>
            <span className="text-xs text-stone-500">
              ({alerts.filter(a => a.enabled).length} مفعل)
            </span>
          </div>

          {/* Filter by prayer */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {PRAYER_DROPDOWN_KEYS.map((key) => {
              const vis = PRAYER_VISUALS[key];
              const countForOpt = key === 'all' 
                ? alerts.length 
                : alerts.filter(a => a.prayer === key).length;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilterPrayer(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shadow-2xs ${
                    activeFilterPrayer === key
                      ? 'bg-[#1A3636] text-[#D6BD98] border-[#1A3636]'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200/80'
                  }`}
                >
                  <span>{vis.shortName}</span>
                  <span className="mr-1 text-[10px] opacity-75 font-mono">({countForOpt})</span>
                </button>
              );
            })}
          </div>
        </div>

        {displayedAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200/90 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-700">لا توجد تنبيهات مضافة لهذا الفلتر</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              استخدم النموذج أعلاه لاختيار الصلاة وتحديد الدقائق بحرية واختيار صوت التنبيه من هاتفك.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedAlerts.map((alert) => {
              const visual = PRAYER_VISUALS[alert.prayer] || PRAYER_VISUALS.fajr;
              const soundDef = ALERT_SOUND_OPTIONS.find(s => s.id === alert.soundType);
              const hasPhoneAudio = Boolean(alert.customAudioUrl);
              const isThisPlaying = playingAudioId === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between shadow-sm ${
                    alert.enabled
                      ? 'bg-white border-stone-200/90 hover:border-[#1A3636]/40 hover:shadow-md'
                      : 'bg-stone-50/70 border-stone-200/60 opacity-65'
                  }`}
                >
                  {/* Hidden file input for this card */}
                  <input
                    type="file"
                    ref={(el) => { cardFileInputRefs.current[alert.id] = el; }}
                    onChange={(e) => handleCardPhoneAudioUpload(e, alert.id)}
                    accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac,.webm"
                    className="hidden"
                  />

                  {/* Top Image Banner for this prayer */}
                  <div className="relative h-24 w-full overflow-hidden bg-stone-900">
                    <img
                      src={visual.imageUrl}
                      alt={visual.nameAr}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${visual.colorAccent} via-stone-950/50 to-transparent`} />

                    <div className="absolute inset-0 p-3.5 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md text-[#FDFCF8] border border-white/20">
                          {visual.shortName}
                        </span>
                        <span className="text-xs font-bold text-[#D6BD98] bg-black/40 backdrop-blur-md border border-[#D6BD98]/40 px-2.5 py-0.5 rounded-lg font-mono">
                          قبل {alert.minutesBefore} دقيقة
                        </span>
                      </div>

                      {/* On / Off Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={alert.enabled}
                          onChange={() => handleToggleAlert(alert.id)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5.5 bg-stone-400/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {alert.label}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {visual.subtitle}
                      </p>
                    </div>

                    {/* Sound status pill / Phone audio indicator */}
                    <div className="p-2.5 rounded-xl bg-[#F7F5F0] border border-stone-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {hasPhoneAudio ? (
                          <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <Smartphone className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                            <Volume2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="font-semibold text-stone-800 truncate">
                          {hasPhoneAudio ? `صوت من الهاتف: ${alert.customAudioName || 'ملف صوتي'}` : (soundDef?.nameAr || 'نغمة التنبيه')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => cardFileInputRefs.current[alert.id]?.click()}
                        className="text-[10px] font-bold text-[#1A3636] bg-white px-2 py-1 rounded-md border border-stone-300 hover:bg-stone-100 transition-colors shrink-0"
                      >
                        {hasPhoneAudio ? 'تغيير الصوت' : 'رفع من الهاتف'}
                      </button>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <button
                        type="button"
                        onClick={() => handleTestPlay(alert.customAudioUrl, alert.soundType, alert.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all font-bold ${
                          isThisPlaying
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isThisPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                        <span>{isThisPlaying ? 'إيقاف الصوت' : 'تجربة الصوت'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateAlert(alert)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="تكرار هذا التنبيه"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(alert)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1A3636] transition-colors"
                          title="تعديل التنبيه"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAlert(alert)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
