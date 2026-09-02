export type Language = 'ar' | 'en' | 'fr';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumuah' | 'qiyam';

export type CalculationMethodKey = 
  | 'Egyptian' 
  | 'UmmAlQura' 
  | 'MuslimWorldLeague' 
  | 'NorthAmerica' 
  | 'Karachi' 
  | 'Dubai' 
  | 'Qatar' 
  | 'Kuwait' 
  | 'MoonsightingCommittee' 
  | 'Singapore' 
  | 'Turkey' 
  | 'Tehran'
  | 'France'
  | 'Russia'
  | 'JAKIM';

export type MadhabKey = 'Shafi' | 'Hanafi';

export interface CityInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr?: string;
  countryAr: string;
  countryEn: string;
  countryFr?: string;
  countryCode: string;
  lat: number;
  lng: number;
  timezone: string;
  recommendedMethod: CalculationMethodKey;
  isCustom?: boolean;
}

export interface ManualOffsets {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export type AlertTimingType = 'relative' | 'fixed_time';

export type AlertSoundType = 
  | 'gentle_bell' 
  | 'takbeer' 
  | 'iqama' 
  | 'makkah_chime' 
  | 'duaa_tone' 
  | 'tasbeeh' 
  | 'beep' 
  | 'soft_gong' 
  | 'voice_reminder' 
  | 'voice_fajr' 
  | 'voice_kahf' 
  | 'voice_wudu';

export interface ApproachingAlertItem {
  id: string;
  prayer: PrayerKey;
  timingType?: AlertTimingType;
  minutesBefore: number; // custom freely entered minutes
  fixedTime?: string; // e.g. "04:30"
  label: string;
  enabled: boolean;
  soundType: AlertSoundType;
  customAudioUrl?: string; // Stored in IndexedDB from phone
  customAudioName?: string;
  volume?: number; // 0.1 to 1.0
  vibrate?: boolean;
  fullScreenAlert?: boolean; // full screen alert screen trigger
}

export interface PrayerAdhanConfig {
  enabled: boolean;
  type: 'video' | 'audio';
  muazzinId: string;
  customMediaUrl?: string; // Stored in IndexedDB from phone
  customMediaName?: string;
  customMediaType?: 'video' | 'audio';
  volume: number;
}

export interface MusaharatiSettings {
  enabled: boolean;
  timingMode: 'relative_fajr' | 'fixed_time';
  minutesBeforeFajr: number; // default: 60
  fixedTime: string; // default: "03:00"
  soundSource: 'preset' | 'custom_phone';
  presetId: 'ya_nayem' | 'sahur_drum' | 'traditional_chant' | 'makkah_sahur';
  customMediaUrl?: string;
  customMediaName?: string;
  customMediaType?: 'audio' | 'video';
  volume: number; // 0.1 to 1.0
  onlyInRamadan: boolean;
}

export interface SalawatSettings {
  enabled: boolean;
  intervalMinutes: number;
  soundType: 'voice_1' | 'voice_2' | 'soft_tone' | 'chime' | 'silent';
  dailyTarget: number;
  todayCount: number;
  totalCount: number;
  lastReminderTimestamp: number;
  selectedFormula: string;
}

export interface ExtraDisplayOptions {
  showSunrise: boolean;
  showMidnight: boolean;
  showQiyam: boolean;
  showSuhoor: boolean;
  showDuha: boolean;
}

export interface AppSettings {
  language: Language;
  themeMode: 'dark' | 'light';
  onboardingCompleted: boolean;

  city: CityInfo;
  method: CalculationMethodKey;
  madhab: MadhabKey;
  dstOffsetHours: number;
  manualOffsets: ManualOffsets;
  hijriOffsetDays: number;
  
  // Display preferences
  displayOptions: ExtraDisplayOptions;

  // Alerts
  approachingAlerts: ApproachingAlertItem[];
  
  // Adhan
  adhanConfig: Record<PrayerKey, PrayerAdhanConfig>;

  // Musaharati - Ramadan
  musaharati: MusaharatiSettings;
  
  // Salawat
  salawat: SalawatSettings;
  
  // General
  notificationsEnabled: boolean;
  twentyFourHourFormat: boolean;
  autoSilentDuringPrayer: boolean;
  silentDurationMinutes: number;
}

export interface PrayerTimeItem {
  key: PrayerKey;
  name: string; // Localized name
  nameAr: string;
  time: Date;
  formattedTime: string;
  isNext: boolean;
  isCurrent: boolean;
  isPassed: boolean;
  remainingSeconds: number;
  alertsCount: number;
  adhanEnabled: boolean;
  adhanType: 'video' | 'audio';
}

export interface HijriDateInfo {
  day: number;
  monthNumber: number;
  monthName: string; // Localized
  monthNameAr: string;
  year: number;
  formatted: string;
}
