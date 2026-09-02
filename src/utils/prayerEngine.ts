import { Coordinates, CalculationMethod, CalculationParameters, Madhab, PrayerTimes, SunnahTimes } from 'adhan';
import { AppSettings, CalculationMethodKey, HijriDateInfo, Language, PrayerKey, PrayerTimeItem } from '../types';
import { TRANSLATIONS } from './translations';

export function getCalculationMethodParams(methodKey: CalculationMethodKey): CalculationParameters {
  switch (methodKey) {
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'UmmAlQura':
      return CalculationMethod.UmmAlQura();
    case 'MuslimWorldLeague':
      return CalculationMethod.MuslimWorldLeague();
    case 'NorthAmerica':
      return CalculationMethod.NorthAmerica();
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'Dubai':
      return CalculationMethod.Dubai();
    case 'Qatar':
      return CalculationMethod.Qatar();
    case 'Kuwait':
      return CalculationMethod.Kuwait();
    case 'MoonsightingCommittee':
      return CalculationMethod.MoonsightingCommittee();
    case 'Singapore':
      return CalculationMethod.Singapore();
    case 'Turkey':
      return CalculationMethod.Turkey();
    case 'Tehran':
      return CalculationMethod.Tehran();
    case 'France': {
      // UOIF 12 degrees
      const params = new CalculationParameters('Other', 12, 12);
      return params;
    }
    case 'Russia': {
      const params = new CalculationParameters('Other', 16, 15);
      return params;
    }
    case 'JAKIM': {
      const params = new CalculationParameters('Other', 20, 18);
      return params;
    }
    default:
      return CalculationMethod.MuslimWorldLeague();
  }
}

export function calculatePrayerTimes(date: Date, settings: AppSettings): {
  items: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  currentPrayer: PrayerTimeItem | null;
  qiyamTime: Date;
  midnightTime: Date;
  suhoorTime: Date;
  duhaTime: Date;
  rawPrayerTimes: PrayerTimes;
} {
  const { lat, lng } = settings.city;
  const coordinates = new Coordinates(lat, lng);
  const params = getCalculationMethodParams(settings.method);

  // Set Madhab
  params.madhab = settings.madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  // Apply manual offsets in minutes
  params.adjustments.fajr = settings.manualOffsets.fajr;
  params.adjustments.sunrise = settings.manualOffsets.sunrise;
  params.adjustments.dhuhr = settings.manualOffsets.dhuhr;
  params.adjustments.asr = settings.manualOffsets.asr;
  params.adjustments.maghrib = settings.manualOffsets.maghrib;
  params.adjustments.isha = settings.manualOffsets.isha;

  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  // Adjust for DST if manually set
  const applyDstOffset = (d: Date | null) => {
    if (!d) return new Date();
    if (settings.dstOffsetHours !== 0) {
      return new Date(d.getTime() + settings.dstOffsetHours * 3600000);
    }
    return d;
  };

  const isFriday = date.getDay() === 5;

  const fajrTime = applyDstOffset(prayerTimes.fajr);
  const sunriseTime = applyDstOffset(prayerTimes.sunrise);
  const dhuhrTime = applyDstOffset(prayerTimes.dhuhr);
  const asrTime = applyDstOffset(prayerTimes.asr);
  const maghribTime = applyDstOffset(prayerTimes.maghrib);
  const ishaTime = applyDstOffset(prayerTimes.isha);
  const qiyamTime = applyDstOffset(sunnahTimes.lastThirdOfTheNight);
  const midnightTime = applyDstOffset(sunnahTimes.middleOfTheNight);

  // Extra sunnah times
  const suhoorTime = new Date(fajrTime.getTime() - (settings.musaharati?.minutesBeforeFajr || 60) * 60000);
  const duhaTime = new Date(sunriseTime.getTime() + 15 * 60000);

  const now = new Date();
  const lang = settings.language || 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;

  // Create list of main prayers
  const rawList: { key: PrayerKey; nameAr: string; name: string; time: Date }[] = [
    { key: 'fajr', nameAr: 'الفجر', name: t.prayers.fajr, time: fajrTime },
    { key: 'sunrise', nameAr: 'الشروق', name: t.prayers.sunrise, time: sunriseTime },
    { key: isFriday ? 'jumuah' : 'dhuhr', nameAr: isFriday ? 'الجمعة' : 'الظهر', name: isFriday ? t.prayers.jumuah : t.prayers.dhuhr, time: dhuhrTime },
    { key: 'asr', nameAr: 'العصر', name: t.prayers.asr, time: asrTime },
    { key: 'maghrib', nameAr: 'المغرب', name: t.prayers.maghrib, time: maghribTime },
    { key: 'isha', nameAr: 'العشاء', name: t.prayers.isha, time: ishaTime },
  ];

  // Determine next & current
  let nextKey: PrayerKey | null = null;
  let minDiff = Infinity;

  // Check today's upcoming
  for (const p of rawList) {
    const diff = p.time.getTime() - now.getTime();
    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      nextKey = p.key;
    }
  }

  // If all today have passed, next is tomorrow's Fajr
  if (!nextKey) {
    nextKey = 'fajr';
  }

  const items: PrayerTimeItem[] = rawList.map((p) => {
    const diffSeconds = Math.floor((p.time.getTime() - now.getTime()) / 1000);
    const isNext = p.key === nextKey;
    const isPassed = p.time.getTime() < now.getTime();
    
    // Check attached alerts
    const alerts = (settings.approachingAlerts || []).filter(
      (a) => (a.prayer === p.key || (p.key === 'jumuah' && a.prayer === 'jumuah') || (p.key === 'dhuhr' && a.prayer === 'dhuhr')) && a.enabled
    );

    const prayerConfigKey = p.key === 'jumuah' ? 'jumuah' : p.key;
    const adhanCfg = settings.adhanConfig?.[prayerConfigKey] || settings.adhanConfig?.dhuhr;

    return {
      key: p.key,
      name: p.name,
      nameAr: p.nameAr,
      time: p.time,
      formattedTime: formatTimeDisplay(p.time, settings.twentyFourHourFormat, lang),
      isNext,
      isCurrent: false,
      isPassed,
      remainingSeconds: diffSeconds,
      alertsCount: alerts.length,
      adhanEnabled: adhanCfg?.enabled ?? true,
      adhanType: adhanCfg?.type || 'video',
    };
  });

  // Determine currently active prayer window
  for (let i = 0; i < items.length; i++) {
    const current = items[i];
    const next = items[i + 1];
    if (now >= current.time && (!next || now < next.time)) {
      current.isCurrent = true;
      break;
    }
  }

  const nextPrayer = items.find((i) => i.isNext) || null;
  const currentPrayer = items.find((i) => i.isCurrent) || null;

  return {
    items,
    nextPrayer,
    currentPrayer,
    qiyamTime,
    midnightTime,
    suhoorTime,
    duhaTime,
    rawPrayerTimes: prayerTimes,
  };
}

