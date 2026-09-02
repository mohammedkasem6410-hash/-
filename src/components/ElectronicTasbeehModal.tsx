import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  Award, 
  Check, 
  HeartHandshake, 
  Target,
  ChevronDown
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

interface ElectronicTasbeehModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TASBEEH_PRESETS = [
  { id: 'subhanallah', text: 'سُبْحَانَ اللَّهِ', target: 33, meaning: 'تنزيه الله تعالى عن كل نقص وعيب' },
  { id: 'alhamdulillah', text: 'الْحَمْدُ لِلَّهِ', target: 33, meaning: 'الثناء على الله بنعمه الظاهرة والباطنة' },
  { id: 'allahuakbar', text: 'اللَّهُ أَكْبَرُ', target: 33, meaning: 'الله أعظم وأجلّ من كل شيء في الكون' },
  { id: 'tahlil', text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', target: 100, meaning: 'كلمة التوحيد الخالص وأعظم أركان الدين' },
  { id: 'istighfar', text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', target: 100, meaning: 'طلب المغفرة وانشراح الصدر والرزق' },
  { id: 'salawat', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 100, meaning: 'الصلاة والسلام على الحبيب المصطفى' },
  { id: 'hawqala', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 100, meaning: 'كنز من كنوز الجنة وتسليم الأمر لله' },
];

export const ElectronicTasbeehModal: React.FC<ElectronicTasbeehModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFormulaIndex, setSelectedFormulaIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0);
  const [totalTasbeehSession, setTotalTasbeehSession] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFormula = TASBEEH_PRESETS[selectedFormulaIndex];

  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    setTotalTasbeehSession((prev) => prev + 1);

    if (soundEnabled) {
      soundEngine.playTasbeehClick();
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // Check target lap
    if (currentFormula.target > 0 && nextCount % currentFormula.target === 0) {
      setRounds((r) => r + 1);
      if ('vibrate' in navigator) {
        navigator.vibrate([60, 40, 60]);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    setRounds(0);
  };

  const handleSelectFormula = (idx: number) => {
    setSelectedFormulaIndex(idx);
    setCount(0);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto" dir="rtl">
      <div className="relative w-full max-w-md bg-[#FDFCF8] border border-stone-300 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col text-right">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#1A3636] text-[#FDFCF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D6BD98]/20 flex items-center justify-center text-[#D6BD98]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">المسبحة الإلكترونية المطورة</h4>
              <p className="text-[11px] text-[#D6BD98]">عداد تسبيح ذكي مع أصوات ونغمات تفاعلية</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FDFCF8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Formula Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">اختر الذكر المفضل:</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-stone-100 rounded-2xl border border-stone-200">
              {TASBEEH_PRESETS.map((preset, idx) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectFormula(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedFormulaIndex === idx
                      ? 'bg-[#1A3636] text-[#D6BD98] shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
                  }`}
                >
                  {preset.text}
                </button>
              ))}
            </div>
          </div>

          {/* Active Formula Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1A3636] to-[#254949] text-white border border-[#254949] text-center shadow-md space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FDFCF8] tracking-wide">
              {currentFormula.text}
            </h3>
            <p className="text-xs text-[#D6BD98] font-medium">
              {currentFormula.meaning}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-stone-300">
              <span>الهدف الموصى به:</span>
              <span className="font-bold text-[#D6BD98] font-mono">{currentFormula.target} مرة</span>
              <span>• الدورات المكتملة: {rounds}</span>
            </div>
          </div>

          {/* Central Digital Tasbeeh Clicker Device */}
          <div className="flex flex-col items-center justify-center py-2">
            {/* LED Screen */}
            <div className="w-56 bg-[#132828] border-4 border-[#254949] rounded-2xl p-4 shadow-inner text-center mb-5">
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mb-1">
                <span>ROUND: {rounds}</span>
                <span>TOTAL: {totalTasbeehSession}</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-[#D6BD98] tracking-widest py-1">
                {count.toString().padStart(4, '0')}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                {currentFormula.target > 0 ? `المتبقي للدورة: ${Math.max(0, currentFormula.target - (count % currentFormula.target))}` : 'تسبيح مفتوح'}
              </div>
            </div>

            {/* Main Round Push Button */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={() => setIsPressing(true)}
                onMouseUp={() => setIsPressing(false)}
                onClick={handleIncrement}
                className={`w-36 h-36 rounded-full bg-gradient-to-b from-[#1A3636] to-[#0F2222] border-4 border-[#D6BD98] shadow-2xl text-[#D6BD98] flex flex-col items-center justify-center transition-transform active:scale-95 select-none cursor-pointer ${
                  isPressing ? 'scale-95 shadow-inner' : 'hover:scale-105'
                }`}
              >
                <Sparkles className="w-6 h-6 mb-1 text-[#D6BD98] animate-pulse" />
                <span className="text-sm font-bold tracking-wider">اضغط للتسبيح</span>
              </button>
            </div>
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                soundEnabled ? 'bg-[#1A3636] text-[#D6BD98] border-[#1A3636]' : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>صوت النقرة</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تصفير العداد</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1A3636] hover:bg-[#254949] text-[#FDFCF8] transition-colors shadow-xs"
            >
              تم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
