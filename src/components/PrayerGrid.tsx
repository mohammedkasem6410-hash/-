import React from 'react';
import { 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Play, 
  Bell, 
  Video, 
  Volume2, 
  VolumeX, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { AppSettings, Language, PrayerKey, PrayerTimeItem } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface PrayerGridProps {
  prayers: PrayerTimeItem[];
  settings: AppSettings;
  onPlayAdhan: (prayerKey: PrayerKey) => void;
  onOpenSettings: (tabIndex?: number, prayerKey?: PrayerKey) => void;
}

export const PrayerGrid: React.FC<PrayerGridProps> = ({
  prayers,
  settings,
  onPlayAdhan,
  onOpenSettings,
}) => {
  const lang: Language = settings.language || 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;
  const isRtl = lang === 'ar';

  const getPrayerIcon = (key: PrayerKey) => {
    switch (key) {
      case 'fajr':
        return <Moon className="w-5 h-5 text-amber-300" />;
      case 'sunrise':
        return <Sunrise className="w-5 h-5 text-amber-300" />;
      case 'dhuhr':
      case 'jumuah':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'asr':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'maghrib':
        return <Sunset className="w-5 h-5 text-amber-300" />;
      case 'isha':
        return <Moon className="w-5 h-5 text-amber-300" />;
      default:
        return <Sun className="w-5 h-5 text-amber-300" />;
    }
  };

  const getPrayerDescription = (key: PrayerKey) => {
    if (lang === 'ar') {
      switch (key) {
        case 'fajr':
          return 'ركعتا سنة الفجر خير من الدنيا وما فيها';
        case 'sunrise':
          return 'شروق الشمس ونهاية وقت الفجر';
        case 'dhuhr':
          return 'أول صلاة صلاها النبي ﷺ مع جبريل';
        case 'jumuah':
          return 'خير يوم طلعت عليه الشمس فيه ساعة استجابة';
        case 'asr':
          return 'الصلاة الوسطى - حافظوا عليها';
        case 'maghrib':
          return 'وقت استجابة الدعاء عند الإفطار';
        case 'isha':
          return 'صلاة العشاء ثم الوتر وقيام الليل';
        default:
          return '';
      }
    } else if (lang === 'fr') {
      switch (key) {
        case 'fajr':
          return 'Deux unités de prière avant le Fajr';
        case 'sunrise':
          return 'Lever du soleil';
        case 'dhuhr':
          return 'Prière de midi';
        case 'jumuah':
          return 'Prière du Vendredi béni';
        case 'asr':
          return 'Prière médiane';
        case 'maghrib':
          return 'Prière du coucher de soleil';
        case 'isha':
          return 'Prière de la nuit et Witr';
        default:
          return '';
      }
    } else {
      switch (key) {
        case 'fajr':
          return 'Two Sunnah units of Fajr are better than the world';
        case 'sunrise':
          return 'Sunrise and end of Fajr time';
        case 'dhuhr':
          return 'Midday prayer';
        case 'jumuah':
          return 'Blessed Friday congregation prayer';
        case 'asr':
          return 'The middle prayer';
        case 'maghrib':
          return 'Sunset prayer and time for Dua';
        case 'isha':
          return 'Night prayer followed by Witr';
        default:
          return '';
      }
    }
  };

  return (
    <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>{t.digitalMosqueClock}</span>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {lang === 'ar' ? 'أوقات الصلوات الخمس' : 'Daily 5 Prayers'}
            </span>
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            {t.alertsDesc}
          </p>
        </div>

        <button
          onClick={() => onOpenSettings(2)}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 rounded-xl border border-emerald-500/30 shadow-xs transition"
        >
          <Bell className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold">{t.tabAlerts}</span>
        </button>
      </div>

      {/* Electronic Board Prayer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayers.map((prayer) => {
          const prayerKey = prayer.key === 'jumuah' ? 'jumuah' : prayer.key;
          const adhanCfg = settings.adhanConfig[prayerKey];
          const isEnabled = adhanCfg?.enabled ?? true;
          const isVideo = adhanCfg?.type === 'video';

          // Get alerts for this prayer
          const prayerAlerts = (settings.approachingAlerts || []).filter(
            (a) => (a.prayer === prayer.key || (prayer.key === 'jumuah' && a.prayer === 'jumuah') || (prayer.key === 'dhuhr' && a.prayer === 'dhuhr')) && a.enabled
          );

          // Manual offset for this prayer
          const offset = settings.manualOffsets[prayer.key as keyof typeof settings.manualOffsets] || 0;

          return (
            <div
              key={prayer.key}
              className={`relative overflow-hidden rounded-2xl p-4.5 border transition-all ${
                prayer.isNext
                  ? 'bg-neutral-900 border-2 border-amber-400 shadow-xl shadow-amber-500/10'
                  : prayer.isCurrent
                  ? 'bg-neutral-900/90 border-2 border-emerald-500 shadow-md'
                  : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/10 shadow-xs'
              }`}
            >
              {/* Top Row: Icon, Name & Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    prayer.isNext
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-black/40 border-white/10 text-emerald-400'
                  }`}>
                    {getPrayerIcon(prayer.key)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {prayer.name}
                      </h4>
                      {prayer.key === 'jumuah' && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30">
                          {t.prayers.jumuah}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/50 block">
                      {getPrayerDescription(prayer.key)}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  {prayer.isNext ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-black shadow-sm">
                      <Sparkles className="w-3 h-3 text-black" />
                      {t.nextPrayer}
                    </span>
                  ) : prayer.isCurrent ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {t.currentPrayer}
                    </span>
                  ) : prayer.isPassed ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-white/40 bg-white/5">
                      {lang === 'ar' ? 'مضت' : 'Passed'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-white/60 bg-white/5">
                      {lang === 'ar' ? 'لاحقاً' : 'Upcoming'}
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Row: Exact Calculated Time & Offsets (Digital Mosque Clock Display) */}
              <div className="flex items-baseline justify-between bg-black/50 px-3.5 py-2.5 rounded-xl border border-white/10 mb-3">
                <span className="text-xs text-white/60 font-semibold">{lang === 'ar' ? 'الوقت المحدد:' : 'Calculated Time:'}</span>
                <div className="flex items-center gap-2">
                  {offset !== 0 && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      offset > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {offset > 0 ? `+${offset}` : offset} {t.minutesShort}
                    </span>
                  )}
                  <span className="text-2xl font-black font-mono text-white tracking-wider">
                    {prayer.formattedTime}
                  </span>
                </div>
              </div>

              {/* Approaching Alerts Attached */}
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-1.5 text-white/70">
                  <Bell className={`w-3.5 h-3.5 ${prayerAlerts.length > 0 ? 'text-amber-400' : 'text-white/30'}`} />
                  {prayerAlerts.length > 0 ? (
                    <span className="text-amber-300 font-bold">
                      {prayerAlerts.length} {lang === 'ar' ? 'تنبيهات' : 'alerts'} ({prayerAlerts.map(a => `${a.minutesBefore}m`).join(', ')})
                    </span>
                  ) : (
                    <span className="text-white/40">{t.noAlertsFound}</span>
                  )}
                </div>

                <button
                  onClick={() => onOpenSettings(2, prayer.key)}
                  className="text-[11px] text-emerald-400 hover:underline font-bold"
                >
                  {prayerAlerts.length > 0 ? (lang === 'ar' ? 'تعديل' : 'Edit') : `+ ${t.addAlert}`}
                </button>
              </div>

              {/* Action Buttons: Play Adhan & Configure */}
              {prayer.key !== 'sunrise' && (
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onPlayAdhan(prayer.key)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition group"
                    title={`تشغيل أذان ${prayer.name}`}
                  >
                    {isVideo ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>{t.adhanTypeVideo}</span>
                      </>
                    ) : isEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>{t.adhanTypeAudio}</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-white/40">{t.disabled}</span>
                      </>
                    )}
                    <Play className="w-3 h-3 text-amber-400 fill-current ms-auto" />
                  </button>

                  <button
                    onClick={() => onOpenSettings(3, prayer.key)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 transition"
                    title={t.adhanTitle}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
