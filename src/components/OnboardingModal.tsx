import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Sliders, 
  Bell, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { AppSettings, CalculationMethodKey, CityInfo, Language, MadhabKey } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { CALCULATION_METHODS, POPULAR_CITIES } from '../utils/citiesDatabase';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: (updatedSettings: AppSettings) => void;
  settings: AppSettings;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinish,
  settings,
}) => {
  const [step, setStep] = useState<number>(1);
  const [currentLang, setCurrentLang] = useState<Language>(settings.language || 'ar');
  const [selectedCity, setSelectedCity] = useState<CityInfo>(settings.city || POPULAR_CITIES[0]);
  const [selectedMethod, setSelectedMethod] = useState<CalculationMethodKey>(settings.method || 'Egyptian');
  const [selectedMadhab, setSelectedMadhab] = useState<MadhabKey>(settings.madhab || 'Shafi');
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ar;
  const isRtl = currentLang === 'ar';

  const handleUseGps = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCity: CityInfo = {
          id: 'gps_auto_loc',
          nameAr: 'موقعي الحالي عبر GPS',
          nameEn: 'My GPS Location',
          nameFr: 'Ma Position GPS',
          countryAr: 'موقع تلقائي',
          countryEn: 'Auto GPS',
          countryFr: 'GPS Automatique',
          countryCode: 'GPS',
          lat: latitude,
          lng: longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          recommendedMethod: selectedMethod,
        };
        setSelectedCity(newCity);
        setIsLocating(false);
      },
      (err) => {
        console.warn(err);
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleComplete = () => {
    const updated: AppSettings = {
      ...settings,
      language: currentLang,
      city: selectedCity,
      method: selectedMethod,
      madhab: selectedMadhab,
      onboardingCompleted: true,
    };
    onFinish(updated);
  };

  const filteredCities = POPULAR_CITIES.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.nameAr.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.countryAr.toLowerCase().includes(q) ||
      c.countryEn.toLowerCase().includes(q)
    );
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-neutral-900 border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900/40 via-emerald-800/20 to-neutral-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t.welcomeTitle}</h2>
              <p className="text-xs text-white/60">{t.welcomeDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-black/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <span>{step}</span>
            <span>/</span>
            <span>3</span>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Step 1: Language */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <Globe className="w-4 h-4" />
                <span>{t.stepLanguage}</span>
              </div>
              <p className="text-xs text-white/70">
                {t.selectLanguage}
              </p>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {[
                  { key: 'ar' as Language, label: t.arabicLang, native: 'العربية', flag: '🇸🇦' },
                  { key: 'en' as Language, label: t.englishLang, native: 'English', flag: '🇬🇧' },
                  { key: 'fr' as Language, label: t.frenchLang, native: 'Français', flag: '🇫🇷' },
                ].map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setCurrentLang(l.key)}
                    className={`p-4 rounded-2xl border flex items-center justify-between text-start transition ${
                      currentLang === l.key
                        ? 'bg-emerald-500/20 border-emerald-400/70 shadow-lg shadow-emerald-500/10'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{l.flag}</span>
                      <div>
                        <span className="text-sm font-bold text-white block">{l.native}</span>
                        <span className="text-xs text-white/50">{l.label}</span>
                      </div>
                    </div>
                    {currentLang === l.key && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <MapPin className="w-4 h-4" />
                <span>{t.stepLocation}</span>
              </div>

              {/* GPS Button */}
              <button
                type="button"
                onClick={handleUseGps}
                disabled={isLocating}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition"
              >
                <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? t.locatingGps : t.useGpsButton}
              </button>

              {/* Selected Location Pill */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">{t.currentActiveLocation}</span>
                <span className="text-xs font-bold text-emerald-300">
                  {currentLang === 'ar' ? selectedCity.nameAr : selectedCity.nameEn} ({currentLang === 'ar' ? selectedCity.countryAr : selectedCity.countryEn})
                </span>
              </div>

              {/* Search Cities */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={t.searchCityPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-emerald-400"
                />

                <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl bg-black/30 p-1 border border-white/5">
                  {filteredCities.slice(0, 15).map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city);
                        setSelectedMethod(city.recommendedMethod);
                      }}
                      className={`w-full p-2.5 rounded-lg text-start flex items-center justify-between text-xs transition ${
                        selectedCity.id === city.id
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'text-white/80 hover:bg-white/5'
                      }`}
                    >
                      <span>
                        {currentLang === 'ar' ? city.nameAr : city.nameEn} - {currentLang === 'ar' ? city.countryAr : city.countryEn}
                      </span>
                      {selectedCity.id === city.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Calculation Method & Madhab */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <Sliders className="w-4 h-4" />
                <span>{t.stepMethod}</span>
              </div>

              {/* Methods List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white/70 block">
                  {t.calculationMethodsTitle}
                </span>

                <div className="max-h-52 overflow-y-auto space-y-2 rounded-xl bg-black/30 p-1 border border-white/5">
                  {CALCULATION_METHODS.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setSelectedMethod(m.key as CalculationMethodKey)}
                      className={`w-full p-3 rounded-xl border text-start flex items-center justify-between transition ${
                        selectedMethod === m.key
                          ? 'bg-emerald-500/20 border-emerald-400/60 shadow'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-white block truncate">
                          {currentLang === 'ar' ? m.nameAr : (currentLang === 'fr' && (m as any).nameFr ? (m as any).nameFr : m.nameEn)}
                        </span>
                        <span className="text-[10px] text-white/50 block truncate">
                          {m.description}
                        </span>
                      </div>
                      {selectedMethod === m.key && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asr Madhab */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white/70 block">
                  {t.asrSchoolTitle}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMadhab('Shafi')}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition ${
                      selectedMadhab === 'Shafi'
                        ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    {t.asrStandard}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMadhab('Hanafi')}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition ${
                      selectedMadhab === 'Hanafi'
                        ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    {t.asrHanafi}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-5 bg-neutral-950 border-t border-white/10 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              {t.prevStep}
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
            >
              {t.nextStep}
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-black text-xs font-black flex items-center gap-2 transition shadow-xl shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {t.startUsingApp}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
