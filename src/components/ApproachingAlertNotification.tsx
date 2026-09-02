import React from 'react';
import { Bell, X, Volume2, Sparkles, Clock, Smartphone } from 'lucide-react';
import { ApproachingAlertItem } from '../types';
import { PRAYER_VISUALS } from '../data/prayerImages';

interface ApproachingAlertNotificationProps {
  alert: ApproachingAlertItem | null;
  prayerNameAr: string;
  onDismiss: () => void;
}

export const ApproachingAlertNotification: React.FC<ApproachingAlertNotificationProps> = ({
  alert,
  prayerNameAr,
  onDismiss,
}) => {
  if (!alert) return null;

  const isFixed = alert.timingType === 'fixed_time' && !!alert.fixedTime;
  const visual = PRAYER_VISUALS[alert.prayer] || PRAYER_VISUALS.fajr;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-md w-[calc(100%-3rem)] sm:w-96 bg-[#1A3636] text-[#FDFCF8] border border-[#D6BD98]/40 rounded-3xl overflow-hidden shadow-2xl shadow-stone-950/60 animate-bounce-short" dir="rtl">
      {/* Visual Image Header */}
      <div className="relative h-20 w-full overflow-hidden bg-stone-950">
        <img
          src={visual.imageUrl}
          alt={visual.nameAr}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3636] via-[#1A3636]/60 to-transparent" />
        
        <div className="absolute inset-0 p-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#D6BD98]/20 backdrop-blur-md border border-[#D6BD98]/30 text-[#D6BD98]">
              <Bell className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-[11px] font-bold text-[#D6BD98] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg border border-[#D6BD98]/30">
              {isFixed
                ? `تنبيه في تمام ${alert.fixedTime}`
                : `تنبيه مسبق (قبل بـ ${alert.minutesBefore} دقيقة)`}
            </span>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl bg-black/40 text-stone-300 hover:text-white hover:bg-black/60 transition-colors"
            title="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2 space-y-2">
        <div>
          <h4 className="text-sm font-extrabold text-white flex items-center justify-between">
            <span>{prayerNameAr || visual.nameAr}</span>
            {alert.customAudioUrl && (
              <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                <span>صوت من هاتفك</span>
              </span>
            )}
          </h4>
          <p className="text-xs text-[#FDFCF8]/90 mt-1 leading-relaxed">
            {alert.label || 'حان وقت الاستعداد والوضوء وأداء السنن'}
          </p>
        </div>

        <p className="text-[11px] text-stone-300 font-serif italic border-t border-white/10 pt-2">
          {visual.spiritualQuote}
        </p>
      </div>
    </div>
  );
};
