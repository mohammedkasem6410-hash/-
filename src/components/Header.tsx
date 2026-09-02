import React from 'react';
import { 
  MapPin, 
  Settings, 
  Compass, 
  CalendarDays, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HeartHandshake, 
  Bell, 
  BellOff, 
  Clock, 
  Smartphone, 
  BookOpen,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { AppSettings, HijriDateInfo, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { TabView } from './BottomNavBar';

interface HeaderProps {
  settings: AppSettings;
  hijriDate: HijriDateInfo;
  currentTime: Date;
  activeView?: TabView;
  onChangeView?: (view: TabView) => void;
  onOpenSettings: (tabIndex?: number) => void;
  onOpenQibla: () => void;
  onOpenCalendar: () => void;
  onScrollToSalawat: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isPrayerSilentActive?: boolean;
  alertsCount?: number;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  hijriDate,
  currentTime,
  activeView = 'prayers',
  onChangeView,
  onOpenSettings,
  onOpenQibla,
  onOpenCalendar,
  onScrollToSalawat,
  isMuted,
  onToggleMute,
  isPrayerSilentActive = false,
  alertsCount = 0,
}) => {
  const lang: Language = settings.language || 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;
  const isRtl = lang === 'ar';

  const cityName = lang === 'ar' 
    ? settings.city.nameAr 
    : (lang === 'fr' && settings.city.nameFr ? settings.city.nameFr : settings.city.nameEn);
  const countryName = lang === 'ar' 
    ? settings.city.countryAr 
    : (lang === 'fr' && settings.city.countryFr ? settings.city.countryFr : settings.city.countryEn);

  return (
    <header 
      className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 sm:px-6 shadow-lg"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & City Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg border border-emerald-400/40 text-lg">
              🕌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  {t.appName}
                </h1>
                <span className="inline-flex px-2 py-0.5 text-[10px] font-black bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenSettings(1)}
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-emerald-300 transition mt-0.5 group"
                title={t.tabLocationCalc}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">{cityName} - {countryName}</span>
                <span className="text-[10px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded border border-white/10">
                  {lang === 'ar' ? 'تغيير' : 'Change'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Controls on Mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenSettings(0)}
              className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white"
              title={t.tabLanguage}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className={`p-2 rounded-xl border transition ${
                isMuted
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-white/10 border-white/10 text-white/80'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onOpenSettings(0)}
              className="p-2 rounded-xl bg-emerald-500 text-black font-bold shadow"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation Tabs */}
        {onChangeView && (
          <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => onChangeView('prayers')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeView === 'prayers'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{t.navPrayers}</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeView('alerts')}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeView === 'alerts'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{t.navAlerts}</span>
              {alertsCount > 0 && (
                <span className="w-4 h-4 bg-amber-400 text-black rounded-full text-[9px] font-black flex items-center justify-center font-mono">
                  {alertsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onChangeView('adhan')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeView === 'adhan'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.navAdhan}</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeView('adhkar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeView === 'adhkar'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.navAdhkar}</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeView('salawat')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeView === 'salawat'
                  ? 'bg-emerald-500 text-black shadow font-black'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t.navSalawat}</span>
            </button>
          </div>
        )}

        {/* Date & Action Controls */}
        <div className="flex items-center justify-between md:justify-end gap-2 text-xs">
          {isPrayerSilentActive && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-[11px] animate-pulse">
              <BellOff className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'صامت أثناء الصلاة' : 'Silent during Prayer'}</span>
            </div>
          )}

          {/* Qibla Button */}
          <button
            type="button"
            onClick={onOpenQibla}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
            title={t.navQibla}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline font-bold">{t.navQibla}</span>
          </button>

          {/* Calendar Button */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
            title={t.navCalendar}
          >
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline font-bold">{t.navCalendar}</span>
          </button>

          {/* Language Selector in Header */}
          <button
            type="button"
            onClick={() => onOpenSettings(0)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold transition"
            title={t.tabLanguage}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Global Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border transition ${
              isMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="font-bold">{lang === 'ar' ? 'مكتوم' : 'Muted'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">{lang === 'ar' ? 'الصوت' : 'Sound'}</span>
              </>
            )}
          </button>

          {/* Settings Main Button */}
          <button
            type="button"
            onClick={() => onOpenSettings(0)}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black shadow-lg shadow-emerald-500/20 transition"
          >
            <Settings className="w-4 h-4" />
            <span>{t.navSettings}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
