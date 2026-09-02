import React, { useMemo } from 'react';
import { 
  Clock, 
  Play, 
  Bell, 
  Sparkles, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Video, 
  Volume2,
  Sliders,
  MapPin,
  Flame,
  Radio
} from 'lucide-react';
import { AppSettings, HijriDateInfo, Language, PrayerKey, PrayerTimeItem } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatTimeDisplay } from '../utils/prayerEngine';

interface HeroPrayerCardProps {
  nextPrayer: PrayerTimeItem | null;
  currentPrayer: PrayerTimeItem | null;
  settings: AppSettings;
  currentTime: Date;
  hijriDate: HijriDateInfo;
  qiyamTime: Date;
  midnightTime: Date;
  suhoorTime: Date;
  duhaTime: Date;
  onOpenSettings: (tabIndex?: number) => void;
  onPlayAdhan: (prayerKey: PrayerKey) => void;
}

export const HeroPrayerCard: React.FC<HeroPrayerCardProps> = ({
  nextPrayer,
  currentPrayer,
  settings,
  currentTime,
  hijriDate,
  qiyamTime,
  midnightTime,
  suhoorTime,
  duhaTime,
  onOpenSettings,
  onPlayAdhan,
}) => {
  const lang: Language = settings.language || 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;
  const isRtl = lang === 'ar';

  // Calculate remaining countdown
  const countdown = useMemo(() => {
    if (!nextPrayer) return { hours: '00', minutes: '00', seconds: '00', totalSeconds: 0 };
    const diff = Math.max(0, Math.floor((nextPrayer.time.getTime() - currentTime.getTime()) / 1000));
    const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(diff % 60).toString().padStart(2, '0');
    return { hours, minutes, seconds, totalSeconds: diff };
  }, [nextPrayer, currentTime]);

  const getPrayerIcon = (key?: PrayerKey) => {
    switch (key) {
      case 'fajr':
        return <Moon className="w-8 h-8 text-amber-300" />;
      case 'sunrise':
        return <Sunrise className="w-8 h-8 text-amber-300" />;
      case 'dhuhr':
      case 'jumuah':
        return <Sun className="w-8 h-8 text-amber-300" />;
      case 'asr':
        return <Sun className="w-8 h-8 text-amber-300" />;
      case 'maghrib':
        return <Sunset className="w-8 h-8 text-amber-300" />;
      case 'isha':
        return <Moon className="w-8 h-8 text-amber-300" />;
      default:
        return <Clock className="w-8 h-8 text-amber-300" />;
    }
  };

  const adhanCfg = nextPrayer ? settings.adhanConfig[nextPrayer.key === 'jumuah' ? 'jumuah' : nextPrayer.key] : null;
  const isVideoAdhan = adhanCfg?.type === 'video';

  const upcomingAlerts = (settings.approachingAlerts || []).filter(
    (a) => a.enabled && nextPrayer && (a.prayer === nextPrayer.key || (nextPrayer.key === 'jumuah' && a.prayer === 'jumuah') || (nextPrayer.key === 'dhuhr' && a.prayer === 'dhuhr'))
  );

  const gregorianFormatted = new Intl.DateTimeFormat(
    lang === 'ar' ? 'ar-EG' : (lang === 'fr' ? 'fr-FR' : 'en-US'),
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  ).format(currentTime);

  const cityName = lang === 'ar' 
    ? settings.city.nameAr 
    : (lang === 'fr' && settings.city.nameFr ? settings.city.nameFr : settings.city.nameEn);
  const countryName = lang === 'ar' 
    ? settings.city.countryAr 
    : (lang === 'fr' && settings.city.countryFr ? settings.city.countryFr : settings.city.countryEn);

  return (
    <div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white border border-emerald-500/30 p-5 sm:p-8 shadow-2xl shadow-emerald-950/50"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Electronic Mosque Clock Glowing Border & Accents */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 opacity-80" />
      <div className="absolute -top-24 end-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 start-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Bar: Dates & Location */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
        {/* Dates */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{hijriDate.formatted}</span>
          </div>

          <span className="text-xs text-white/50 font-medium">
            {gregorianFormatted}
          </span>
        </div>

        {/* Location & GPS Badge */}
        <div 
          onClick={() => onOpenSettings(1)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer transition"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{cityName}, {countryName}</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left/Main Column: Mosque Clock Next Prayer & Live Countdown */}
        <div className="flex-1 w-full text-center lg:text-start">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse">
              <Radio className="w-3 h-3 text-amber-400" />
              {t.nextPrayer}
            </span>

            {currentPrayer && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-white/70 border border-white/10">
                {t.currentPrayer}: {currentPrayer.name}
              </span>
            )}

            {isVideoAdhan ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/20">
                <Video className="w-3.5 h-3.5 text-purple-400" />
                {t.adhanTypeVideo}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                {t.adhanTypeAudio}
              </span>
            )}
          </div>

          {/* Next Prayer Title & Big Time */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-amber-400/30 shadow-lg text-amber-300">
              {getPrayerIcon(nextPrayer?.key)}
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {nextPrayer?.name || t.prayers.fajr}
              </h2>
              <p className="text-amber-300 text-lg sm:text-xl font-bold font-mono mt-0.5">
                {nextPrayer?.formattedTime}
              </p>
            </div>
          </div>

          {/* Electronic Clock Countdown Display */}
          <div className="space-y-1.5 my-4">
            <span className="text-[11px] font-bold text-white/60 block text-center lg:text-start">
              {t.timeRemaining}
            </span>
            <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5" dir="ltr">
              {/* Hours */}
              <div className="flex flex-col items-center bg-black/60 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-white/10 shadow-inner min-w-[70px] sm:min-w-[85px]">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wider">
                  {countdown.hours}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-white/50 mt-0.5">{t.hoursShort}</span>
              </div>

              <span className="text-2xl font-bold text-amber-400/60 pb-3">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center bg-black/60 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-white/10 shadow-inner min-w-[70px] sm:min-w-[85px]">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wider">
                  {countdown.minutes}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-white/50 mt-0.5">{t.minutesShort}</span>
              </div>

              <span className="text-2xl font-bold text-amber-400/60 pb-3">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center bg-black/60 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-amber-400/40 shadow-inner min-w-[70px] sm:min-w-[85px]">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-wider">
                  {countdown.seconds}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-400/80 mt-0.5">{t.secondsShort}</span>
              </div>
            </div>
          </div>

          {/* Approaching Alerts summary for this prayer */}
          {upcomingAlerts.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs mt-2">
              <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                {lang === 'ar' 
                  ? `مفعّل ${upcomingAlerts.length} تنبيهات (${upcomingAlerts.map(a => `${a.minutesBefore} د`).join('، ')})`
                  : `${upcomingAlerts.length} alerts active (${upcomingAlerts.map(a => `${a.minutesBefore}m`).join(', ')})`}
              </span>
              <button
                onClick={() => onOpenSettings(2)}
                className="underline hover:text-white text-xs ms-1 font-bold"
              >
                {t.settings}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Actions & Extra Times (Mosque Board Sunnah Times) */}
        <div className="w-full lg:w-80 flex flex-col gap-3">
          {/* Main Adhan Test / Play Button */}
          {nextPrayer && (
            <button
              onClick={() => onPlayAdhan(nextPrayer.key)}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-black fill-current" />
              </div>
              <span>{t.previewAdhan} ({nextPrayer.name})</span>
            </button>
          )}

          {/* Quick Settings Calibration Button */}
          <button
            onClick={() => onOpenSettings(1)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.tabLocationCalc}</span>
          </button>

          {/* Sunnah & Nawafil Timetable Card (Mosque Electronic Board) */}
          <div className="bg-black/50 rounded-2xl p-3.5 border border-white/10 text-xs space-y-2.5">
            <div className="flex items-center justify-between font-bold text-white/90 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'الأوقات الإضافية وساعة المسجد' : 'Extra Sunnah Timetable'}
              </span>
              <span className="text-[10px] text-white/50">{cityName}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/60 mb-0.5">{t.extraTimes.suhoor}</div>
                <div className="font-bold text-amber-300 font-mono text-xs">
                  {formatTimeDisplay(suhoorTime, settings.twentyFourHourFormat, lang)}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/60 mb-0.5">{t.extraTimes.duha}</div>
                <div className="font-bold text-white font-mono text-xs">
                  {formatTimeDisplay(duhaTime, settings.twentyFourHourFormat, lang)}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/60 mb-0.5">{t.extraTimes.qiyam}</div>
                <div className="font-bold text-emerald-400 font-mono text-xs">
                  {formatTimeDisplay(qiyamTime, settings.twentyFourHourFormat, lang)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
