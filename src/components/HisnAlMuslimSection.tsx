import React, { useState } from 'react';
import { 
  BookOpen, 
  Sun, 
  Moon, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  Share2, 
  Heart,
  Quote,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { HISN_AL_MUSLIM_CATEGORIES, DAILY_HADITH_AND_AYAH, ThikrCategory, ThikrItem } from '../data/hisnAlMuslim';
import { soundEngine } from '../utils/audioSynthesizer';

interface HisnAlMuslimSectionProps {
  onOpenSalawat?: () => void;
}

export const HisnAlMuslimSection: React.FC<HisnAlMuslimSectionProps> = ({ onOpenSalawat }) => {
  const [activeCategory, setActiveCategory] = useState<string>('morning');
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({});
  const [hasCopied, setHasCopied] = useState<string | null>(null);

  const currentCategory = HISN_AL_MUSLIM_CATEGORIES.find((c) => c.id === activeCategory) || HISN_AL_MUSLIM_CATEGORIES[0];

  // Handle clicking a thikr to increment count
  const handleThikrClick = (item: ThikrItem) => {
    const current = completedCounts[item.id] || 0;
    if (current < item.count) {
      const next = current + 1;
      setCompletedCounts((prev) => ({ ...prev, [item.id]: next }));
      soundEngine.playTasbeehClick();

      // If finished this thikr
      if (next === item.count) {
        if ('vibrate' in navigator) {
          navigator.vibrate([40, 30, 40]);
        }
      }
    }
  };

  // Reset a specific thikr counter
  const handleResetThikr = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompletedCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  // Copy thikr text
  const handleCopyText = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setHasCopied(id);
    setTimeout(() => setHasCopied(null), 2000);
  };

  // Calculate completion percentage for current category
  const totalRequired = currentCategory.items.reduce((acc, it) => acc + it.count, 0);
  const totalDone = currentCategory.items.reduce((acc, it) => acc + Math.min(it.count, completedCounts[it.id] || 0), 0);
  const progressPercent = Math.round((totalDone / (totalRequired || 1)) * 100);

  return (
    <div id="adhkar-section" className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#1A3636] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D6BD98]" />
            <span>حصن المسلم والأذكار اليومية</span>
            <span className="text-xs font-normal text-[#1A3636] bg-[#F7F5F0] px-2.5 py-0.5 rounded-full border border-[#D6BD98]/40">
              عداد تفاعلي
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            أذكار الصباح والمساء ودبر الصلوات مع متابعة العداد والأجر المأثور
          </p>
        </div>

        {/* Category Progress */}
        <div className="flex items-center gap-3 bg-[#F7F5F0] px-3.5 py-2 rounded-2xl border border-stone-200/80 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[11px] font-bold text-[#1A3636]">إنجاز هذا القسم:</div>
            <div className="text-[10px] text-stone-500">{totalDone} من {totalRequired} تسبيحة</div>
          </div>
          <div className="relative w-9 h-9 flex items-center justify-center font-bold text-xs text-[#1A3636] font-mono bg-white rounded-full border border-[#D6BD98]/60 shadow-xs">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Daily Ayah & Hadith Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ayah */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#1A3636] to-[#254949] text-white border border-[#254949] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D6BD98] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                <Sparkles className="w-3 h-3" />
                آية اليوم في فضل الصلاة
              </span>
              <span className="text-[10px] text-stone-300 font-serif">
                {DAILY_HADITH_AND_AYAH.ayah.surah}
              </span>
            </div>
            <p className="text-base sm:text-lg font-serif font-bold text-[#FDFCF8] leading-relaxed pt-1">
              {DAILY_HADITH_AND_AYAH.ayah.arabic}
            </p>
            <p className="text-xs text-[#D6BD98]/90 leading-relaxed pt-1 border-t border-white/10">
              <span className="font-bold">التفسير الميسر: </span>
              {DAILY_HADITH_AND_AYAH.ayah.tafseer}
            </p>
          </div>
        </div>

        {/* Hadith */}
        <div className="p-4.5 rounded-2xl bg-[#F7F5F0] border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1A3636] bg-[#D6BD98]/30 px-2.5 py-0.5 rounded-full border border-[#D6BD98]/40">
                <Quote className="w-3 h-3 text-[#1A3636]" />
                الحديث الشريف اليومي
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {DAILY_HADITH_AND_AYAH.hadith.source}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {DAILY_HADITH_AND_AYAH.hadith.narrator}
            </p>
            <p className="text-sm sm:text-base font-serif font-bold text-stone-900 leading-relaxed">
              {DAILY_HADITH_AND_AYAH.hadith.arabic}
            </p>
          </div>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {HISN_AL_MUSLIM_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const catDone = cat.items.reduce((acc, it) => acc + Math.min(it.count, completedCounts[it.id] || 0), 0);
          const catTotal = cat.items.reduce((acc, it) => acc + it.count, 0);
          const isAllDone = catDone >= catTotal;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shadow-xs ${
                isSelected
                  ? 'bg-[#1A3636] text-[#FDFCF8] border-[#1A3636]'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200/80'
              }`}
            >
              {cat.id === 'morning' && <Sun className="w-4 h-4 text-[#D6BD98]" />}
              {cat.id === 'evening' && <Moon className="w-4 h-4 text-[#D6BD98]" />}
              {cat.id === 'post_prayer' && <Sparkles className="w-4 h-4 text-[#D6BD98]" />}
              {cat.id === 'sleep' && <ShieldCheck className="w-4 h-4 text-[#D6BD98]" />}
              <span>{cat.titleAr}</span>
              {isAllDone && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Category Description Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-stone-100 text-xs text-stone-600 flex items-center justify-between">
        <span>{currentCategory.descriptionAr}</span>
        <span className="text-[11px] font-semibold text-[#1A3636]">
          {currentCategory.items.length} أذكار
        </span>
      </div>

      {/* Interactive Thikr Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentCategory.items.map((item, idx) => {
          const currentCount = completedCounts[item.id] || 0;
          const isDone = currentCount >= item.count;

          return (
            <div
              key={item.id}
              onClick={() => handleThikrClick(item)}
              className={`relative overflow-hidden rounded-2xl p-4.5 border transition-all cursor-pointer select-none flex flex-col justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white hover:border-[#1A3636]/50 border-stone-200/80 shadow-xs hover:shadow-sm'
              }`}
            >
              {/* Top Row: Index + Source + Copy + Reset */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    isDone ? 'bg-emerald-600 text-white' : 'bg-[#1A3636] text-[#D6BD98]'
                  }`}>
                    {idx + 1}
                  </span>
                  {item.source && (
                    <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                      {item.source}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleCopyText(e, item.text, item.id)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                    title="نسخ الذكر"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {currentCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => handleResetThikr(e, item.id)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                      title="إعادة التكرار"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Thikr Text */}
              <p className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-relaxed tracking-wide text-right">
                {item.text}
              </p>

              {/* Reward description */}
              {item.reward && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.reward}</span>
                </div>
              )}

              {/* Bottom Clicker Bar & Progress */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">التكرار المطلوب:</span>
                  <span className="text-xs font-bold text-[#1A3636] font-mono">
                    {item.count} {item.count > 1 ? 'مرات' : 'مرة'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasCopied === item.id && (
                    <span className="text-[10px] text-emerald-600 font-bold animate-fade-in">تم النسخ!</span>
                  )}

                  {/* Big interactive counter button */}
                  <div
                    className={`px-4 py-1.5 rounded-xl font-bold font-mono text-sm flex items-center gap-1.5 transition-all shadow-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-emerald-200'
                        : 'bg-[#1A3636] text-[#D6BD98] hover:bg-[#254949]'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم ({currentCount}/{item.count})</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3.5 h-3.5 text-[#D6BD98]" />
                        <span>{currentCount} / {item.count}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