export function formatTimeDisplay(date: Date, twentyFourHour: boolean = false, lang: Language = 'ar'): string {
  if (twentyFourHour) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  let period = '';
  
  if (lang === 'ar') {
    period = hours >= 12 ? 'م' : 'ص';
  } else if (lang === 'fr') {
    period = hours >= 12 ? 'PM' : 'AM';
  } else {
    period = hours >= 12 ? 'PM' : 'AM';
  }
  
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${period}`;
}

const HIJRI_MONTHS_TRANSLATIONS: Record<Language, string[]> = {
  ar: [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ],
  en: [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani',
    'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ],
  fr: [
    'Mouharram', 'Safar', 'Rabi al-Awwal', 'Rabi ath-Thani', 'Joumada al-Oula', 'Joumada ath-Thania',
    'Rajab', 'Cha\'ban', 'Ramadan', 'Chawwal', 'Dhou al-Qi\'da', 'Dhou al-Hijja'
  ]
};

export function getHijriDate(date: Date, offsetDays: number = 0, lang: Language = 'ar'): HijriDateInfo {
  const targetDate = new Date(date.getTime() + offsetDays * 86400000);
  
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
    const parts = formatter.formatToParts(targetDate);
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);
    const monthNameAr = parts.find(p => p.type === 'month')?.value || '';
    const yearStr = parts.find(p => p.type === 'year')?.value || '1448';
    const year = parseInt(yearStr.replace(/[^\d]/g, ''), 10) || 1448;

    const arabicMonths = HIJRI_MONTHS_TRANSLATIONS.ar;
    let monthIndex = arabicMonths.indexOf(monthNameAr);
    if (monthIndex < 0) monthIndex = 0;

    const monthName = HIJRI_MONTHS_TRANSLATIONS[lang]?.[monthIndex] || monthNameAr;
    const suffix = lang === 'ar' ? 'هـ' : (lang === 'fr' ? 'AH' : 'AH');

    return {
      day,
      monthNumber: monthIndex + 1,
      monthName,
      monthNameAr,
      year,
      formatted: `${day} ${monthName} ${year} ${suffix}`,
    };
  } catch {
    const defaultMonth = HIJRI_MONTHS_TRANSLATIONS[lang]?.[2] || 'ربيع الأول';
    return {
      day: 15,
      monthNumber: 3,
      monthName: defaultMonth,
      monthNameAr: 'ربيع الأول',
      year: 1448,
      formatted: `15 ${defaultMonth} 1448`,
    };
  }
}

export function getMonthlyCalendar(year: number, month: number, settings: AppSettings) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = [];
  const lang = settings.language || 'ar';
  const localeStr = lang === 'ar' ? 'ar-EG' : (lang === 'fr' ? 'fr-FR' : 'en-US');

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d, 12, 0, 0);
    const calculated = calculatePrayerTimes(date, settings);
    const hijri = getHijriDate(date, settings.hijriOffsetDays, lang);
    const dayName = new Intl.DateTimeFormat(localeStr, { weekday: 'long' }).format(date);

    rows.push({
      day: d,
      date,
      dayName,
      hijriFormatted: `${hijri.day} ${hijri.monthName}`,
      fajr: calculated.items.find(p => p.key === 'fajr')?.formattedTime || '',
      sunrise: calculated.items.find(p => p.key === 'sunrise')?.formattedTime || '',
      dhuhr: calculated.items.find(p => p.key === 'dhuhr' || p.key === 'jumuah')?.formattedTime || '',
      asr: calculated.items.find(p => p.key === 'asr')?.formattedTime || '',
      maghrib: calculated.items.find(p => p.key === 'maghrib')?.formattedTime || '',
      isha: calculated.items.find(p => p.key === 'isha')?.formattedTime || '',
      qiyam: formatTimeDisplay(calculated.qiyamTime, settings.twentyFourHourFormat, lang),
      midnight: formatTimeDisplay(calculated.midnightTime, settings.twentyFourHourFormat, lang),
    });
  }

  return rows;
}
