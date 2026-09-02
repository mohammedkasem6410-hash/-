import React from 'react';
import { 
  Clock, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Settings,
  HeartHandshake,
  Bell,
  Smartphone,
  Moon
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

export type TabView = 'prayers' | 'alerts' | 'adhan' | 'adhkar' | 'salawat';

interface BottomNavBarProps {
  activeView: TabView;
  onChangeView: (view: TabView) => void;
  onOpenQibla: () => void;
  onOpenTasbeeh: () => void;
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
  alertsCount?: number;
  language?: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeView,
  onChangeView,
  onOpenQibla,
  onOpenTasbeeh,
  onOpenCalendar,
  onOpenSettings,
  alertsCount = 0,
  language = 'ar',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;
  const isRtl = language === 'ar';

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-white/10 shadow-2xl px-2 py-2 md:py-2.5 max-w-xl mx-auto md:rounded-t-3xl md:bottom-2 md:border md:border-white/10"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-around">
        {/* 1. Main Mosque Clock Prayer Times */}
        <button
          type="button"
          onClick={() => onChangeView('prayers')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition ${
            activeView === 'prayers'
              ? 'bg-emerald-500 text-black shadow-lg font-black scale-105'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Clock className="w-4.5 h-4.5" />
          <span className="text-[10px] sm:text-[11px] font-bold">{t.tabMosqueClock}</span>
        </button>

        {/* 2. Approaching Alerts */}
        <button
          type="button"
          onClick={() => onChangeView('alerts')}
          className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition ${
            activeView === 'alerts'
              ? 'bg-emerald-500 text-black shadow-lg font-black scale-105'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="text-[10px] sm:text-[11px] font-bold">{t.tabAlerts}</span>
          {alertsCount > 0 && (
            <span className="absolute -top-0.5 end-1 w-4 h-4 bg-amber-400 text-black rounded-full text-[9px] font-black flex items-center justify-center font-mono">
              {alertsCount}
            </span>
          )}
        </button>

        {/* 3. Adhan Phone Audio/Video */}
        <button
          type="button"
          onClick={() => onChangeView('adhan')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition ${
            activeView === 'adhan'
              ? 'bg-emerald-500 text-black shadow-lg font-black scale-105'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Smartphone className="w-4.5 h-4.5" />
          <span className="text-[10px] sm:text-[11px] font-bold">{t.tabAdhan}</span>
        </button>

        {/* 4. Adhkar */}
        <button
          type="button"
          onClick={() => onChangeView('adhkar')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition ${
            activeView === 'adhkar'
              ? 'bg-emerald-500 text-black shadow-lg font-black scale-105'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span className="text-[10px] sm:text-[11px] font-bold">{t.tabAdhkar}</span>
        </button>

        {/* 5. Tasbeeh */}
        <button
          type="button"
          onClick={onOpenTasbeeh}
          className="flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition"
        >
          <Sparkles className="w-4.5 h-4.5 text-amber-400" />
          <span className="text-[10px] sm:text-[11px] font-bold">{t.tasbeeh}</span>
        </button>

        {/* 6. Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition"
        >
          <Settings className="w-4.5 h-4.5 text-emerald-400" />
          <span className="text-[10px] sm:text-[11px] font-bold">{t.settings}</span>
        </button>
      </div>
    </div>
  );
};
