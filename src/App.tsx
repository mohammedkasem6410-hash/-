/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroPrayerCard } from './components/HeroPrayerCard';
import { PrayerGrid } from './components/PrayerGrid';
import { AlertsTabSection } from './components/AlertsTabSection';
import { AdhanTabSection } from './components/AdhanTabSection';
import { SalawatCorner } from './components/SalawatCorner';
import { SettingsModal } from './components/SettingsModal';
import { AdhanVideoModal } from './components/AdhanVideoModal';
import { MusaharatiModal } from './components/MusaharatiModal';
import { OnboardingModal } from './components/OnboardingModal';
import { QiblaCompassModal } from './components/QiblaCompassModal';
import { MonthlyCalendarModal } from './components/MonthlyCalendarModal';
import { ApproachingAlertNotification } from './components/ApproachingAlertNotification';
import { FullScreenAlertModal } from './components/FullScreenAlertModal';
import { SalawatPopupReminder } from './components/SalawatPopupReminder';
import { HisnAlMuslimSection } from './components/HisnAlMuslimSection';
import { ElectronicTasbeehModal } from './components/ElectronicTasbeehModal';
import { BottomNavBar, TabView } from './components/BottomNavBar';
import { AppSettings, ApproachingAlertItem, PrayerKey } from './types';
import { loadSettings, saveSettings } from './utils/storage';
import { calculatePrayerTimes, getHijriDate } from './utils/prayerEngine';
import { soundEngine } from './utils/audioSynthesizer';
import { TRANSLATIONS } from './utils/translations';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isMuted, setIsMuted] = useState(false);
  const [activeView, setActiveView] = useState<TabView>('prayers');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState(0);
  const [settingsInitialPrayerKey, setSettingsInitialPrayerKey] = useState<PrayerKey>('fajr');
  const [isQiblaOpen, setIsQiblaOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTasbeehOpen, setIsTasbeehOpen] = useState(false);

  // Active Adhan Video Player
  const [adhanModal, setAdhanModal] = useState<{ isOpen: boolean; prayerKey: PrayerKey }>({
    isOpen: false,
    prayerKey: 'fajr',
  });

  // Active Musaharati Suhoor Awakening Modal
  const [isMusaharatiModalOpen, setIsMusaharatiModalOpen] = useState(false);

  // Active Approaching Notification
  const [activeApproachingAlert, setActiveApproachingAlert] = useState<{
    alert: ApproachingAlertItem;
    prayerName: string;
  } | null>(null);

  // Active Full-Screen Alert Modal
  const [activeFullScreenAlert, setActiveFullScreenAlert] = useState<{
    alert: ApproachingAlertItem;
    prayerName: string;
  } | null>(null);

  // Salawat recurring popup reminder
  const [showSalawatPopup, setShowSalawatPopup] = useState(false);

  // Keep track of triggered alerts today to prevent duplicate sounds in the same minute
  const [triggeredAlertsHistory, setTriggeredAlertsHistory] = useState<Set<string>>(new Set());

  const currentLang = settings.language || 'ar';
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ar;
  const isRtl = currentLang === 'ar';

  // Save settings whenever they change
  const handleSaveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // Update Clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate prayer times
  const prayerCalculation = useMemo(() => {
    return calculatePrayerTimes(currentTime, settings);
  }, [currentTime, settings]);

  const hijriDate = useMemo(() => {
    return getHijriDate(currentTime, settings.hijriOffsetDays, currentLang);
  }, [currentTime, settings.hijriOffsetDays, currentLang]);

  // Check if currently within prayer silent duration (e.g. 20 minutes after adhan)
  const isPrayerSilentActive = useMemo(() => {
    if (!settings.autoSilentDuringPrayer) return false;
    const now = currentTime.getTime();
    return prayerCalculation.items.some((p) => {
      if (p.key === 'sunrise') return false;
      const prayerMs = p.time.getTime();
      const durationMs = (settings.silentDurationMinutes || 20) * 60000;
      return now >= prayerMs && now <= prayerMs + durationMs;
    });
  }, [settings.autoSilentDuringPrayer, settings.silentDurationMinutes, currentTime, prayerCalculation.items]);

  // Play a specific sound based on alert (custom audio from phone or synthesized soundType)
  const triggerAlertSound = useCallback((alert: ApproachingAlertItem) => {
    if (isMuted || isPrayerSilentActive) return;
    
    if (alert.customAudioUrl) {
      try {
        const customAudio = new Audio(alert.customAudioUrl);
        customAudio.volume = alert.volume ?? 0.85;
        customAudio.play().catch((err) => {
          console.log('Autoplay error for custom phone alert sound, falling back to tone:', err);
          soundEngine.playAlertSound(alert.soundType, alert.volume ?? 0.85);
        });
        return;
      } catch (e) {
        console.error('Audio object creation error:', e);
      }
    }
    
    soundEngine.playAlertSound(alert.soundType, alert.volume ?? 0.85);
  }, [isMuted, isPrayerSilentActive]);

  // Trigger Salawat Voice/Tone Reminder
  const triggerSalawatReminder = useCallback(() => {
    if (!isMuted && !isPrayerSilentActive) {
      if (settings.salawat.soundType === 'voice_1') {
        soundEngine.speakArabic('اللهم صل وسلم وبارك على نبينا محمد');
      } else if (settings.salawat.soundType === 'voice_2') {
        soundEngine.speakArabic('صلى الله عليه وسلم');
      } else if (settings.salawat.soundType === 'soft_tone') {
        soundEngine.playGentleBell(0.8);
      } else if (settings.salawat.soundType === 'chime') {
        soundEngine.playTakbeerTone(0.7);
      }
    }
    setShowSalawatPopup(true);
    handleSaveSettings({
      ...settings,
      salawat: {
        ...settings.salawat,
        lastReminderTimestamp: Date.now(),
      },
    });
  }, [isMuted, isPrayerSilentActive, settings, handleSaveSettings]);

  // Periodic Watcher for Approaching Alerts, Adhan, Musaharati & Salawat Timer
  useEffect(() => {
    const now = currentTime.getTime();
    const currentMinuteKey = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}-${currentTime.getHours()}-${currentTime.getMinutes()}`;

    // 1. Check Pre-Prayer & Custom Alerts
    (settings.approachingAlerts || []).forEach((alert) => {
      if (!alert.enabled) return;

      let targetTimeMs: number | null = null;
      let targetPrayerName = t.prayers.fajr;

      // If fixed time (e.g. "04:30")
      if (alert.timingType === 'fixed_time' && alert.fixedTime) {
        const [hours, minutes] = alert.fixedTime.split(':').map((n) => parseInt(n, 10));
        if (!isNaN(hours) && !isNaN(minutes)) {
          const alertDate = new Date(currentTime);
          alertDate.setHours(hours, minutes, 0, 0);
          targetTimeMs = alertDate.getTime();
          
          const matchingPrayer = prayerCalculation.items.find((p) => p.key === alert.prayer);
          if (matchingPrayer) {
            targetPrayerName = matchingPrayer.name;
          }
        }
      } else {
        // Relative to prayer time (minutesBefore)
        const targetPrayer = prayerCalculation.items.find(
          (p) => p.key === alert.prayer || (alert.prayer === 'jumuah' && p.key === 'jumuah') || (alert.prayer === 'dhuhr' && p.key === 'dhuhr')
        );

        if (targetPrayer) {
          const prayerTimeMs = targetPrayer.time.getTime();
          targetTimeMs = prayerTimeMs - (alert.minutesBefore || 0) * 60000;
          targetPrayerName = targetPrayer.name;
        } else if (alert.prayer === 'qiyam') {
          const qiyamTimeMs = prayerCalculation.qiyamTime.getTime();
          targetTimeMs = qiyamTimeMs - (alert.minutesBefore || 0) * 60000;
          targetPrayerName = t.extraTimes.qiyam;
        }
      }

      if (targetTimeMs !== null) {
        const diffSeconds = Math.floor((now - targetTimeMs) / 1000);
        const alertKey = `${currentMinuteKey}-${alert.id}`;

        // Trigger if within active window (0-50s) and not triggered yet this minute
        if (diffSeconds >= 0 && diffSeconds < 50 && !triggeredAlertsHistory.has(alertKey)) {
          setTriggeredAlertsHistory((prev) => new Set(prev).add(alertKey));
          triggerAlertSound(alert);
          
          if (alert.fullScreenNotification) {
            setActiveFullScreenAlert({
              alert,
              prayerName: targetPrayerName,
            });
          } else {
            setActiveApproachingAlert({
              alert,
              prayerName: targetPrayerName,
            });
          }

          // Browser push notification
          if ('Notification' in window && Notification.permission === 'granted') {
            const desc = alert.timingType === 'fixed_time' 
              ? (alert.label || `${t.customAlert}: ${alert.fixedTime}`)
              : (alert.label || `${t.approachingAlertBadge}: ${alert.minutesBefore} ${t.minutesShort}`);
            new Notification(`${t.appName}: ${targetPrayerName}`, {
              body: desc,
              icon: '/favicon.ico',
            });
          }
        }
      }
    });

    // 2. Check Exact Adhan Time
    prayerCalculation.items.forEach((prayer) => {
      if (prayer.key === 'sunrise') return; // Sunrise has no Adhan
      const prayerTimeMs = prayer.time.getTime();
      const diffSeconds = Math.floor((now - prayerTimeMs) / 1000);
      const adhanKey = `${currentMinuteKey}-adhan-${prayer.key}`;

      if (diffSeconds >= 0 && diffSeconds < 40 && !triggeredAlertsHistory.has(adhanKey)) {
        setTriggeredAlertsHistory((prev) => new Set(prev).add(adhanKey));

        const prayerKey = prayer.key === 'jumuah' ? 'jumuah' : prayer.key;
        const adhanCfg = settings.adhanConfig[prayerKey];

        if (adhanCfg?.enabled && !isMuted && !isPrayerSilentActive) {
          // Open Adhan Video Modal
          setAdhanModal({
            isOpen: true,
            prayerKey: prayer.key,
          });

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${t.appName}: ${prayer.name}`, {
              body: `${t.appName} - ${settings.city.nameAr}`,
              icon: '/favicon.ico',
            });
          }
        }
      }
    });

    // 3. Check Musaharati Suhoor Awakening Alert (Ramadan / Suhoor)
    if (settings.musaharati?.enabled && !isMuted) {
      let targetMusaharatiMs: number | null = null;
      const fajrItem = prayerCalculation.items.find((p) => p.key === 'fajr');

      if (settings.musaharati.timingMode === 'fixed_time' && settings.musaharati.fixedTime) {
        const [hours, minutes] = settings.musaharati.fixedTime.split(':').map((n) => parseInt(n, 10));
        if (!isNaN(hours) && !isNaN(minutes)) {
          const mDate = new Date(currentTime);
          mDate.setHours(hours, minutes, 0, 0);
          targetMusaharatiMs = mDate.getTime();
        }
      } else if (fajrItem) {
        const minutesBeforeFajr = settings.musaharati.minutesBeforeFajr || 60;
        targetMusaharatiMs = fajrItem.time.getTime() - minutesBeforeFajr * 60000;
      }

      if (targetMusaharatiMs !== null) {
        const diffSeconds = Math.floor((now - targetMusaharatiMs) / 1000);
        const musaharatiKey = `${currentMinuteKey}-musaharati`;

        if (diffSeconds >= 0 && diffSeconds < 45 && !triggeredAlertsHistory.has(musaharatiKey)) {
          setTriggeredAlertsHistory((prev) => new Set(prev).add(musaharatiKey));
          setIsMusaharatiModalOpen(true);

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${t.musaharatiTitle} - ${t.extraTimes.suhoor}`, {
              body: '«اصحى يا نايم وحّد الدايم.. طاب السحور يا صائمين»',
              icon: '/favicon.ico',
            });
          }
        }
      }
    }

    // 4. Check Salawat Recurring Interval Reminder
    if (settings.salawat?.enabled && settings.salawat?.intervalMinutes > 0) {
      const last = settings.salawat.lastReminderTimestamp || 0;
      const intervalMs = settings.salawat.intervalMinutes * 60000;
      if (now - last >= intervalMs) {
        triggerSalawatReminder();
      }
    }
  }, [
    currentTime,
    settings,
    prayerCalculation.items,
    prayerCalculation.qiyamTime,
    triggeredAlertsHistory,
    isMuted,
    isPrayerSilentActive,
    t,
    triggerAlertSound,
    triggerSalawatReminder,
  ]);

  // Open Settings on a specific tab
  const handleOpenSettings = (tabIndex: number = 0, prayerKey?: PrayerKey) => {
    setSettingsInitialTab(tabIndex);
    if (prayerKey) {
      setSettingsInitialPrayerKey(prayerKey);
    }
    setIsSettingsOpen(true);
  };

  // Trigger Adhan video manually
  const handlePlayAdhan = (prayerKey: PrayerKey) => {
    setAdhanModal({
      isOpen: true,
      prayerKey,
    });
  };

  // Pre-prayer alerts count
  const activeAlertsCount = useMemo(() => {
    return (settings.approachingAlerts || []).filter(a => a.enabled).length;
  }, [settings.approachingAlerts]);

  const isDark = settings.themeMode !== 'light';

  return (
    <div 
      className={`min-h-screen ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-900 text-white'} flex flex-col pb-24 md:pb-16 selection:bg-emerald-500 selection:text-black transition-colors duration-300`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Header with Navigation Tabs & Language Switcher */}
      <Header
        settings={settings}
        hijriDate={hijriDate}
        currentTime={currentTime}
        activeView={activeView}
        onChangeView={(v) => setActiveView(v)}
        onOpenSettings={handleOpenSettings}
        onOpenQibla={() => setIsQiblaOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onScrollToSalawat={() => setActiveView('salawat')}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        isPrayerSilentActive={isPrayerSilentActive}
        alertsCount={activeAlertsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-7">
        {/* VIEW 1: Main Mosque Clock Dashboard & Timetable Grid */}
        {activeView === 'prayers' && (
          <div className="space-y-7 animate-fade-in">
            {/* Mosque Electronic Clock Hero Card */}
            <HeroPrayerCard
              nextPrayer={prayerCalculation.nextPrayer}
              currentPrayer={prayerCalculation.currentPrayer}
              settings={settings}
              currentTime={currentTime}
              hijriDate={hijriDate}
              qiyamTime={prayerCalculation.qiyamTime}
              midnightTime={prayerCalculation.midnightTime}
              suhoorTime={prayerCalculation.suhoorTime}
              duhaTime={prayerCalculation.duhaTime}
              onOpenSettings={handleOpenSettings}
              onPlayAdhan={handlePlayAdhan}
            />

            {/* Electronic Timetable Board */}
            <PrayerGrid
              prayers={prayerCalculation.items}
              settings={settings}
              onPlayAdhan={handlePlayAdhan}
              onOpenSettings={(tabIdx, pk) => {
                if (tabIdx === 2) {
                  setActiveView('alerts');
                } else if (tabIdx === 3) {
                  setActiveView('adhan');
                } else {
                  handleOpenSettings(tabIdx, pk);
                }
              }}
            />
          </div>
        )}

        {/* VIEW 2: DEDICATED PRE-PRAYER ALERTS (تبويب التنبيهات مع القائمة المنسدلة والدقائق المخصصة) */}
        {activeView === 'alerts' && (
          <div className="animate-fade-in">
            <AlertsTabSection
              alerts={settings.approachingAlerts || []}
              onUpdateAlerts={(newAlerts) =>
                handleSaveSettings({
                  ...settings,
                  approachingAlerts: newAlerts,
                })
              }
              onOpenPrayersView={() => setActiveView('prayers')}
            />
          </div>
        )}

        {/* VIEW 3: DEDICATED ADHAN & PHONE MEDIA PICKER (تبويب الأذان واختيار الصوت والصورة من الهاتف) */}
        {activeView === 'adhan' && (
          <div className="animate-fade-in">
            <AdhanTabSection
              settings={settings}
              onUpdateSettings={handleSaveSettings}
              onPlayAdhan={handlePlayAdhan}
            />
          </div>
        )}

        {/* VIEW 4: Hisn Al-Muslim & Daily Athkar */}
        {activeView === 'adhkar' && (
          <div className="animate-fade-in">
            <HisnAlMuslimSection onOpenSalawat={() => setActiveView('salawat')} />
          </div>
        )}

        {/* VIEW 5: Dedicated Salawat Corner */}
        {activeView === 'salawat' && (
          <div className="animate-fade-in">
            <SalawatCorner
              salawat={settings.salawat}
              onUpdateSalawat={(updated) =>
                handleSaveSettings({
                  ...settings,
                  salawat: {
                    ...settings.salawat,
                    ...updated,
                  },
                })
              }
              onTriggerVoiceReminder={triggerSalawatReminder}
            />
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-white/10 bg-neutral-950/80 backdrop-blur-md py-5 text-center text-xs text-white/50 mb-6 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white/70 font-medium">
            <span className="text-emerald-400 font-bold text-sm">{t.appName}</span>
            <span>•</span>
            <span className="text-white/60">{t.digitalMosqueClock}</span>
            <span>•</span>
            <span className="text-white/40">Electronic Adhan Clock</span>
          </div>
          <p className="text-emerald-300 font-serif text-sm">
            «حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ»
          </p>
        </div>
      </footer>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeView={activeView}
        onChangeView={(v) => setActiveView(v)}
        onOpenQibla={() => setIsQiblaOpen(true)}
        onOpenTasbeeh={() => setIsTasbeehOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onOpenSettings={() => handleOpenSettings(0)}
        alertsCount={activeAlertsCount}
        language={currentLang}
      />

      {/* Settings Modal (6 Complete Tabs: Language, Location/Calc, Alerts, Adhan, Musaharati, Display) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        initialTab={settingsInitialTab}
        initialPrayerKey={settingsInitialPrayerKey}
        onPlayAdhan={handlePlayAdhan}
        onTriggerTestMusaharati={() => setIsMusaharatiModalOpen(true)}
      />

      {/* Adhan Video Modal (صوت وصورة فيديو) */}
      <AdhanVideoModal
        isOpen={adhanModal.isOpen}
        onClose={() => setAdhanModal({ ...adhanModal, isOpen: false })}
        prayerKey={adhanModal.prayerKey}
        settings={settings}
      />

      {/* Musaharati Awakening Modal (Ramadan / Suhoor) */}
      <MusaharatiModal
        isOpen={isMusaharatiModalOpen}
        onClose={() => setIsMusaharatiModalOpen(false)}
        settings={settings.musaharati || {
          enabled: true,
          timingMode: 'relative_fajr',
          minutesBeforeFajr: 60,
          soundSource: 'preset',
          onlyInRamadan: true,
          volume: 0.85,
        }}
        language={currentLang}
      />

      {/* Full Screen Approaching Alert Modal */}
      {activeFullScreenAlert && (
        <FullScreenAlertModal
          isOpen={true}
          alert={activeFullScreenAlert.alert}
          prayerName={activeFullScreenAlert.prayerName}
          onDismiss={() => setActiveFullScreenAlert(null)}
          language={currentLang}
        />
      )}

      {/* Onboarding Wizard Modal on first run */}
      <OnboardingModal
        isOpen={!settings.onboardingCompleted}
        settings={settings}
        onFinish={(newSettings) => handleSaveSettings(newSettings)}
      />

      {/* Qibla Compass Modal */}
      <QiblaCompassModal
        isOpen={isQiblaOpen}
        onClose={() => setIsQiblaOpen(false)}
        settings={settings}
      />

      {/* Monthly Calendar Modal */}
      <MonthlyCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        settings={settings}
      />

      {/* Electronic Tasbeeh Modal */}
      <ElectronicTasbeehModal
        isOpen={isTasbeehOpen}
        onClose={() => setIsTasbeehOpen(false)}
      />

      {/* Approaching Alert Toast Notification */}
      <ApproachingAlertNotification
        alert={activeApproachingAlert?.alert || null}
        prayerNameAr={activeApproachingAlert?.prayerName || ''}
        onDismiss={() => setActiveApproachingAlert(null)}
      />

      {/* Salawat Popup Reminder */}
      <SalawatPopupReminder
        isOpen={showSalawatPopup}
        onDismiss={() => setShowSalawatPopup(false)}
        onIncrement={() =>
          handleSaveSettings({
            ...settings,
            salawat: {
              ...settings.salawat,
              todayCount: settings.salawat.todayCount + 1,
              totalCount: settings.salawat.totalCount + 1,
            },
          })
        }
        formula={settings.salawat.selectedFormula}
        count={settings.salawat.todayCount}
      />
    </div>
  );
}
