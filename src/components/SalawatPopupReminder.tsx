import React from 'react';
import { HeartHandshake, X, Plus, Sparkles, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

interface SalawatPopupReminderProps {
  isOpen: boolean;
  onDismiss: () => void;
  onIncrement: () => void;
  formula: string;
  count: number;
}

export const SalawatPopupReminder: React.FC<SalawatPopupReminderProps> = ({
  isOpen,
  onDismiss,
  onIncrement,
  formula,
  count,
}) => {
  if (!isOpen) return null;

  const handleReciteAndCount = () => {
    onIncrement();
    soundEngine.playTasbeehClick();
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 border-2 border-amber-400/50 rounded-2xl p-4 shadow-2xl shadow-amber-950/80">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            ﷺ
          </div>
          <span>تذكير الصلاة على النبي ﷺ</span>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-sm font-bold text-white text-center py-2 font-['Amiri',serif] leading-relaxed">
        «{formula}»
      </p>

      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800">
        <span className="text-[11px] text-slate-400">
          العدد اليوم: <strong className="text-amber-300 font-mono">{count}</strong>
        </span>

        <button
          onClick={handleReciteAndCount}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>صليتُ عليه (+1)</span>
        </button>
      </div>
    </div>
  );
};
