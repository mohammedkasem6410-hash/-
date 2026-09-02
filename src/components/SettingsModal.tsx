import React, { useState, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Sliders, 
  Bell, 
  Video, 
  HeartHandshake, 
  Plus, 
  Trash2, 
  Volume2, 
  Play, 
  Upload, 
  Compass, 
  Check, 
  Search, 
  Sun, 
  Moon, 
  Calendar,
  AlertCircle,
  FileVideo,
  Globe,
  Music,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Smartphone
} from 'lucide-react';
import { 
  AppSettings, 
  ApproachingAlertItem, 
  CalculationMethodKey, 
  CityInfo, 
  Language, 
  MadhabKey, 
  PrayerKey 
} from '../types';
import { CALCULATION_METHODS, POPULAR_CITIES } from '../utils/citiesDatabase';
import { MUAZZIN_PRESETS, soundEngine } from '../utils/audioSynthesizer';
import { saveMediaToDB, deleteMediaFromDB } from '../utils/mediaStorage';
import { AlertsTabSection } from './AlertsTabSection';
import { AdhanTabSection } from './AdhanTabSection';
import { TRANSLATIONS } from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  initialTab?: number;
  initialPrayerKey?: PrayerKey;
  onPlayAdhan: (prayerKey: PrayerKey) => void;
}

