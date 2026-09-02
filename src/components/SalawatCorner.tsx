import React, { useState } from 'react';
import { 
  HeartHandshake, 
  RotateCcw, 
  Volume2, 
  Clock, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Settings2,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SalawatSettings } from '../types';
import { soundEngine } from '../utils/audioSynthesizer';

interface SalawatCornerProps {
  salawat: SalawatSettings;
  onUpdateSalawat: (updated: Partial<SalawatSettings>) => void;
  onTriggerVoiceReminder: () => void;
}

const SALAWAT_FORMULAS = [
  {
    id: 'standard',
    title: 'الصيغة الموجزة المباركة',
    text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
  },
  {
    id: 'ibrahimiyya',
    title: 'الصيغة الإبراهيمية (أفضل الصيغ)',
    text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
  },
  {
    id: 'short',
    title: 'صيغة الصلاة والتسليم',
    text: 'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
  },
  {
    id: 'tibbiya',
    title: 'صيغة تفريج الكروب وشفاء القلوب',
    text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوبِ وَدَوَائِهَا، وَعَافِيَةِ الأَبْدَانِ وَشِفَائِهَا، وَنُورِ الأَبْصَارِ وَضِيَائِهَا وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
  },
];

const VIRTUES = [
  {
    hadith: '«مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا»',
    source: 'صحيح مسلم',
  },
  {
    hadith: '«أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلَاةً»',
    source: 'سنن الترمذي',
  },
  {
    hadith: '«إِذًا تُكْفَى هَمَّكَ، وَيُغْفَرُ لَكَ ذَنْبُكَ»',
    source: 'رواه الترمذي وحسنه',
  },
];

