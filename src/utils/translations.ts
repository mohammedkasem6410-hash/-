import { CalculationMethodKey, Language, MadhabKey, PrayerKey } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  appDescription: string;
  
  // Navigation / Views
  navPrayers: string;
  navAlerts: string;
  navAdhan: string;
  navMusaharati: string;
  navAdhkar: string;
  navSalawat: string;
  navSettings: string;
  navQibla: string;
  navCalendar: string;
  navTasbeeh: string;

  // Main screen
  digitalMosqueClock: string;
  nextPrayer: string;
  timeRemaining: string;
  currentPrayer: string;
  hijriDate: string;
  gregorianDate: string;
  locationGPS: string;
  locationAuto: string;
  locationManual: string;
  hoursShort: string;
  minutesShort: string;
  secondsShort: string;
  nowIsPrayerTime: string;
  prayTimeHasCome: string;
  
  // Prayers
  prayers: Record<PrayerKey, string>;
  extraTimes: {
    sunrise: string;
    midnight: string;
    qiyam: string;
    suhoor: string;
    duha: string;
  };
  
  // Settings Tabs
  tabLanguage: string;
  tabLocationCalc: string;
  tabAlerts: string;
  tabAdhan: string;
  tabMusaharati: string;
  tabDisplay: string;
  
  // Settings - Language
  selectLanguage: string;
  arabicLang: string;
  englishLang: string;
  frenchLang: string;
  
  // Settings - Location & Calculation
  locationTitle: string;
  locationDesc: string;
  useGpsButton: string;
  locatingGps: string;
  searchCityPlaceholder: string;
  country: string;
  city: string;
  customCoordinates: string;
  latitude: string;
  longitude: string;
  saveCustomLocation: string;
  currentActiveLocation: string;
  calculationMethodsTitle: string;
  calculationMethodsDesc: string;
  asrSchoolTitle: string;
  asrStandard: string;
  asrHanafi: string;
  manualOffsetsTitle: string;
  manualOffsetsDesc: string;
  resetDefaultOffsets: string;
  dstTitle: string;
  dstStandard: string;
  dstDaylight: string;
  hijriOffsetTitle: string;
  days: string;
  
  // Settings - Alerts
  alertsTitle: string;
  alertsDesc: string;
  unlimitedAlertsBadge: string;
  addAlert: string;
  editAlert: string;
  saveAlert: string;
  cancel: string;
  deleteAlert: string;
  duplicateAlert: string;
  alertPrayerSelect: string;
  allPrayersOption: string;
  alertMinutesFreeInput: string;
  minutesBeforePrayer: string;
  minutesFreePlaceholder: string;
  alertSoundTitle: string;
  chooseAudioFromPhone: string;
  changeAudioPhone: string;
  presetSoundTitle: string;
  testSound: string;
  stopSound: string;
  alertLabelTitle: string;
  alertLabelPlaceholder: string;
  enableAlertToggle: string;
  vibratePhone: string;
  volumeLabel: string;
  fullScreenAlertToggle: string;
  fullScreenAlertDesc: string;
  noAlertsFound: string;
  alertDeleted: string;
  alertSaved: string;
  snooze5Min: string;
  dismissAlert: string;

  // Settings - Adhan
  adhanTitle: string;
  adhanDesc: string;
  fajrSpecialAdhan: string;
  dhuhrAdhan: string;
  asrAdhan: string;
  maghribAdhan: string;
  ishaAdhan: string;
  jumuahAdhan: string;
  chooseFileFromPhone: string;
  supportedFormats: string;
  videoAudioNotice: string;
  previewAdhan: string;
  changeFile: string;
  deleteCustomFile: string;
  resetDefaultMuazzin: string;
  muazzinPresets: string;
  adhanEnabled: string;
  adhanTypeVideo: string;
  adhanTypeAudio: string;

  // Settings - Musaharati (Ramadan)
  musaharatiTitle: string;
  musaharatiDesc: string;
  enableMusaharati: string;
  musaharatiTimingMode: string;
  relativeFajrOption: string;
  fixedTimeOption: string;
  minutesBeforeFajrLabel: string;
  exactTimeLabel: string;
  musaharatiSoundPhone: string;
  musaharatiPresetSound: string;
  onlyInRamadanNotice: string;
  testMusaharati: string;
  musaharatiPresets: {
    ya_nayem: string;
    sahur_drum: string;
    traditional_chant: string;
    makkah_sahur: string;
  };
  
  // Display & Appearance
  themeTitle: string;
  darkMode: string;
  lightMode: string;
  twentyFourHourFormat: string;
  twelveHourFormat: string;
  showSunriseToggle: string;
  showMidnightToggle: string;
  showQiyamToggle: string;
  
  // First Run Onboarding
  welcomeTitle: string;
  welcomeDesc: string;
  stepLanguage: string;
  stepLocation: string;
  stepMethod: string;
  stepAlerts: string;
  startUsingApp: string;
  nextStep: string;
  prevStep: string;

  // Common UI
  close: string;
  save: string;
  settings: string;
  loading: string;
  success: string;
  error: string;
  enabled: string;
  disabled: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ar: {
    appName: 'المؤذن الإلكتروني',
    appSubtitle: 'ساعة المسجد الإلكترونية ومواقيت الصلاة الدقيقة',
    appDescription: 'مواقيت دقيقة محسوبة محلياً، تنبيهات مخصصة غير محدودة، وتخصيص صوت الأذان والمسحراتي من هاتفك.',
    
    navPrayers: 'المواقيت',
    navAlerts: 'التنبيهات',
    navAdhan: 'الأذان',
    navMusaharati: 'المسحراتي',
    navAdhkar: 'الأذكار',
    navSalawat: 'الصلاة على النبي',
    navSettings: 'الإعدادات',
    navQibla: 'القبلة',
    navCalendar: 'التقويم',
    navTasbeeh: 'المسبحة',

    digitalMosqueClock: 'ساعة المسجد الإلكترونية',
    nextPrayer: 'الصلاة القادمة',
    timeRemaining: 'الوقت المتبقي حتى الأذان',
    currentPrayer: 'الصلاة الحالية',
    hijriDate: 'التاريخ الهجري',
    gregorianDate: 'التاريخ الميلادي',
    locationGPS: 'موقعك عبر GPS',
    locationAuto: 'تحديد تلقائي',
    locationManual: 'تحديد يدوي',
    hoursShort: 'ساعة',
    minutesShort: 'دقيقة',
    secondsShort: 'ثانية',
    nowIsPrayerTime: 'حان الآن موعد الأذان',
    prayTimeHasCome: 'أقم الصلاة إن الصلاة كانت على المؤمنين كتاباً موقوتاً',

    prayers: {
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء',
      jumuah: 'الجمعة',
      qiyam: 'قيام الليل',
    },

    extraTimes: {
      sunrise: 'الشروق',
      midnight: 'منتصف الليل',
      qiyam: 'الثلث الأخير من الليل',
      suhoor: 'وقت السحور والإمساك',
      duha: 'صلاة الضحى',
    },

    tabLanguage: 'اللغة',
    tabLocationCalc: 'المكان والحساب',
    tabAlerts: 'التنبيهات',
    tabAdhan: 'الأذان',
    tabMusaharati: 'المسحراتي',
    tabDisplay: 'المظهر والعرض',

    selectLanguage: 'اختر لغة التطبيق:',
    arabicLang: 'العربية (Arabic)',
    englishLang: 'English (الإنجليزية)',
    frenchLang: 'Français (الفرنسية)',

    locationTitle: 'تحديد الموقع الجغرافي',
    locationDesc: 'اختر موقعك تلقائياً عبر GPS أو حدد المدينة والدولة يدوياً لضبط مواقيت الصلاة بدقة.',
    useGpsButton: 'تحديد موقعي تلقائياً عبر GPS',
    locatingGps: 'جاري تحديد موقعك الجغرافي بدقة...',
    searchCityPlaceholder: 'ابحث عن اسم المدينة أو الدولة...',
    country: 'الدولة',
    city: 'المدينة',
    customCoordinates: 'إدخال إحداثيات مخصصة (خط العرض والطول)',
    latitude: 'خط العرض (Latitude)',
    longitude: 'خط الطول (Longitude)',
    saveCustomLocation: 'حفظ الإحداثيات المخصصة',
    currentActiveLocation: 'الموقع الحالي المعتمد:',
    calculationMethodsTitle: 'طريقة حساب مواقيت الصلاة',
    calculationMethodsDesc: 'يدعم التطبيق جميع الهيئات والمراكز الإسلامية الرسمية حول العالم.',
    asrSchoolTitle: 'مذهب حساب وقت صلاة العصر',
    asrStandard: 'الجمهور (الشافعي، المالكي، الحنبلي)',
    asrHanafi: 'المذهب الحنفي (ظل الشيء مثليه)',
    manualOffsetsTitle: 'ضبط المواقيت يدوياً بالدقائق',
    manualOffsetsDesc: 'يمكنك تقديم أو تأخير أي صلاة بدقائق محددة لمطابقة مسجد حيك بدقة تامة.',
    resetDefaultOffsets: 'إعادة الضبط الافتراضي (٠ دقيقة)',
    dstTitle: 'التوقيت الصيفي (DST)',
    dstStandard: 'توقيت قياسي شتوي (+0)',
    dstDaylight: 'توقيت صيفي معتمد (+1 ساعة)',
    hijriOffsetTitle: 'تعديل التاريخ الهجري (رؤية الهلال)',
    days: 'أيام',

    alertsTitle: 'نظام التنبيهات المخصص قبل الصلاة',
    alertsDesc: 'أنشئ عدداً غير محدود من التنبيهات لكل صلاة، واكتب الدقائق بحرية تامة على مزاجك، مع اختيار صوت التنبيه من هاتفك.',
    unlimitedAlertsBadge: 'عدد غير محدود من التنبيهات',
    addAlert: 'إضافة تنبيه جديد',
    editAlert: 'تعديل التنبيه',
    saveAlert: 'حفظ التنبيه',
    cancel: 'إلغاء',
    deleteAlert: 'حذف التنبيه',
    duplicateAlert: 'تكرار التنبيه',
    alertPrayerSelect: '١. اختر الصلاة:',
    allPrayersOption: 'جميع الصلوات الخمس معاً',
    alertMinutesFreeInput: '٢. اكتب مدة التنبيه قبل الأذان بالدقائق (على مزاجك):',
    minutesBeforePrayer: 'دقيقة قبل الأذان',
    minutesFreePlaceholder: 'مثال: 7، 12، 25، 40 دقيقة...',
    alertSoundTitle: '٣. صوت ونغمة التنبيه:',
    chooseAudioFromPhone: '📱 اختر ملف صوتي من هاتفك (MP3 / WAV / M4A / AAC)',
    changeAudioPhone: 'تغيير صوت الهاتف',
    presetSoundTitle: 'أو اختر نغمة إسلامية جاهزة:',
    testSound: 'تجربة الصوت',
    stopSound: 'إيقاف',
    alertLabelTitle: '٤. نص أو عنوان التنبيه:',
    alertLabelPlaceholder: 'مثال: الاستيقاظ لصلاة الفجر وقراءة أذكار الصباح',
    enableAlertToggle: 'تفعيل هذا التنبيه',
    vibratePhone: 'تفعيل اهتزاز الهاتف',
    volumeLabel: 'مستوى الصوت',
    fullScreenAlertToggle: 'إظهار شاشة تنبيه كاملة ومميزة عند حلول الوقت',
    fullScreenAlertDesc: 'تظهر شاشة روحانية كبيرة مع عداد تنازلي وزر لإيقاف أو تأجيل التنبيه.',
    noAlertsFound: 'لا توجد تنبيهات مضافة حالياً. استخدم النموذج أعلاه لإضافة أول تنبيه.',
    alertDeleted: 'تم حذف التنبيه بنجاح',
    alertSaved: 'تم حفظ التنبيه بنجاح',
    snooze5Min: 'تأجيل ٥ دقائق',
    dismissAlert: 'إيقاف التنبيه',

    adhanTitle: 'تخصيص صوت وفيديو الأذان لكل صلاة',
    adhanDesc: 'خصص صوت أو فيديو الأذان لكل صلاة بشكل مستقل من ملفات هاتفك أو اختر من كبار المؤذنين.',
    fajrSpecialAdhan: 'أذان صلاة الفجر (الصلاة خير من النوم)',
    dhuhrAdhan: 'أذان صلاة الظهر',
    asrAdhan: 'أذان صلاة العصر',
    maghribAdhan: 'أذان صلاة المغرب',
    ishaAdhan: 'أذان صلاة العشاء',
    jumuahAdhan: 'أذان صلاة الجمعة',
    chooseFileFromPhone: '📁 اختر ملف صوت أو فيديو من هاتفك',
    supportedFormats: 'يدعم جميع الصيغ: MP3, WAV, M4A, AAC, MP4, MOV, MKV',
    videoAudioNotice: 'إذا اخترت فيديو MP4/MOV، سيتم تشغيل الفيديو مع الصوت في شاشة الأذان.',
    previewAdhan: 'معاينة وتشغيل الأذان',
    changeFile: 'تغيير الملف',
    deleteCustomFile: 'حذف الملف المخصص',
    resetDefaultMuazzin: 'الرجوع للمؤذن الافتراضي',
    muazzinPresets: 'المؤذنون المعتمدون في الحرمين والعالم الإسلامي',
    adhanEnabled: 'تفعيل الأذان التلقائي عند دخول الوقت',
    adhanTypeVideo: 'فيديو وصوت',
    adhanTypeAudio: 'صوت فقط',

    musaharatiTitle: 'المسحراتي — طقوس وإيقاعات شهر رمضان المبارك',
    musaharatiDesc: 'استيقظ على أصوات المسحراتي التقليدي أو خصص نغمة وفيديو من هاتفك لوقت السحور في رمضان.',
    enableMusaharati: 'تفعيل منبه المسحراتي لرمضان',
    musaharatiTimingMode: 'طريقة تحديد وقت المسحراتي:',
    relativeFajrOption: 'مدة محسوبة قبل أذان الفجر (بالدقائق)',
    fixedTimeOption: 'وقت ثابت ومحدد يومياً (مثال: 03:00 ص)',
    minutesBeforeFajrLabel: 'عدد الدقائق قبل الفجر:',
    exactTimeLabel: 'الوقت المحدد للاستيقاظ:',
    musaharatiSoundPhone: 'اختر صوت أو فيديو المسحراتي من هاتفك',
    musaharatiPresetSound: 'نغمات وإيقاعات المسحراتي التراثية:',
    onlyInRamadanNotice: 'يعمل المسحراتي تلقائياً طوال أيام شهر رمضان المبارك، ويمكنك تجربته في أي وقت.',
    testMusaharati: 'تجربة المسحراتي الآن',
    musaharatiPresets: {
      ya_nayem: 'اصحى يا نايم وحد الدايم (طبلة المسحراتي التراثية)',
      sahur_drum: 'نغمات ودقات طبلة السحور في مصر والقدس',
      traditional_chant: 'يا عباد الله وحدوا الله .. قوموا لسحوركم',
      makkah_sahur: 'نداء سحور مكة المكرمة والمدينة المنورة',
    },

    themeTitle: 'المظهر والألوان',
    darkMode: 'الوضع الليلي (Dark)',
    lightMode: 'الوضع النهاري (Light)',
    twentyFourHourFormat: 'نظام ٢٤ ساعة (14:30)',
    twelveHourFormat: 'نظام ١٢ ساعة (2:30 م)',
    showSunriseToggle: 'عرض وقت الشروق في اللوحة',
    showMidnightToggle: 'عرض منتصف الليل في اللوحة',
    showQiyamToggle: 'عرض الثلث الأخير من الليل (قيام الليل)',

    welcomeTitle: 'أهلاً بك في تطبيق المؤذن الإلكتروني',
    welcomeDesc: 'ساعتك الإلكترونية لمواقيت الصلاة الدقيقة، التنبيهات المخصصة، والأذان التلقائي.',
    stepLanguage: 'اختيار اللغة المفضلة',
    stepLocation: 'تحديد موقعك الجغرافي',
    stepMethod: 'طريقة الحساب والمذهب',
    stepAlerts: 'ضبط التنبيهات والأذان',
    startUsingApp: 'ابدأ الاستخدام الآن',
    nextStep: 'التالي',
    prevStep: 'السابق',

    close: 'إغلاق',
    save: 'حفظ التغييرات',
    settings: 'الإعدادات',
    loading: 'جاري التحميل...',
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    enabled: 'مفعل',
    disabled: 'معطل',
  },

  en: {
    appName: 'Electronic Muazzin',
    appSubtitle: 'Modern Mosque Clock & Accurate Prayer Times',
    appDescription: 'Accurately calculated offline prayer times, unlimited custom pre-prayer alerts, and custom Adhan & Musaharati from phone storage.',
    
    navPrayers: 'Times',
    navAlerts: 'Alerts',
    navAdhan: 'Adhan',
    navMusaharati: 'Musaharati',
    navAdhkar: 'Athkar',
    navSalawat: 'Salawat',
    navSettings: 'Settings',
    navQibla: 'Qibla',
    navCalendar: 'Calendar',
    navTasbeeh: 'Tasbeeh',

    digitalMosqueClock: 'Digital Mosque Clock',
    nextPrayer: 'Next Prayer',
    timeRemaining: 'Time Remaining to Adhan',
    currentPrayer: 'Current Prayer',
    hijriDate: 'Hijri Date',
    gregorianDate: 'Gregorian Date',
    locationGPS: 'GPS Location',
    locationAuto: 'Auto GPS',
    locationManual: 'Manual Location',
    hoursShort: 'h',
    minutesShort: 'm',
    secondsShort: 's',
    nowIsPrayerTime: 'It is now prayer time',
    prayTimeHasCome: 'Indeed, prayer has been decreed upon the believers a decree of specified times.',

    prayers: {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      jumuah: 'Jumuah',
      qiyam: 'Qiyam Al-Layl',
    },

    extraTimes: {
      sunrise: 'Sunrise',
      midnight: 'Midnight',
      qiyam: 'Last Third of Night',
      suhoor: 'Suhoor / Imsak',
      duha: 'Duha Prayer',
    },

    tabLanguage: 'Language',
    tabLocationCalc: 'Location & Calc',
    tabAlerts: 'Alerts',
    tabAdhan: 'Adhan',
    tabMusaharati: 'Musaharati',
    tabDisplay: 'Display & Theme',

    selectLanguage: 'Select App Language:',
    arabicLang: 'العربية (Arabic)',
    englishLang: 'English (EN)',
    frenchLang: 'Français (FR)',

    locationTitle: 'Geographic Location',
    locationDesc: 'Choose your location automatically via GPS or select country and city manually for precise prayer times.',
    useGpsButton: 'Detect my location automatically via GPS',
    locatingGps: 'Locating via GPS...',
    searchCityPlaceholder: 'Search city or country...',
    country: 'Country',
    city: 'City',
    customCoordinates: 'Enter custom coordinates (Latitude & Longitude)',
    latitude: 'Latitude',
    longitude: 'Longitude',
    saveCustomLocation: 'Save Custom Coordinates',
    currentActiveLocation: 'Current Active Location:',
    calculationMethodsTitle: 'Calculation Method',
    calculationMethodsDesc: 'Supports all major Islamic authorities and institutions worldwide.',
    asrSchoolTitle: 'Asr Calculation School (Madhab)',
    asrStandard: 'Standard (Shafi`i, Maliki, Hanbali)',
    asrHanafi: 'Hanafi (Shadow twice the length)',
    manualOffsetsTitle: 'Manual Offsets (Minutes)',
    manualOffsetsDesc: 'Fine-tune each prayer time by positive or negative minutes to match your local mosque exactly.',
    resetDefaultOffsets: 'Reset to Defaults (0 min)',
    dstTitle: 'Daylight Saving Time (DST)',
    dstStandard: 'Standard Time (+0)',
    dstDaylight: 'Daylight Saving Active (+1 Hour)',
    hijriOffsetTitle: 'Hijri Date Adjustment (Moon Sighting)',
    days: 'days',

    alertsTitle: 'Custom Pre-Prayer Alerts System',
    alertsDesc: 'Create unlimited custom alerts per prayer, freely enter any duration in minutes, and pick your notification sound directly from phone storage.',
    unlimitedAlertsBadge: 'Unlimited Custom Alerts',
    addAlert: 'Add New Alert',
    editAlert: 'Edit Alert',
    saveAlert: 'Save Alert',
    cancel: 'Cancel',
    deleteAlert: 'Delete Alert',
    duplicateAlert: 'Duplicate Alert',
    alertPrayerSelect: '1. Select Prayer:',
    allPrayersOption: 'All 5 Daily Prayers Together',
    alertMinutesFreeInput: '2. Enter duration before Adhan in minutes (Freely typed):',
    minutesBeforePrayer: 'minutes before Adhan',
    minutesFreePlaceholder: 'e.g. 7, 12, 25, 40 minutes...',
    alertSoundTitle: '3. Alert Sound & Tone:',
    chooseAudioFromPhone: '📱 Choose audio from phone (MP3 / WAV / M4A / AAC)',
    changeAudioPhone: 'Change Phone Audio',
    presetSoundTitle: 'Or select a built-in Islamic chime:',
    testSound: 'Test Sound',
    stopSound: 'Stop',
    alertLabelTitle: '4. Alert Note / Title:',
    alertLabelPlaceholder: 'e.g. Wake up for Sunnah and Wudu before Fajr',
    enableAlertToggle: 'Enable this alert',
    vibratePhone: 'Vibrate device',
    volumeLabel: 'Volume',
    fullScreenAlertToggle: 'Show dedicated full-screen alert when time comes',
    fullScreenAlertDesc: 'Displays a spiritual full-screen modal with countdown, audio playback, and snooze options.',
    noAlertsFound: 'No alerts configured yet. Use the form above to add your first alert.',
    alertDeleted: 'Alert removed successfully',
    alertSaved: 'Alert saved successfully',
    snooze5Min: 'Snooze 5 Min',
    dismissAlert: 'Dismiss',

    adhanTitle: 'Custom Adhan Audio & Video Per Prayer',
    adhanDesc: 'Customize audio or video Adhan for each prayer independently from your phone files or select renowned Muazzins.',
    fajrSpecialAdhan: 'Fajr Adhan (Prayer is better than sleep)',
    dhuhrAdhan: 'Dhuhr Adhan',
    asrAdhan: 'Asr Adhan',
    maghribAdhan: 'Maghrib Adhan',
    ishaAdhan: 'Isha Adhan',
    jumuahAdhan: 'Jumuah Adhan',
    chooseFileFromPhone: '📁 Pick audio or video file from phone storage',
    supportedFormats: 'Supports: MP3, WAV, M4A, AAC, MP4, MOV, MKV',
    videoAudioNotice: 'If an MP4/MOV video is selected, it will play video and audio on the Adhan screen.',
    previewAdhan: 'Preview & Play Adhan',
    changeFile: 'Change File',
    deleteCustomFile: 'Delete Custom File',
    resetDefaultMuazzin: 'Reset to Default Muazzin',
    muazzinPresets: 'Official Reciters from Makkah, Madinah & Al-Aqsa',
    adhanEnabled: 'Enable auto Adhan when prayer enters',
    adhanTypeVideo: 'Video & Audio',
    adhanTypeAudio: 'Audio Only',

    musaharatiTitle: 'Musaharati — Ramadan Awakening & Traditions',
    musaharatiDesc: 'Wake up to traditional Ramadan drum beats and chants, or pick custom sound/video from your device.',
    enableMusaharati: 'Enable Ramadan Musaharati Alarm',
    musaharatiTimingMode: 'Musaharati Timing Mode:',
    relativeFajrOption: 'Calculated minutes before Fajr',
    fixedTimeOption: 'Fixed exact daily time (e.g. 03:00 AM)',
    minutesBeforeFajrLabel: 'Minutes before Fajr:',
    exactTimeLabel: 'Exact wake up time:',
    musaharatiSoundPhone: 'Pick Musaharati audio/video from phone',
    musaharatiPresetSound: 'Traditional Ramadan Chants & Drum Presets:',
    onlyInRamadanNotice: 'Musaharati triggers automatically during Ramadan days, and can be tested anytime.',
    testMusaharati: 'Test Musaharati Now',
    musaharatiPresets: {
      ya_nayem: 'Wake up sleeper, praise the Eternal (Traditional Drum)',
      sahur_drum: 'Historic Cairo & Jerusalem Suhoor Drumming',
      traditional_chant: 'O servants of Allah, remember Allah.. rise for Suhoor',
      makkah_sahur: 'Makkah & Madinah Blessed Suhoor Call',
    },

    themeTitle: 'Theme & Appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    twentyFourHourFormat: '24-Hour Format (14:30)',
    twelveHourFormat: '12-Hour Format (2:30 PM)',
    showSunriseToggle: 'Display Sunrise on board',
    showMidnightToggle: 'Display Midnight on board',
    showQiyamToggle: 'Display Last Third of Night (Qiyam)',

    welcomeTitle: 'Welcome to Electronic Muazzin',
    welcomeDesc: 'Your comprehensive digital mosque clock for accurate prayer times, custom alerts, and auto Adhan.',
    stepLanguage: 'Choose Preferred Language',
    stepLocation: 'Detect / Select Location',
    stepMethod: 'Calculation Method & School',
    stepAlerts: 'Configure Alerts & Adhan',
    startUsingApp: 'Start Using App',
    nextStep: 'Next',
    prevStep: 'Previous',

    close: 'Close',
    save: 'Save Changes',
    settings: 'Settings',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    enabled: 'Enabled',
    disabled: 'Disabled',
  },

  fr: {
    appName: 'Muezzin Électronique',
    appSubtitle: 'Horloge de Mosquée & Horaires de Prière Précis',
    appDescription: 'Horaires précis calculés localement, alertes personnalisées illimitées, et choix de l\'Adhan et du Musaharati depuis votre téléphone.',
    
    navPrayers: 'Horaires',
    navAlerts: 'Alertes',
    navAdhan: 'Adhan',
    navMusaharati: 'Musaharati',
    navAdhkar: 'Invocations',
    navSalawat: 'Salawat',
    navSettings: 'Paramètres',
    navQibla: 'Qibla',
    navCalendar: 'Calendrier',
    navTasbeeh: 'Chapelet',

    digitalMosqueClock: 'Horloge Électronique de Mosquée',
    nextPrayer: 'Prochaine Prière',
    timeRemaining: 'Temps Restant avant l\'Adhan',
    currentPrayer: 'Prière Actuelle',
    hijriDate: 'Date Hégirienne',
    gregorianDate: 'Date Grégorienne',
    locationGPS: 'Position GPS',
    locationAuto: 'GPS Automatique',
    locationManual: 'Sélection Manuelle',
    hoursShort: 'h',
    minutesShort: 'm',
    secondsShort: 's',
    nowIsPrayerTime: 'L\'heure de la prière est arrivée',
    prayTimeHasCome: 'La prière demeure, pour les croyants, une prescription à des temps déterminés.',

    prayers: {
      fajr: 'Fajr',
      sunrise: 'Chourouq',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      jumuah: 'Vendredi (Joumouaa)',
      qiyam: 'Qiyam Al-Layl',
    },

    extraTimes: {
      sunrise: 'Lever du Soleil',
      midnight: 'Milieu de la Nuit',
      qiyam: 'Dernier Tiers de la Nuit',
      suhoor: 'Suhoor / Imsak',
      duha: 'Prière de Duha',
    },

    tabLanguage: 'Langue',
    tabLocationCalc: 'Lieu et Calcul',
    tabAlerts: 'Alertes',
    tabAdhan: 'Adhan',
    tabMusaharati: 'Musaharati',
    tabDisplay: 'Affichage & Thème',

    selectLanguage: 'Sélectionnez la langue de l\'application :',
    arabicLang: 'العربية (Arabe)',
    englishLang: 'English (Anglais)',
    frenchLang: 'Français (French)',

    locationTitle: 'Localisation Géographique',
    locationDesc: 'Choisissez votre position via GPS ou sélectionnez manuellement votre pays et ville pour des horaires précis.',
    useGpsButton: 'Détecter ma position automatiquement par GPS',
    locatingGps: 'Localisation GPS en cours...',
    searchCityPlaceholder: 'Rechercher une ville ou un pays...',
    country: 'Pays',
    city: 'Ville',
    customCoordinates: 'Coordonnées personnalisées (Latitude et Longitude)',
    latitude: 'Latitude',
    longitude: 'Longitude',
    saveCustomLocation: 'Enregistrer les coordonnées',
    currentActiveLocation: 'Emplacement actuel actif :',
    calculationMethodsTitle: 'Méthode de Calcul des Horaires',
    calculationMethodsDesc: 'Prend en charge toutes les autorités et instituts islamiques officiels du monde entier.',
    asrSchoolTitle: 'Méthode de calcul de l\'Asr (Madhab)',
    asrStandard: 'Standard (Chafi`i, Maliki, Hanbali)',
    asrHanafi: 'Hanafi (L\'ombre fait deux fois la longueur)',
    manualOffsetsTitle: 'Ajustement Manuel des Horaires (Minutes)',
    manualOffsetsDesc: 'Ajustez chaque prière de quelques minutes pour correspondre parfaitement à votre mosquée locale.',
    resetDefaultOffsets: 'Réinitialiser par défaut (0 min)',
    dstTitle: 'Heure d\'Été (DST)',
    dstStandard: 'Heure Standard (+0)',
    dstDaylight: 'Heure d\'Été Active (+1 Heure)',
    hijriOffsetTitle: 'Ajustement Date Hégirienne (Vision de la lune)',
    days: 'jours',

    alertsTitle: 'Système d\'Alertes Pré-Prière Personnalisées',
    alertsDesc: 'Créez un nombre illimité d\'alertes par prière, écrivez librement la durée en minutes, et choisissez le son depuis votre téléphone.',
    unlimitedAlertsBadge: 'Alertes Personnalisées Illimitées',
    addAlert: 'Ajouter une Alerte',
    editAlert: 'Modifier l\'Alerte',
    saveAlert: 'Enregistrer l\'Alerte',
    cancel: 'Annuler',
    deleteAlert: 'Supprimer l\'Alerte',
    duplicateAlert: 'Dupliquer l\'Alerte',
    alertPrayerSelect: '1. Sélectionnez la Prière :',
    allPrayersOption: 'Toutes les 5 Prières Quotidiennes Ensemble',
    alertMinutesFreeInput: '2. Écrivez la durée avant l\'Adhan en minutes (Librement) :',
    minutesBeforePrayer: 'minutes avant l\'Adhan',
    minutesFreePlaceholder: 'ex : 7, 12, 25, 40 minutes...',
    alertSoundTitle: '3. Son et Tonalité de l\'Alerte :',
    chooseAudioFromPhone: '📱 Choisir un fichier audio du téléphone (MP3 / WAV / M4A / AAC)',
    changeAudioPhone: 'Changer le son du téléphone',
    presetSoundTitle: 'Ou choisir une sonnerie islamique intégrée :',
    testSound: 'Tester le Son',
    stopSound: 'Arrêter',
    alertLabelTitle: '4. Titre ou Note de l\'Alerte :',
    alertLabelPlaceholder: 'ex : Réveil pour les prières surérogatoires et ablutions',
    enableAlertToggle: 'Activer cette alerte',
    vibratePhone: 'Activer la vibration du téléphone',
    volumeLabel: 'Volume sonore',
    fullScreenAlertToggle: 'Afficher un écran d\'alerte complet à l\'heure prévue',
    fullScreenAlertDesc: 'Affiche un bel écran avec compte à rebours, lecture audio et bouton de report.',
    noAlertsFound: 'Aucune alerte configurée. Utilisez le formulaire ci-dessus pour en ajouter une.',
    alertDeleted: 'Alerte supprimée avec succès',
    alertSaved: 'Alerte enregistrée avec succès',
    snooze5Min: 'Reporter 5 min',
    dismissAlert: 'Arrêter l\'Alerte',

    adhanTitle: 'Personnalisation Adhan Audio & Vidéo par Prière',
    adhanDesc: 'Personnalisez le fichier audio ou vidéo de l\'Adhan pour chaque prière indépendamment depuis votre téléphone.',
    fajrSpecialAdhan: 'Adhan du Fajr (La prière est meilleure que le sommeil)',
    dhuhrAdhan: 'Adhan du Dhuhr',
    asrAdhan: 'Adhan de l\'Asr',
    maghribAdhan: 'Adhan du Maghrib',
    ishaAdhan: 'Adhan de l\'Isha',
    jumuahAdhan: 'Adhan du Vendredi (Jumuah)',
    chooseFileFromPhone: '📁 Choisir un fichier audio ou vidéo du téléphone',
    supportedFormats: 'Formats pris en charge : MP3, WAV, M4A, AAC, MP4, MOV, MKV',
    videoAudioNotice: 'Si une vidéo MP4/MOV est sélectionnée, elle sera lue avec le son dans l\'écran de l\'Adhan.',
    previewAdhan: 'Aperçu et Lecture de l\'Adhan',
    changeFile: 'Changer de Fichier',
    deleteCustomFile: 'Supprimer le Fichier Personnalisé',
    resetDefaultMuazzin: 'Revenir au Muezzin par Défaut',
    muazzinPresets: 'Récitateurs Officiels de La Mecque, Médine et Al-Aqsa',
    adhanEnabled: 'Activer l\'Adhan automatique à l\'heure de la prière',
    adhanTypeVideo: 'Vidéo & Audio',
    adhanTypeAudio: 'Audio Uniquement',

    musaharatiTitle: 'Musaharati — Réveil et Traditions du Ramadan',
    musaharatiDesc: 'Réveillez-vous au son des tambours traditionnels du Ramadan ou choisissez un son/vidéo depuis votre téléphone pour le Suhoor.',
    enableMusaharati: 'Activer l\'Alarme du Musaharati pour le Ramadan',
    musaharatiTimingMode: 'Mode de Définition de l\'Heure du Musaharati :',
    relativeFajrOption: 'Minutes calculées avant l\'Adhan du Fajr',
    fixedTimeOption: 'Heure fixe quotidienne (ex : 03:00)',
    minutesBeforeFajrLabel: 'Minutes avant le Fajr :',
    exactTimeLabel: 'Heure exacte de réveil :',
    musaharatiSoundPhone: 'Choisir un son/vidéo du Musaharati depuis le téléphone',
    musaharatiPresetSound: 'Tambours et Chants Traditionnels du Ramadan :',
    onlyInRamadanNotice: 'Le Musaharati fonctionne automatiquement pendant le mois béni de Ramadan et peut être testé à tout moment.',
    testMusaharati: 'Tester le Musaharati Maintenant',
    musaharatiPresets: {
      ya_nayem: 'Réveille-toi dormeur, glorifie l\'Éternel (Tambour Traditionnel)',
      sahur_drum: 'Rythmes du Suhoor au Caire et à Jérusalem',
      traditional_chant: 'Ô serviteurs d\'Allah, levez-vous pour votre Suhoor',
      makkah_sahur: 'Appel béni du Suhoor de La Mecque et Médine',
    },

    themeTitle: 'Thème & Apparence',
    darkMode: 'Mode Sombre (Dark)',
    lightMode: 'Mode Clair (Light)',
    twentyFourHourFormat: 'Format 24 Heures (14:30)',
    twelveHourFormat: 'Format 12 Heures (2:30 PM)',
    showSunriseToggle: 'Afficher le Lever du Soleil sur le tableau',
    showMidnightToggle: 'Afficher le Milieu de la Nuit sur le tableau',
    showQiyamToggle: 'Afficher le Dernier Tiers de la Nuit (Qiyam)',

    welcomeTitle: 'Bienvenue sur le Muezzin Électronique',
    welcomeDesc: 'Votre horloge électronique de mosquée pour des horaires précis, des alertes et l\'Adhan automatique.',
    stepLanguage: 'Choisir la Langue',
    stepLocation: 'Détecter / Choisir la Localisation',
    stepMethod: 'Méthode de Calcul et Madhab',
    stepAlerts: 'Configurer les Alertes et l\'Adhan',
    startUsingApp: 'Commencer à Utiliser l\'App',
    nextStep: 'Suivant',
    prevStep: 'Précédent',

    close: 'Fermer',
    save: 'Enregistrer les Modifications',
    settings: 'Paramètres',
    loading: 'Chargement...',
    success: 'Succès',
    error: 'Erreur',
    enabled: 'Activé',
    disabled: 'Désactivé',
  },
};