const PRAYER_NAMES: { key: PrayerKey; nameAr: string; hasFajrSpecial?: boolean }[] = [
  { key: 'fajr', nameAr: 'صلاة الفجر', hasFajrSpecial: true },
  { key: 'dhuhr', nameAr: 'صلاة الظهر' },
  { key: 'asr', nameAr: 'صلاة العصر' },
  { key: 'maghrib', nameAr: 'صلاة المغرب' },
  { key: 'isha', nameAr: 'صلاة العشاء' },
  { key: 'jumuah', nameAr: 'صلاة الجمعة' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  initialTab = 0,
  initialPrayerKey = 'fajr',
  onPlayAdhan,
}) => {
  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [selectedPrayerForConfig, setSelectedPrayerForConfig] = useState<PrayerKey>(initialPrayerKey);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isTestingMusaharati, setIsTestingMusaharati] = useState(false);
  
  const musaharatiAudioRef = useRef<HTMLAudioElement | null>(null);
  const musaharatiFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentLang = settings.language || 'ar';
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ar;

  const updateSettings = (partial: Partial<AppSettings>) => {
    onSaveSettings({
      ...settings,
      ...partial,
    });
  };

  const updateOffset = (key: keyof AppSettings['manualOffsets'], delta: number) => {
    const current = settings.manualOffsets[key] || 0;
    const nextVal = Math.max(-30, Math.min(30, current + delta));
    updateSettings({
      manualOffsets: {
        ...settings.manualOffsets,
        [key]: nextVal,
      },
    });
  };

  const handleResetOffsets = () => {
    updateSettings({
      manualOffsets: {
        fajr: 0,
        sunrise: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      },
    });
  };

  // GPS Auto-detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('خدمة تحديد الموقع الجغرافي غير مدعومة في متصفحك');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGPS(false);
        const { latitude, longitude } = pos.coords;
        const customCity: CityInfo = {
          id: `gps-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
          nameAr: 'موقعي الحالي (GPS)',
          nameEn: 'My Current Location (GPS)',
          nameFr: 'Ma Position Actuelle (GPS)',
          countryAr: 'إحداثيات تلقائية فائقة الدقة',
          countryEn: 'Auto GPS Coordinates',
          countryFr: 'Coordonnées GPS Automatiques',
          countryCode: 'GPS',
          lat: latitude,
          lng: longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          recommendedMethod: settings.method,
          isCustom: true,
        };
        updateSettings({ city: customCity });
      },
      (err) => {
        setIsLocatingGPS(false);
        alert(`تعذر تحديد الموقع الجغرافي: ${err.message}. يمكنك اختيار مدينتك من القائمة.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Musaharati file upload from phone
  const handleMusaharatiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus('جاري حفظ ملف المسحراتي في هاتفك...');
      const mediaId = `musaharati_custom_${Date.now()}`;
      const isVideo = file.type.startsWith('video');
      const objectUrl = await saveMediaToDB(mediaId, file.name, isVideo ? 'video' : 'audio', file);

      updateSettings({
        musaharati: {
          ...settings.musaharati,
          soundSource: 'custom_phone',
          customMediaUrl: objectUrl,
          customMediaName: file.name,
          customMediaType: isVideo ? 'video' : 'audio',
        },
      });
      setUploadStatus('تم حفظ وتعيين صوت/فيديو المسحراتي بنجاح!');
      setTimeout(() => setUploadStatus(null), 3500);
    } catch (err) {
      console.error(err);
      setUploadStatus('حدث خطأ أثناء تحميل الملف.');
    }
  };

  // Test Musaharati
  const handleTestMusaharati = () => {
    if (isTestingMusaharati) {
      if (musaharatiAudioRef.current) {
        musaharatiAudioRef.current.pause();
      }
      setIsTestingMusaharati(false);
      return;
    }

    setIsTestingMusaharati(true);
    if (settings.musaharati?.customMediaUrl) {
      const audio = new Audio(settings.musaharati.customMediaUrl);
      musaharatiAudioRef.current = audio;
      audio.volume = settings.musaharati.volume ?? 0.85;
      audio.play().catch((e) => console.log(e));
      audio.onended = () => setIsTestingMusaharati(false);
    } else {
      soundEngine.playTakbeerTone(settings.musaharati?.volume ?? 0.85);
      setTimeout(() => {
        soundEngine.playGentleBell(settings.musaharati?.volume ?? 0.7);
        setIsTestingMusaharati(false);
      }, 3000);
    }
  };

  const filteredCities = POPULAR_CITIES.filter((c) => 
    c.nameAr.includes(citySearchQuery) ||
    c.countryAr.includes(citySearchQuery) ||
    c.nameEn.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.countryEn.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-4xl bg-[#142323] border border-[#D6BD98]/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-stone-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D6BD98]/20 border border-[#D6BD98]/30 flex items-center justify-center text-[#D6BD98]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t.settings}</span>
                <span className="text-xs font-normal text-[#D6BD98] bg-[#1A3636] px-2 py-0.5 rounded-full border border-[#D6BD98]/30">
                  {t.appName}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                {currentLang === 'ar'
                  ? 'تحكم شامل ودقيق في اللغة والموقع والتنبيهات وفيديو الأذان والمسحراتي'
                  : 'Comprehensive settings for language, location, alerts, adhan & musaharati'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar (5 Main Tabs) */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-3 overflow-x-auto gap-1">
          {/* Tab 0: Language */}
          <button
            onClick={() => setActiveTab(0)}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 0
                ? 'border-[#D6BD98] text-[#D6BD98] bg-[#D6BD98]/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>1. {t.tabLanguage}</span>
          </button>

          {/* Tab 1: Location & Calculation */}
          <button
            onClick={() => setActiveTab(1)}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 1
                ? 'border-[#D6BD98] text-[#D6BD98] bg-[#D6BD98]/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>2. {t.tabLocationCalc}</span>
          </button>

          {/* Tab 2: Pre-Prayer Alerts */}
          <button
            onClick={() => setActiveTab(2)}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 2
                ? 'border-[#D6BD98] text-[#D6BD98] bg-[#D6BD98]/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>3. {t.tabAlerts}</span>
            <span className="px-1.5 py-0.2 bg-stone-800 text-amber-300 text-[10px] rounded-full">
              {settings.approachingAlerts.filter(a => a.enabled).length}
            </span>
          </button>

          {/* Tab 3: Adhan */}
          <button
            onClick={() => setActiveTab(3)}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 3
                ? 'border-[#D6BD98] text-[#D6BD98] bg-[#D6BD98]/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Video className="w-4 h-4 text-purple-400" />
            <span>4. {t.tabAdhan}</span>
          </button>

          {/* Tab 4: Musaharati - Ramadan */}
          <button
            onClick={() => setActiveTab(4)}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 4
                ? 'border-[#D6BD98] text-[#D6BD98] bg-[#D6BD98]/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-400" />
            <span>5. {t.tabMusaharati}</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ======================================================== */}
          {/* TAB 0: اللغة (Language Selection) */}
          {/* ======================================================== */}
          {activeTab === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#D6BD98]" />
                    {t.selectLanguage}
                  </label>
                  <span className="text-xs text-stone-400 font-mono">
                    {currentLang === 'ar' ? 'العربية' : currentLang === 'en' ? 'English' : 'Français'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'ar' as const, label: 'العربية', sub: 'Arabic', flag: '🇸🇦', isRtl: true },
                    { key: 'en' as const, label: 'English', sub: 'الإنجليزية', flag: '🇬🇧', isRtl: false },
                    { key: 'fr' as const, label: 'Français', sub: 'الفرنسية', flag: '🇫🇷', isRtl: false },
                  ].map((langItem) => {
                    const isSelected = currentLang === langItem.key;
                    return (
                      <div
                        key={langItem.key}
                        onClick={() => updateSettings({ language: langItem.key })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#1A3636] border-[#D6BD98] shadow-lg text-white'
                            : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{langItem.flag}</span>
                          {isSelected && (
                            <span className="w-6 h-6 rounded-full bg-[#D6BD98] text-[#1A3636] flex items-center justify-center font-bold text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{langItem.label}</p>
                          <p className="text-xs text-stone-400">{langItem.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Display & Time Format Preferences */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold text-[#D6BD98] uppercase tracking-wider">
                  خيارات العرض والساعة
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 24 Hour format */}
                  <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">نظام 24 ساعة</span>
                      <span className="text-[11px] text-stone-400">مثال: 18:30 بدلاً من 6:30 م</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.twentyFourHourFormat}
                      onChange={(e) => updateSettings({ twentyFourHourFormat: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Auto silent during prayer */}
                  <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">كتم التنبيهات أثناء الصلاة</span>
                      <span className="text-[11px] text-stone-400">إسكات الإشعارات لمدة 20 دقيقة بعد الأذان</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoSilentDuringPrayer}
                      onChange={(e) => updateSettings({ autoSilentDuringPrayer: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: المكان والحساب (Location, Calculation & Offsets) */}
          {/* ======================================================== */}
          {activeTab === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* City Selection & GPS */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {t.locationSelection}
                  </label>
                  <button
                    onClick={handleDetectGPS}
                    disabled={isLocatingGPS}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <Compass className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin' : ''}`} />
                    <span>{isLocatingGPS ? t.locatingGps : t.useGpsButton}</span>
                  </button>
                </div>

                {/* Current Active Location Banner */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-300 text-sm">
                      {settings.city.nameAr} - {settings.city.countryAr}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      خط العرض: {settings.city.lat.toFixed(4)} | خط الطول: {settings.city.lng.toFixed(4)} | النطاق: {settings.city.timezone}
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-emerald-500 text-stone-950 font-bold rounded-full">
                    محدد
                  </span>
                </div>

                {/* Search Cities */}
                <div className="relative pt-1">
                  <Search className="w-4 h-4 text-stone-400 absolute top-4.5 right-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    placeholder={t.searchCityPlaceholder}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D6BD98]"
                  />
                </div>

                {/* City Picker List */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {filteredCities.slice(0, 30).map((city) => {
                    const isSelected = settings.city.id === city.id;
                    const cityName = currentLang === 'ar' ? city.nameAr : city.nameEn;
                    const countryName = currentLang === 'ar' ? city.countryAr : city.countryEn;

                    return (
                      <div
                        key={city.id}
                        onClick={() => {
                          updateSettings({
                            city,
                            method: city.recommendedMethod || settings.method,
                          });
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-900/60 border border-emerald-500 text-white font-bold'
                            : 'bg-stone-900/40 hover:bg-stone-800 text-stone-300 border border-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#D6BD98]" />
                          <span>{cityName}</span>
                          <span className="text-stone-400 text-[11px]">({countryName})</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calculation Methods & Madhab */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-4">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#D6BD98]" />
                  {t.calculationMethodsTitle}
                </label>
                <p className="text-xs text-stone-400">
                  {t.calculationMethodsDesc}
                </p>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {CALCULATION_METHODS.map((method) => {
                    const isSelected = settings.method === method.key;
                    const methodName = currentLang === 'ar' ? method.nameAr : currentLang === 'fr' ? (method.nameFr || method.nameEn) : method.nameEn;
                    const methodDesc = method.description;

                    return (
                      <div
                        key={method.key}
                        onClick={() => updateSettings({ method: method.key as CalculationMethodKey })}
                        className={`p-3 rounded-xl cursor-pointer text-xs border transition-all ${
                          isSelected
                            ? 'bg-[#1A3636] border-[#D6BD98] text-white shadow-md'
                            : 'bg-stone-900/50 hover:bg-stone-800/60 border-stone-800 text-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#D6BD98]">{methodName}</span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#D6BD98] text-[#1A3636] flex items-center justify-center font-bold text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400">{methodDesc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Asr Madhab & DST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Madhab */}
                <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                  <label className="text-xs font-bold text-white block">
                    {t.asrSchoolTitle}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateSettings({ madhab: 'Shafi' })}
                      className={`p-3 rounded-xl text-xs font-bold border transition-colors ${
                        settings.madhab === 'Shafi'
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <span>الجمهور (الشافعي)</span>
                      <span className="block text-[10px] font-normal text-stone-300 mt-0.5">ظل الشيء مثله</span>
                    </button>
                    <button
                      onClick={() => updateSettings({ madhab: 'Hanafi' })}
                      className={`p-3 rounded-xl text-xs font-bold border transition-colors ${
                        settings.madhab === 'Hanafi'
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <span>الحنفي</span>
                      <span className="block text-[10px] font-normal text-stone-300 mt-0.5">ظل الشيء مثليه</span>
                    </button>
                  </div>
                </div>

                {/* DST Adjustment */}
                <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                  <label className="text-xs font-bold text-white block">
                    {t.daylightSavingTime}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateSettings({ dstOffsetHours: 0 })}
                      className={`p-3 rounded-xl text-xs font-bold border transition-colors ${
                        settings.dstOffsetHours === 0
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      التوقيت العادي (+0 س)
                    </button>
                    <button
                      onClick={() => updateSettings({ dstOffsetHours: 1 })}
                      className={`p-3 rounded-xl text-xs font-bold border transition-colors ${
                        settings.dstOffsetHours === 1
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      التوقيت الصيفي (+1 س)
                    </button>
                  </div>
                </div>
              </div>

              {/* Manual Offsets for Each Prayer */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      {t.manualOffsetsTitle}
                    </label>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {t.manualOffsetsDesc}
                    </p>
                  </div>

                  <button
                    onClick={handleResetOffsets}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.resetDefaultOffsets}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                  {[
                    { key: 'fajr' as const, name: 'الفجر' },
                    { key: 'sunrise' as const, name: 'الشروق' },
                    { key: 'dhuhr' as const, name: 'الظهر' },
                    { key: 'asr' as const, name: 'العصر' },
                    { key: 'maghrib' as const, name: 'المغرب' },
                    { key: 'isha' as const, name: 'العشاء' },
                  ].map((p) => {
                    const val = settings.manualOffsets[p.key] || 0;
                    return (
                      <div key={p.key} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-center">
                        <span className="text-xs font-bold text-stone-300 block mb-1.5">{p.name}</span>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => updateOffset(p.key, -1)}
                            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center border border-stone-700"
                          >
                            -
                          </button>
                          <span className={`w-10 font-bold font-mono text-xs ${val > 0 ? 'text-emerald-400' : val < 0 ? 'text-rose-400' : 'text-stone-400'}`}>
                            {val > 0 ? `+${val}` : val} د
                          </span>
                          <button
                            onClick={() => updateOffset(p.key, +1)}
                            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center border border-stone-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hijri Adjustment */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    {t.hijriOffsetTitle}
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {settings.hijriOffsetDays > 0 ? `+${settings.hijriOffsetDays}` : settings.hijriOffsetDays} يوم
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {[-2, -1, 0, 1, 2].map((offset) => (
                    <button
                      key={offset}
                      onClick={() => updateSettings({ hijriOffsetDays: offset })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        settings.hijriOffsetDays === offset
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      {offset === 0 ? 'افتراضي (0)' : offset > 0 ? `+${offset} يوم` : `${offset} يوم`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: التنبيهات المسبقة لكل صلاة (Alerts Tab Section) */}
          {/* ======================================================== */}
          {activeTab === 2 && (
            <div className="p-1 sm:p-2 animate-fade-in">
              <AlertsTabSection
                alerts={settings.approachingAlerts}
                onUpdateAlerts={(newAlerts) => updateSettings({ approachingAlerts: newAlerts })}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: صوت وفيديو الأذان لكل صلاة (Adhan Tab Section) */}
          {/* ======================================================== */}
          {activeTab === 3 && (
            <div className="p-1 sm:p-2 animate-fade-in">
              <AdhanTabSection
                settings={settings}
                onUpdateSettings={updateSettings}
                onPlayAdhan={onPlayAdhan}
                initialPrayerKey={selectedPrayerForConfig}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: المسحراتي — ليالي شهر رمضان المبارك */}
          {/* ======================================================== */}
          {activeTab === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-2xl flex items-start gap-3">
                <Moon className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">{t.musaharatiTitle}</h4>
                  <p className="text-xs text-amber-100/80 leading-relaxed mt-0.5">
                    {t.musaharatiDesc}
                  </p>
                </div>
              </div>

              {/* Musaharati Enable Toggle */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">{t.enableMusaharati}</span>
                    <span className="text-xs text-stone-400">إطلاق نداء السحور والطبول لإيقاظ الصائمين</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.musaharati?.enabled ?? true}
                    onChange={(e) => updateSettings({
                      musaharati: {
                        ...settings.musaharati,
                        enabled: e.target.checked,
                      },
                    })}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                {/* Timing configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                  {/* Mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#D6BD98] block">طريقة تحديد وقت المسحراتي:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer">
                        <input
                          type="radio"
                          name="musaharati_mode"
                          checked={settings.musaharati?.timingMode === 'relative_fajr'}
                          onChange={() => updateSettings({
                            musaharati: {
                              ...settings.musaharati,
                              timingMode: 'relative_fajr',
                            },
                          })}
                          className="accent-amber-500"
                        />
                        <span className="text-xs text-stone-200">قبل أذان الفجر بعدد دقائق محدد</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer">
                        <input
                          type="radio"
                          name="musaharati_mode"
                          checked={settings.musaharati?.timingMode === 'fixed_time'}
                          onChange={() => updateSettings({
                            musaharati: {
                              ...settings.musaharati,
                              timingMode: 'fixed_time',
                            },
                          })}
                          className="accent-amber-500"
                        />
                        <span className="text-xs text-stone-200">في ساعة ثابتة (مثل 03:00 ص)</span>
                      </label>
                    </div>
                  </div>

                  {/* Dynamic Input based on mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#D6BD98] block">تحديد الوقت بدقة:</label>
                    {settings.musaharati?.timingMode === 'relative_fajr' ? (
                      <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                        <span className="text-xs text-stone-400 block">عدد الدقائق قبل الفجر (اكتب بحرية):</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={10}
                            max={180}
                            value={settings.musaharati?.minutesBeforeFajr ?? 60}
                            onChange={(e) => {
                              const val = Math.max(5, parseInt(e.target.value, 10) || 60);
                              updateSettings({
                                musaharati: {
                                  ...settings.musaharati,
                                  minutesBeforeFajr: val,
                                },
                              });
                            }}
                            className="w-24 bg-stone-800 border border-stone-700 rounded-lg p-2 text-center text-sm font-bold text-white font-mono"
                          />
                          <span className="text-xs text-stone-300">دقيقة قبل الفجر</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                        <span className="text-xs text-stone-400 block">الساعة المحددة لانطلاق المسحراتي:</span>
                        <input
                          type="time"
                          value={settings.musaharati?.fixedTime ?? '03:00'}
                          onChange={(e) => updateSettings({
                            musaharati: {
                              ...settings.musaharati,
                              fixedTime: e.target.value,
                            },
                          })}
                          className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-center text-sm font-bold text-white font-mono w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sound Source */}
                <div className="space-y-3 pt-3 border-t border-stone-800">
                  <label className="text-xs font-bold text-[#D6BD98] block">صوت ونغمة المسحراتي:</label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Preset Option */}
                    <div
                      onClick={() => updateSettings({
                        musaharati: {
                          ...settings.musaharati,
                          soundSource: 'preset',
                          customMediaUrl: undefined,
                          customMediaName: undefined,
                        },
                      })}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        settings.musaharati?.soundSource === 'preset'
                          ? 'bg-amber-950/60 border-amber-500 text-white'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-amber-300 block">نداء المسحراتي التراثي</span>
                        <span className="text-[11px] text-stone-400">«يا نايم وحّد الدايم» مع الطبلة الشرقية</span>
                      </div>
                      {settings.musaharati?.soundSource === 'preset' && (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      )}
                    </div>

                    {/* Upload from Phone Option */}
                    <div
                      onClick={() => musaharatiFileInputRef.current?.click()}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        settings.musaharati?.soundSource === 'custom_phone'
                          ? 'bg-amber-950/60 border-amber-500 text-white'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-amber-300 block flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                          <span>اختيار ملف من الهاتف</span>
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {settings.musaharati?.customMediaName || 'صوت أو فيديو خاص من ذاكرة الجهاز'}
                        </span>
                      </div>
                      <Upload className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>

                  <input
                    ref={musaharatiFileInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleMusaharatiFileUpload}
                    className="hidden"
                  />

                  {uploadStatus && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-300 text-center">
                      {uploadStatus}
                    </div>
                  )}

                  {/* Test Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleTestMusaharati}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all flex items-center gap-2 shadow-md"
                    >
                      <Play className="w-4 h-4 text-stone-950 fill-current" />
                      <span>{isTestingMusaharati ? 'إيقاف التجربة' : t.testMusaharati}</span>
                    </button>

                    <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.musaharati?.onlyInRamadan ?? true}
                        onChange={(e) => updateSettings({
                          musaharati: {
                            ...settings.musaharati,
                            onlyInRamadan: e.target.checked,
                          },
                        })}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span>تشغيل التنبيه في شهر رمضان المبارك فقط</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between">
          <span className="text-xs text-emerald-400 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>يتم حفظ جميع الإعدادات وملفات الهاتف تلقائيًا على جهازك</span>
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