export const SalawatCorner: React.FC<SalawatCornerProps> = ({
  salawat,
  onUpdateSalawat,
  onTriggerVoiceReminder,
}) => {
  const [showFormulaDropdown, setShowFormulaDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Increment counter with sound & animation
  const handleIncrement = () => {
    soundEngine.playTasbeehClick();

    const newToday = salawat.todayCount + 1;
    const newTotal = salawat.totalCount + 1;

    // Check if daily target hit!
    if (newToday === salawat.dailyTarget) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch (e) {
        console.log(e);
      }
    }

    onUpdateSalawat({
      todayCount: newToday,
      totalCount: newTotal,
    });
  };

  const handleResetToday = () => {
    if (window.confirm('هل تريد تصفير عداد الصلاة على النبي ﷺ لليوم؟')) {
      onUpdateSalawat({ todayCount: 0 });
    }
  };

  const progressPercent = Math.min(100, Math.round((salawat.todayCount / Math.max(1, salawat.dailyTarget)) * 100));

  return (
    <div id="salawat-section" className="relative overflow-hidden rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-7 shadow-xs">
      {/* Header of Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1A3636] flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-6 h-6 text-[#D6BD98]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3636]">
                ركن الصلاة على النبي ﷺ
              </h3>
              <span className="px-2.5 py-0.5 bg-[#F7F5F0] text-[#1A3636] text-xs font-semibold rounded-full border border-[#D6BD98]/40">
                تذكير دوري ومسبحة
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-['Cairo',sans-serif]">
              حدد عدد الدقائق للتذكير المستمر بالصلاة على الحبيب المصطفى ﷺ
            </p>
          </div>
        </div>

        {/* Quick Automation Settings Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-[#1A3636] text-xs font-medium border border-stone-200/80 transition-colors shadow-xs"
          >
            <Settings2 className="w-4 h-4 text-[#1A3636]" />
            <span>ضبط التذكير والتوقيت</span>
          </button>
          <button
            onClick={onTriggerVoiceReminder}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F5F0] hover:bg-[#eae5d8] text-[#1A3636] text-xs font-semibold border border-[#D6BD98]/60 transition-colors shadow-xs"
            title="استماع لصوت التذكير بالصلاة على النبي"
          >
            <Volume2 className="w-4 h-4 text-[#1A3636]" />
            <span className="hidden sm:inline">تجربة الصوت</span>
          </button>
        </div>
      </div>

      {/* Embedded Settings Panel when toggled */}
      {showSettings && (
        <div className="mb-6 p-4 rounded-2xl bg-[#F7F5F0] border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-serif font-bold text-[#1A3636] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1A3636]" />
              إعدادات التذكير التلقائي بالصلاة على النبي ﷺ
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600">تفعيل التذكير:</span>
              <button
                onClick={() => onUpdateSalawat({ enabled: !salawat.enabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  salawat.enabled ? 'bg-[#1A3636]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    salawat.enabled ? 'translate-x-1' : 'translate-x-5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Interval Minutes */}
            <div className="p-3 rounded-xl bg-white border border-stone-200/80 space-y-2">
              <label className="font-semibold text-stone-700 block">
                تكرار التنبيه كل:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[5, 10, 15, 20, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => onUpdateSalawat({ intervalMinutes: mins })}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-colors ${
                      salawat.intervalMinutes === mins
                        ? 'bg-[#1A3636] text-[#D6BD98]'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {mins} دقيقة
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Target */}
            <div className="p-3 rounded-xl bg-white border border-stone-200/80 space-y-2">
              <label className="font-semibold text-stone-700 block">
                الهدف اليومي (العدد):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[100, 300, 500, 1000, 2000, 5000].map((tgt) => (
                  <button
                    key={tgt}
                    onClick={() => onUpdateSalawat({ dailyTarget: tgt })}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-colors ${
                      salawat.dailyTarget === tgt
                        ? 'bg-[#1A3636] text-[#D6BD98]'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {tgt}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Selection */}
            <div className="p-3 rounded-xl bg-white border border-stone-200/80 space-y-2">
              <label className="font-semibold text-stone-700 block">
                نغمة وصوت التذكير:
              </label>
              <select
                value={salawat.soundType}
                onChange={(e) => onUpdateSalawat({ soundType: e.target.value as SalawatSettings['soundType'] })}
                className="w-full bg-stone-50 text-stone-800 rounded-lg p-2 border border-stone-200 focus:outline-none focus:border-[#1A3636]"
              >
                <option value="voice_1">صوت مسموع: اللهم صل وسلم على نبينا محمد</option>
                <option value="voice_2">صوت مسموع: صلى الله عليه وسلم</option>
                <option value="soft_tone">نغمة جرس إسلامي هادئ</option>
                <option value="chime">رنين لطيف</option>
                <option value="silent">إشعار مرئي بدون صوت</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Masbaha & Formula Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Interactive Masbaha Counter */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 shadow-xs">
          {/* Target Progress Ring / Info */}
          <div className="flex items-center justify-between w-full text-xs text-stone-500 mb-4 px-2">
            <span className="flex items-center gap-1.5 text-[#1A3636] font-semibold">
              <Target className="w-4 h-4 text-[#1A3636]" />
              الهدف اليومي: {salawat.dailyTarget}
            </span>
            <span className="font-bold text-stone-700 font-mono">
              {progressPercent}% مكتمل
            </span>
          </div>

          {/* Large Interactive Touch Counter Button */}
          <button
            onClick={handleIncrement}
            className="group relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#1A3636] p-2.5 shadow-md hover:scale-102 active:scale-98 transition-all duration-150 ring-4 ring-[#D6BD98]/40 hover:ring-[#D6BD98]"
          >
            {/* Inner Ring */}
            <div className="w-full h-full rounded-full bg-[#132828] flex flex-col items-center justify-center p-4 border border-[#D6BD98]/30 group-hover:border-[#D6BD98] transition-colors shadow-inner">
              <span className="text-xs text-[#D6BD98] font-semibold mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                اضغط للتسبيح
              </span>
              <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight group-hover:text-[#D6BD98]">
                {salawat.todayCount}
              </span>
              <span className="text-[11px] text-stone-300 mt-1">
                صلاة اليوم
              </span>
            </div>
          </button>

          {/* Quick Controls & Stats Under Counter */}
          <div className="flex items-center justify-between w-full mt-5 px-2 text-xs">
            <div className="text-stone-600 font-medium">
              <span>الإجمالي الكلي: </span>
              <span className="font-bold text-[#1A3636] font-mono">{salawat.totalCount}</span>
            </div>

            <button
              onClick={handleResetToday}
              className="flex items-center gap-1 text-stone-500 hover:text-rose-600 transition-colors"
              title="تصفير عداد اليوم"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير اليوم</span>
            </button>
          </div>
        </div>

        {/* Right Column: Selected Formula & Islamic Virtues */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Formula Selector Card */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1A3636] flex items-center gap-1.5 font-serif">
                <BookOpen className="w-4 h-4 text-[#1A3636]" />
                الصيغة المختارة للصلاة على النبي ﷺ
              </span>
              <button
                onClick={() => setShowFormulaDropdown(!showFormulaDropdown)}
                className="flex items-center gap-1 text-xs text-[#1A3636] hover:underline font-medium"
              >
                <span>تغيير الصيغة</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-[#1A3636] text-center py-3 font-['Amiri',serif] leading-relaxed tracking-wide bg-white rounded-xl px-3 border border-stone-200/80 shadow-xs">
              «{salawat.selectedFormula}»
            </p>

            {/* Formula Dropdown selection */}
            {showFormulaDropdown && (
              <div className="mt-3 space-y-2 border-t border-stone-200 pt-3">
                {SALAWAT_FORMULAS.map((formula) => (
                  <div
                    key={formula.id}
                    onClick={() => {
                      onUpdateSalawat({ selectedFormula: formula.text });
                      setShowFormulaDropdown(false);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                      salawat.selectedFormula === formula.text
                        ? 'bg-[#1A3636] text-[#D6BD98]'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <div className="font-bold mb-1">{formula.title}</div>
                    <div className="font-['Amiri',serif]">{formula.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Goal & Streak Progress Bar */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5 text-[#1A3636]">
                <Flame className="w-4 h-4 text-[#1A3636]" />
                التقدم نحو الهدف اليومي ({salawat.todayCount} / {salawat.dailyTarget})
              </span>
              {salawat.todayCount >= salawat.dailyTarget && (
                <span className="flex items-center gap-1 text-[#1A3636] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  تم إنجاز الهدف! مبارك!
                </span>
              )}
            </div>
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-[#1A3636] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Virtues & Hadiths on Salawat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {VIRTUES.map((v, i) => (
              <div key={i} className="p-3 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                <div className="font-['Amiri',serif] font-bold text-[#1A3636] text-sm leading-snug">
                  {v.hadith}
                </div>
                <div className="text-[10px] text-stone-500 mt-1 font-['Cairo',sans-serif]">{v.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
