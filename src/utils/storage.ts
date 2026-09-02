import { AppSettings, ApproachingAlertItem, PrayerAdhanConfig, PrayerKey } from '../types';
import { POPULAR_CITIES } from './citiesDatabase';

const STORAGE_KEY = 'accurate_adhan_app_settings_v2';

export const DEFAULT_APPROACHING_ALERTS: ApproachingAlertItem[] = [
  {
    id: 'fajr-1',
    prayer: 'fajr',
    minutesBefore: 30,
    label: 'الاستيقاظ لصلاة الفجر وركعتي الفجر',
    enabled: true,
    soundType: 'gentle_bell',
    fullScreenAlert: true,
  },
  {
    id: 'fajr-2',
    prayer: 'fajr',
    minutesBefore: 10,
    label: 'اقتراب دخول وقت صلاة الفجر',
    enabled: true,
    soundType: 'beep',
    fullScreenAlert: false,
  },
  {
    id: 'dhuhr-1',
    prayer: 'dhuhr',
    minutesBefore: 15,
    label: 'الاستعداد والوضوء لصلاة الظهر',
    enabled: true,
    soundType: 'gentle_bell',
    fullScreenAlert: false,
  },
  {
    id: 'asr-1',
    prayer: 'asr',
    minutesBefore: 15,
    label: 'الاستعداد لصلاة العصر والتأهب',
    enabled: true,
    soundType: 'gentle_bell',
    fullScreenAlert: false,
  },
  {
    id: 'maghrib-1',
    prayer: 'maghrib',
    minutesBefore: 15,
    label: 'ساعة استجابة الدعاء قبل المغرب وسنة الصلاة',
    enabled: true,
    soundType: 'tasbeeh',
    fullScreenAlert: true,
  },
  {
    id: 'isha-1',
    prayer: 'isha',
    minutesBefore: 15,
    label: 'الاستعداد لصلاة العشاء والوتر',
    enabled: true,
    soundType: 'gentle_bell',
    fullScreenAlert: false,
  },
  {
    id: 'jumuah-1',
    prayer: 'jumuah',
    minutesBefore: 60,
    label: 'التذكير بسورة الكهف والتبكير لصلاة الجمعة',
    enabled: true,
    soundType: 'takbeer',
    fullScreenAlert: true,
  },
];

const createDefaultAdhanConfig = (muazzinId: string, isSpecialFajr: boolean = false): PrayerAdhanConfig => ({
  enabled: true,
  type: 'video',
  muazzinId: isSpecialFajr ? 'fajr_special' : muazzinId,
  volume: 0.9,
});

export const DEFAULT_ADHAN_CONFIG: Record<PrayerKey, PrayerAdhanConfig> = {
  fajr: createDefaultAdhanConfig('fajr_special', true),
  sunrise: { enabled: false, type: 'audio', muazzinId: 'makkah', volume: 0.5 },
  dhuhr: createDefaultAdhanConfig('makkah'),
  asr: createDefaultAdhanConfig('madinah'),
  maghrib: createDefaultAdhanConfig('abdulbasit'),
  isha: createDefaultAdhanConfig('alafasy'),
  jumuah: createDefaultAdhanConfig('alaqsa'),
  qiyam: { enabled: false, type: 'audio', muazzinId: 'madinah', volume: 0.5 },
};

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar',
  themeMode: 'dark',
  onboardingCompleted: true, // will trigger if not set in storage

  city: POPULAR_CITIES[0], // Cairo default, customizable to any city or GPS
  method: 'Egyptian',
  madhab: 'Shafi',
  dstOffsetHours: 0,
  manualOffsets: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  hijriOffsetDays: 0,

  displayOptions: {
    showSunrise: true,
    showMidnight: true,
    showQiyam: true,
    showSuhoor: true,
    showDuha: false,
  },

  approachingAlerts: DEFAULT_APPROACHING_ALERTS,
  adhanConfig: DEFAULT_ADHAN_CONFIG,

  musaharati: {
    enabled: true,
    timingMode: 'relative_fajr',
    minutesBeforeFajr: 60,
    fixedTime: '03:00',
    soundSource: 'preset',
    presetId: 'ya_nayem',
    volume: 0.9,
    onlyInRamadan: true,
  },

  salawat: {
    enabled: true,
    intervalMinutes: 15,
    soundType: 'voice_1',
    dailyTarget: 300,
    todayCount: 0,
    totalCount: 0,
    lastReminderTimestamp: Date.now(),
    selectedFormula: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ',
  },

  notificationsEnabled: true,
  twentyFourHourFormat: false,
  autoSilentDuringPrayer: true,
  silentDurationMinutes: 20,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      displayOptions: {
        ...DEFAULT_SETTINGS.displayOptions,
        ...(parsed.displayOptions || {}),
      },
      musaharati: {
        ...DEFAULT_SETTINGS.musaharati,
        ...(parsed.musaharati || {}),
      },
      manualOffsets: {
        ...DEFAULT_SETTINGS.manualOffsets,
        ...(parsed.manualOffsets || {}),
      },
      adhanConfig: {
        ...DEFAULT_SETTINGS.adhanConfig,
        ...(parsed.adhanConfig || {}),
      },
      salawat: {
        ...DEFAULT_SETTINGS.salawat,
        ...(parsed.salawat || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
