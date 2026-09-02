import { PrayerKey } from '../types';

export interface PrayerVisualInfo {
  key: PrayerKey | 'all';
  nameAr: string;
  shortName: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  spiritualQuote: string;
  colorAccent: string;
}

export const PRAYER_VISUALS: Record<PrayerKey | 'all', PrayerVisualInfo> = {
  all: {
    key: 'all',
    nameAr: 'جميع الصلوات الخمس',
    shortName: 'كل الصلوات',
    subtitle: 'تطبيق التنبيه على كل الصلوات المكتوبة',
    description: 'تنبيه موحد للاستعداد والتأهب قبل صلوات اليوم والليلة',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا»',
    colorAccent: 'from-emerald-900/80 to-teal-950/90',
  },
  fajr: {
    key: 'fajr',
    nameAr: 'صلاة الفجر',
    shortName: 'الفجر',
    subtitle: 'سكون السحر وركعتا الفجر خير من الدنيا وما فيها',
    description: 'تنبيه الاستيقاظ المبكر وسنة الفجر وقراءة أذكار الصباح',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا»',
    colorAccent: 'from-sky-950/80 to-indigo-950/90',
  },
  sunrise: {
    key: 'sunrise',
    nameAr: 'الشروق وصلاة الضحى',
    shortName: 'الضحى',
    subtitle: 'بزوغ الضياء وصلاة الأوابين',
    description: 'تنبيه صلاة الضحى واستفتاح أعمال اليوم بذكر الله',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«يُصْبِحُ عَلَى كُلِّ سُلَامَى مِنْ أَحَدِكُمْ صَدَقَةٌ»',
    colorAccent: 'from-amber-950/80 to-orange-950/90',
  },
  dhuhr: {
    key: 'dhuhr',
    nameAr: 'صلاة الظهر',
    shortName: 'الظهر',
    subtitle: 'زوال الشمس وانفتاح أبواب السماء',
    description: 'تنبيه إيقاف العمل والاستعداد للوضوء وسنة الظهر الراتبة',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«إِنَّهَا سَاعَةٌ تُفْتَحُ فِيهَا أَبْوَابُ السَّمَاءِ»',
    colorAccent: 'from-yellow-950/80 to-stone-900/90',
  },
  asr: {
    key: 'asr',
    nameAr: 'صلاة العصر',
    shortName: 'العصر',
    subtitle: 'الصلاة الوسطى واجتماع ملائكة الليل والنهار',
    description: 'تنبيه الصلاة الوسطى والتأهب لتكبيرة الإحرام في المسجد',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ»',
    colorAccent: 'from-amber-900/80 to-stone-900/90',
  },
  maghrib: {
    key: 'maghrib',
    nameAr: 'صلاة المغرب',
    shortName: 'المغرب',
    subtitle: 'غروب الشمس وساعة استجابة الدعاء',
    description: 'تنبيه ساعة الإجابة قبل الغروب وإفطار الصائم والسنن',
    imageUrl: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«إِذَا أَقْبَلَ اللَّيْلُ مِنْ هَا هُنَا وَأَدْبَرَ النَّهَارُ»',
    colorAccent: 'from-rose-950/80 to-purple-950/90',
  },
  isha: {
    key: 'isha',
    nameAr: 'صلاة العشاء',
    shortName: 'العشاء',
    subtitle: 'أجواء الحرم المكي الشريف والوتر قبل النوم',
    description: 'تنبيه صلاة العشاء وصلاة الوتر وقراءة سورة الملك',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ»',
    colorAccent: 'from-blue-950/80 to-slate-950/90',
  },
  jumuah: {
    key: 'jumuah',
    nameAr: 'صلاة الجمعة المباركة',
    shortName: 'الجمعة',
    subtitle: 'عيد الأسبوع وساعة الإجابة وسورة الكهف',
    description: 'تنبيه الاغتسال والتطيب والتبكير إلى الجامع وسماع الخطبة',
    imageUrl: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ»',
    colorAccent: 'from-emerald-950/80 to-stone-900/90',
  },
  qiyam: {
    key: 'qiyam',
    nameAr: 'قيام الليل والتهجد',
    shortName: 'قيام الليل',
    subtitle: 'النزول الإلهي في الثلث الأخير والاستغفار بالأسحار',
    description: 'تنبيه ركعات الوتر والتهجد ومناجاة الله وسؤال المغفرة',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80',
    spiritualQuote: '«يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا»',
    colorAccent: 'from-violet-950/80 to-indigo-950/90',
  },
};
