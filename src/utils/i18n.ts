import { Language, PrayerKey, CalculationMethodKey, MadhabKey } from '../types';

export interface TranslationDict {
  // App Title & Tagline
  appName: string;
  appSubtitle: string;
  hadithHeader: string;

  // Navigation & Views
  prayers: string;
  alerts: string;
  adhan: string;
  musaharati: string;
  adhkar: string;
  salawat: string;
  qibla: string;
  calendar: string;
  tasbeeh: string;
  settings: string;

  // Prayers
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumuah: string;
  midnight: string;
  lastThirdOfNight: string;
  qiyam: string;
  suhoor: string;
  duha: string;

  // Next Prayer & Countdown
  nextPrayer: string;
  nowIsTimeFor: string;
  timeRemaining: string;
  hours: string;
  minutes: string;
  seconds: string;
  startsIn: string;
  activeNow: string;
  passed: string;
  upcoming: string;

  // Mosque Clock Display
  electronicMosqueClock: string;
  hijriDate: string;
  gregorianDate: string;
  currentLocation: string;
  liveClock: string;

  // Settings Tabs
  tabLanguage: string;
  tabLocationAndCalculation: string;
  tabAlerts: string;
  tabAdhan: string;
  tabMusaharati: string;
  tabSalawat: string;

  // Language Selection
  selectLanguage: string;
  arabic: string;
  english: string;
  french: string;

  // Location & Calculation
  locationSelection: string;
  autoGps: string;
  autoGpsDesc: string;
  manualLocation: string;
  manualLocationDesc: string;
  country: string;
  city: string;
  searchCity: string;
  coordinates: string;
  latitude: string;
  longitude: string;
  calculationMethod: string;
  calculationMethodDesc: string;
  asrSchool: string;
  standardShafi: string;
  hanafi: string;
  manualOffsets: string;
  manualOffsetsDesc: string;
  resetToDefaults: string;
  hijriAdjustment: string;
  daylightSavingTime: string;

  // Alerts Tab
  alertsTitle: string;
  alertsDesc: string;
  addAlert: string;
  editAlert: string;
  deleteAlert: string;
  alertPrayer: string;
  alertMinutesBefore: string;
  minutesBeforePrayer: string;
  alertSound: string;
  appDefaultSound: string;
  soundFromPhone: string;
  chooseAudioFromPhone: string;
  testSound: string;
  stopSound: string;
  enableAlert: string;
  fullScreenAlertPrompt: string;
  noAlertsYet: string;
  customAlertLabel: string;
  alertExamples: string;

  // Alert Screen / Notification Modal
  approachingPrayerAlert: string;
  prayerApproaching: string;
  snooze5min: string;
  snooze10min: string;
  dismiss: string;

  // Adhan Tab
  adhanTitle: string;
  adhanDesc: string;
  selectAdhanVoice: string;
  chooseFileFromPhone: string;
  chooseVideoOrAudio: string;
  phoneCustomFile: string;
  preview: string;
  stopPreview: string;
  resetDefaultAdhan: string;
  adhanVolume: string;
  fajrAdhan: string;
  dhuhrAdhan: string;
  asrAdhan: string;
  maghribAdhan: string;
  ishaAdhan: string;
  jumuahAdhan: string;
  mosqueRecordings: string;
  adhanNoticePhone: string;

  // Musaharati - Ramadan Tab
  musaharatiTitle: string;
  musaharatiDesc: string;
  enableMusaharati: string;
  musaharatiTime: string;
  beforeFajrMinutes: string;
  fixedClockTime: string;
  musaharatiSound: string;
  traditionalPreset: string;
  musaharatiFromPhone: string;
  onlyDuringRamadan: string;
  testMusaharati: string;
  wakeUpForSuhoor: string;
  suhoorBlessing: string;

  // Themes & General
  darkMode: string;
  lightMode: string;
  twentyFourHour: string;
  notifications: string;
  saveChanges: string;
  close: string;
  cancel: string;
  save: string;

  // Onboarding Wizard
  welcomeTitle: string;
  welcomeDesc: string;
  step: string;
  next: string;
  back: string;
  getStarted: string;
  stepLanguage: string;
  stepLocation: string;
  stepCalculation: string;
  stepAlertsAdhan: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  ar: {
    appName: 'المؤذن الإلكتروني',
    appSubtitle: 'ساعة المسجد الإلكترونية والمواقيت الدقيقة',
    hadithHeader: '«إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا»',

    prayers: 'أوقات الصلاة',
    alerts: 'التنبيهات',
    adhan: 'الأذان',
    musaharati: 'المسحراتي',
    adhkar: 'حصن المسلم',
    salawat: 'الصلاة على النبي ﷺ',
    qibla: 'القبلة',
    calendar: 'التقويم',
    tasbeeh: 'المسبحة',
    settings: 'الإعدادات',

    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    jumuah: 'الجمعة',
    midnight: 'منتصف الليل',
    lastThirdOfNight: 'الثلث الأخير من الليل',
    qiyam: 'قيام الليل',
    suhoor: 'السحور',
    duha: 'الضحى',

    nextPrayer: 'الصلاة القادمة',
    nowIsTimeFor: 'حان الآن وقت صلاة',
    timeRemaining: 'الوقت المتبقي',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    startsIn: 'يبدأ بعد',
    activeNow: 'الصلاة الحالية',
    passed: 'انقضت',
    upcoming: 'القادمة',

    electronicMosqueClock: 'ساعة المسجد الإلكترونية',
    hijriDate: 'التاريخ الهجري',
    gregorianDate: 'التاريخ الميلادي',
    currentLocation: 'الموقع الحالي',
    liveClock: 'الوقت الآن',

    tabLanguage: 'اللغة',
    tabLocationAndCalculation: 'المكان والحساب',
    tabAlerts: 'التنبيهات',
    tabAdhan: 'الأذان',
    tabMusaharati: 'المسحراتي',
    tabSalawat: 'الصلاة على النبي',

    selectLanguage: 'اختر لغة التطبيق:',
    arabic: 'العربية (Arabic)',
    english: 'English (الإنجليزية)',
    french: 'Français (الفرنسية)',

    locationSelection: 'تحديد الموقع الجغرافي',
    autoGps: 'الموقع التلقائي (GPS)',
    autoGpsDesc: 'استخدام خدمات الموقع في الهاتف لتحديد المدينة والإحداثيات تلقائياً وبدقة فائقة',
    manualLocation: 'الموقع اليدوي',
    manualLocationDesc: 'اختيار الدولة والمدينة من القائمة أو إدخال إحداثيات مخصصة',
    country: 'الدولة',
    city: 'المدينة',
    searchCity: 'ابحث عن اسم المدينة أو العاصمة...',
    coordinates: 'الإحداثيات الجغرافية',
    latitude: 'خط العرض (Lat)',
    longitude: 'خط الطول (Lng)',
    calculationMethod: 'طرق حساب أوقات الصلاة',
    calculationMethodDesc: 'اختر طريقة الحساب المعتمدة في بلدك لحساب زوايا الفجر والعشاء',
    asrSchool: 'طريقة حساب وقت العصر (المذهب)',
    standardShafi: 'الجمهور (الشافعي، المالكي، الحنبلي) - ظل الشيء مثله',
    hanafi: 'الحنفي - ظل الشيء مثليه',
    manualOffsets: 'ضبط المواقيت يدويًا بالدقائق',
    manualOffsetsDesc: 'يمكنك زيادة أو إنقاص أي صلاة بعدد محدد من الدقائق لمطابقة مسجد حيك',
    resetToDefaults: 'إعادة الإعدادات الافتراضية',
    hijriAdjustment: 'ضبط التقويم الهجري',
    daylightSavingTime: 'التوقيت الصيفي (DST)',

    alertsTitle: 'نظام التنبيهات المخصصة قبل الصلاة',
    alertsDesc: 'يمكنك إنشاء عدد غير محدود من التنبيهات لكل صلاة بالدقائق واختيار نغمات من الهاتف',
    addAlert: '+ إضافة تنبيه جديد',
    editAlert: 'تعديل التنبيه',
    deleteAlert: 'حذف',
    alertPrayer: 'الصلاة المستهدفة',
    alertMinutesBefore: 'مدة التنبيه قبل الصلاة (بالدقائق):',
    minutesBeforePrayer: 'دقيقة قبل الأذان',
    alertSound: 'صوت ونغمة التنبيه',
    appDefaultSound: 'أصوات ونغمات التطبيق',
    soundFromPhone: '📱 ملف صوتي من هاتفك',
    chooseAudioFromPhone: 'اختر ملف صوتي من ذاكرة الهاتف (MP3 / WAV / M4A / AAC)',
    testSound: 'تجربة الصوت',
    stopSound: 'إيقاف',
    enableAlert: 'تفعيل التنبيه',
    fullScreenAlertPrompt: 'إظهار شاشة كاملة عند وصول وقت التنبيه',
    noAlertsYet: 'لا توجد تنبيهات مضافة بعد. اضغط "+ إضافة تنبيه جديد" للبدء.',
    customAlertLabel: 'نص أو وصف التنبيه (اختياري)',
    alertExamples: 'أمثلة: تنبيه قبل الفجر بـ 30 دقيقة، قبل الظهر بـ 15 دقيقة، قبل العصر بـ 10 دقائق...',

    approachingPrayerAlert: 'تنبيه اقتراب الصلاة',
    prayerApproaching: 'اقترب موعد أذان',
    snooze5min: 'تأجيل 5 دقائق',
    snooze10min: 'تأجيل 10 دقائق',
    dismiss: 'إيقاف التنبيه',

    adhanTitle: 'تخصيص صوت وفيديو الأذان لكل صلاة',
    adhanDesc: 'اختر ملف صوتي أو فيديو من هاتفك لكل صلاة بشكل مستقل، أو اختر من كبار مؤذني الحرمين',
    selectAdhanVoice: 'صوت أو فيديو الأذان لهذه الصلاة:',
    chooseFileFromPhone: '📱 اختر ملف أذان من هاتفك (صوت أو فيديو)',
    chooseVideoOrAudio: 'يدعم صيغ الصوت والفيديو (MP3, WAV, M4A, AAC, MP4, MOV, MKV)',
    phoneCustomFile: 'ملف خاص من ذاكرة الهاتف',
    preview: 'معاينة وتشغيل',
    stopPreview: 'إيقاف المعاينة',
    resetDefaultAdhan: 'العودة إلى الصوت الافتراضي',
    adhanVolume: 'مستوى صوت الأذان:',
    fajrAdhan: 'أذان الفجر',
    dhuhrAdhan: 'أذان الظهر',
    asrAdhan: 'أذان العصر',
    maghribAdhan: 'أذان المغرب',
    ishaAdhan: 'أذان العشاء',
    jumuahAdhan: 'أذان الجمعة',
    mosqueRecordings: 'أو اختر من تسجيلات وفيديوهات كبار المؤذنين:',
    adhanNoticePhone: 'ملاحظة: يمكنك رفع فيديو كامل وسيعرض صوتاً وصورة في شاشة الأذان عند حلول الوقت.',

    musaharatiTitle: 'المسحراتي — ليالي شهر رمضان المبارك',
    musaharatiDesc: 'نظام الاستيقاظ وتنبيه السحور بأصوات المسحراتي التقليدية أو ملفات صوتية وفيديو من هاتفك',
    enableMusaharati: 'تفعيل تنبيه المسحراتي',
    musaharatiTime: 'وقت انطلاق المسحراتي:',
    beforeFajrMinutes: 'قبل أذان الفجر بعدد دقائق محدد',
    fixedClockTime: 'في ساعة محددة (مثال: 03:00 ص)',
    musaharatiSound: 'صوت ونغمة المسحراتي:',
    traditionalPreset: 'الأصوات التراثية الشهيرة («يا نايم وحّد الدايم»)',
    musaharatiFromPhone: '📱 اختيار صوت أو فيديو مسحراتي من الهاتف',
    onlyDuringRamadan: 'تشغيل التنبيه تلقائياً في أيام شهر رمضان فقط',
    testMusaharati: 'تجربة صوت المسحراتي الآن',
    wakeUpForSuhoor: '«اصحى يا نايم.. وحّد الدايم.. السحور يا عباد الله»',
    suhoorBlessing: '«تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً»',

    darkMode: 'الوضع الليلي (Dark)',
    lightMode: 'الوضع النهاري (Light)',
    twentyFourHour: 'نظام 24 ساعة',
    notifications: 'تفعيل الإشعارات والتنبيهات',
    saveChanges: 'حفظ التغييرات',
    close: 'إغلاق',
    cancel: 'إلغاء',
    save: 'حفظ',

    welcomeTitle: 'مرحبًا بك في تطبيق المؤذن الإلكتروني',
    welcomeDesc: 'دعنا نضبط إعداداتك الأساسية في خطوات سريعة ودقيقة للحصول على أدق مواقيت وتنبيهات.',
    step: 'الخطوة',
    next: 'التالي',
    back: 'السابق',
    getStarted: 'ابدأ الاستخدام الآن',
    stepLanguage: 'اختيار اللغة',
    stepLocation: 'تحديد الموقع',
    stepCalculation: 'طريقة الحساب والمذهب',
    stepAlertsAdhan: 'التنبيهات والأذان',
  },

  en: {
    appName: 'Electronic Muazzin',
    appSubtitle: 'Modern Electronic Mosque Clock & Accurate Prayer Times',
    hadithHeader: '"Indeed, prayer has been decreed upon the believers a decree of specified times."',

    prayers: 'Prayer Times',
    alerts: 'Alerts',
    adhan: 'Adhan',
    musaharati: 'Musaharati',
    adhkar: 'Fortress of the Muslim',
    salawat: 'Salawat on Prophet ﷺ',
    qibla: 'Qibla',
    calendar: 'Calendar',
    tasbeeh: 'Tasbeeh',
    settings: 'Settings',

    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    jumuah: 'Jumu\'ah',
    midnight: 'Midnight',
    lastThirdOfNight: 'Last Third of Night',
    qiyam: 'Qiyam Al-Layl',
    suhoor: 'Suhoor',
    duha: 'Duha',

    nextPrayer: 'Next Prayer',
    nowIsTimeFor: 'It is now time for',
    timeRemaining: 'Time Remaining',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    startsIn: 'Starts in',
    activeNow: 'Current Prayer',
    passed: 'Passed',
    upcoming: 'Upcoming',

    electronicMosqueClock: 'Electronic Mosque Clock',
    hijriDate: 'Hijri Date',
    gregorianDate: 'Gregorian Date',
    currentLocation: 'Current Location',
    liveClock: 'Current Time',

    tabLanguage: 'Language',
    tabLocationAndCalculation: 'Location & Calculation',
    tabAlerts: 'Pre-Prayer Alerts',
    tabAdhan: 'Adhan Customization',
    tabMusaharati: 'Musaharati (Ramadan)',
    tabSalawat: 'Salawat on Prophet',

    selectLanguage: 'Select Application Language:',
    arabic: 'العربية (Arabic)',
    english: 'English',
    french: 'Français (French)',

    locationSelection: 'Geographic Location',
    autoGps: 'Automatic GPS Location',
    autoGpsDesc: 'Use device location services to automatically determine city coordinates with highest accuracy',
    manualLocation: 'Manual Location',
    manualLocationDesc: 'Select country and city from database or enter custom coordinates',
    country: 'Country',
    city: 'City',
    searchCity: 'Search for city or capital name...',
    coordinates: 'Coordinates',
    latitude: 'Latitude (Lat)',
    longitude: 'Longitude (Lng)',
    calculationMethod: 'Calculation Methods',
    calculationMethodDesc: 'Choose the approved method in your region for calculating Fajr and Isha angles',
    asrSchool: 'Asr Calculation Method (Madhab)',
    standardShafi: 'Standard / Shafi\'i, Maliki, Hanbali (Shadow = 1x)',
    hanafi: 'Hanafi (Shadow = 2x)',
    manualOffsets: 'Manual Minute Adjustments',
    manualOffsetsDesc: 'Fine-tune each prayer time by +/- minutes to perfectly match your local mosque',
    resetToDefaults: 'Reset to Defaults',
    hijriAdjustment: 'Hijri Calendar Adjustment',
    daylightSavingTime: 'Daylight Saving Time (DST)',

    alertsTitle: 'Unlimited Pre-Prayer Alerts',
    alertsDesc: 'Create custom notifications before each prayer with customizable minutes and phone audio',
    addAlert: '+ Add New Alert',
    editAlert: 'Edit Alert',
    deleteAlert: 'Delete',
    alertPrayer: 'Target Prayer',
    alertMinutesBefore: 'Alert Duration Before Prayer (in minutes):',
    minutesBeforePrayer: 'minutes before Adhan',
    alertSound: 'Alert Sound & Tone',
    appDefaultSound: 'Default App Sounds',
    soundFromPhone: '📱 Audio File from Phone',
    chooseAudioFromPhone: 'Select audio file from phone storage (MP3 / WAV / M4A / AAC)',
    testSound: 'Test Sound',
    stopSound: 'Stop',
    enableAlert: 'Enable Alert',
    fullScreenAlertPrompt: 'Display full-screen reminder when alert triggers',
    noAlertsYet: 'No alerts created yet. Click "+ Add New Alert" to create one.',
    customAlertLabel: 'Custom Alert Label (Optional)',
    alertExamples: 'Examples: 30m before Fajr, 15m before Dhuhr, 10m before Asr...',

    approachingPrayerAlert: 'Approaching Prayer Alert',
    prayerApproaching: 'Upcoming Adhan time for',
    snooze5min: 'Snooze 5 mins',
    snooze10min: 'Snooze 10 mins',
    dismiss: 'Dismiss Alert',

    adhanTitle: 'Per-Prayer Adhan Sound & Video',
    adhanDesc: 'Assign custom audio or video files from your device for each prayer independently',
    selectAdhanVoice: 'Adhan sound/video for this prayer:',
    chooseFileFromPhone: '📱 Choose Audio/Video File from Phone',
    chooseVideoOrAudio: 'Supports audio and video formats (MP3, WAV, M4A, AAC, MP4, MOV, MKV)',
    phoneCustomFile: 'Custom file from phone storage',
    preview: 'Preview & Play',
    stopPreview: 'Stop Preview',
    resetDefaultAdhan: 'Reset to Default Adhan',
    adhanVolume: 'Adhan Volume:',
    fajrAdhan: 'Fajr Adhan',
    dhuhrAdhan: 'Dhuhr Adhan',
    asrAdhan: 'Asr Adhan',
    maghribAdhan: 'Maghrib Adhan',
    ishaAdhan: 'Isha Adhan',
    jumuahAdhan: 'Jumu\'ah Adhan',
    mosqueRecordings: 'Or choose from legendary Haramain Muazzin recordings:',
    adhanNoticePhone: 'Note: Full videos will display in high quality on the Adhan screen when prayer time arrives.',

    musaharatiTitle: 'Musaharati — Ramadan Suhoor Alarms',
    musaharatiDesc: 'Wake up for Suhoor with traditional festive drum chants or custom media from your phone',
    enableMusaharati: 'Enable Musaharati Alert',
    musaharatiTime: 'Musaharati Trigger Time:',
    beforeFajrMinutes: 'Minutes before Fajr Adhan',
    fixedClockTime: 'At a fixed clock time (e.g. 03:00 AM)',
    musaharatiSound: 'Musaharati Sound Tone:',
    traditionalPreset: 'Traditional Ramadan Chant ("Ya Nayem Wahed Al-Dayem")',
    musaharatiFromPhone: '📱 Audio or Video file from phone',
    onlyDuringRamadan: 'Trigger automatically during the holy month of Ramadan only',
    testMusaharati: 'Test Musaharati Sound Now',
    wakeUpForSuhoor: '"Wake up, praise the Eternal, it is time for Suhoor!"',
    suhoorBlessing: '"Take Suhoor, for indeed in Suhoor there is blessing."',

    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    twentyFourHour: '24-Hour Format',
    notifications: 'Notifications & Alarms',
    saveChanges: 'Save Changes',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',

    welcomeTitle: 'Welcome to Electronic Muazzin',
    welcomeDesc: 'Let\'s configure your essential preferences in a few quick steps for precise prayer times and alerts.',
    step: 'Step',
    next: 'Next',
    back: 'Back',
    getStarted: 'Get Started',
    stepLanguage: 'Choose Language',
    stepLocation: 'Set Location',
    stepCalculation: 'Method & School',
    stepAlertsAdhan: 'Alerts & Adhan',
  },

  fr: {
    appName: 'Muezzin Électronique',
    appSubtitle: 'Horloge Électronique de Mosquée & Horaires de Prière Précis',
    hadithHeader: '« En vérité la prière a été prescrite aux croyants à des heures précises. »',

    prayers: 'Horaires de Prière',
    alerts: 'Alertes',
    adhan: 'Adhan',
    musaharati: 'Musaharati',
    adhkar: 'La Citadelle du Musulman',
    salawat: 'Salawat sur le Prophète ﷺ',
    qibla: 'Qibla',
    calendar: 'Calendrier',
    tasbeeh: 'Chapelet',
    settings: 'Paramètres',

    fajr: 'Fajr',
    sunrise: 'Chourouk',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    jumuah: 'Joujmou\'a',
    midnight: 'Minuit Islamique',
    lastThirdOfNight: 'Dernier Tiers de la Nuit',
    qiyam: 'Qiyam Al-Layl',
    suhoor: 'Souhour',
    duha: 'Duha',

    nextPrayer: 'Prochaine Prière',
    nowIsTimeFor: 'C\'est l\'heure de la prière',
    timeRemaining: 'Temps Restant',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    startsIn: 'Commence dans',
    activeNow: 'Prière en cours',
    passed: 'Passée',
    upcoming: 'À venir',

    electronicMosqueClock: 'Horloge Électronique de Mosquée',
    hijriDate: 'Date Hégirienne',
    gregorianDate: 'Date Grégorienne',
    currentLocation: 'Emplacement Actuel',
    liveClock: 'Heure Actuelle',

    tabLanguage: 'Langue',
    tabLocationAndCalculation: 'Lieu & Calcul',
    tabAlerts: 'Alertes Avant-Prière',
    tabAdhan: 'Personnalisation Adhan',
    tabMusaharati: 'Musaharati (Ramadan)',
    tabSalawat: 'Salawat sur le Prophète',

    selectLanguage: 'Choisir la langue de l\'application :',
    arabic: 'العربية (Arabe)',
    english: 'English (Anglais)',
    french: 'Français',

    locationSelection: 'Position Géographique',
    autoGps: 'Localisation GPS Automatique',
    autoGpsDesc: 'Utilise le GPS du téléphone pour obtenir la ville et les coordonnées avec une grande précision',
    manualLocation: 'Localisation Manuelle',
    manualLocationDesc: 'Sélectionnez le pays et la ville ou saisissez des coordonnées personnalisées',
    country: 'Pays',
    city: 'Ville',
    searchCity: 'Rechercher une ville ou capitale...',
    coordinates: 'Coordonnées',
    latitude: 'Latitude (Lat)',
    longitude: 'Longitude (Lng)',
    calculationMethod: 'Méthodes de Calcul',
    calculationMethodDesc: 'Choisissez la méthode approuvée dans votre région pour calculer les angles du Fajr et de l\'Isha',
    asrSchool: 'Méthode de calcul de l\'Asr (Madhab)',
    standardShafi: 'Standard / Chafi\'ite, Malikite, Hanbalite (Ombre = 1x)',
    hanafi: 'Hanafite (Ombre = 2x)',
    manualOffsets: 'Ajustement Manuel en Minutes',
    manualOffsetsDesc: 'Ajustez chaque prière de +/- minutes pour concorder exactement avec la mosquée de votre quartier',
    resetToDefaults: 'Réinitialiser aux valeurs par défaut',
    hijriAdjustment: 'Ajustement du Calendrier Hégirien',
    daylightSavingTime: 'Heure d\'été (DST)',

    alertsTitle: 'Alertes Personnalisées Illimitées Avant la Prière',
    alertsDesc: 'Créez des alertes personnalisées pour chaque prière en minutes avec vos sons du téléphone',
    addAlert: '+ Ajouter une Alerte',
    editAlert: 'Modifier l\'Alerte',
    deleteAlert: 'Supprimer',
    alertPrayer: 'Prière Ciblée',
    alertMinutesBefore: 'Durée de l\'alerte avant la prière (en minutes) :',
    minutesBeforePrayer: 'minutes avant l\'Adhan',
    alertSound: 'Son & Sonnerie de l\'Alerte',
    appDefaultSound: 'Sons par défaut de l\'application',
    soundFromPhone: '📱 Fichier audio du téléphone',
    chooseAudioFromPhone: 'Sélectionnez un fichier audio depuis la mémoire du téléphone (MP3 / WAV / M4A / AAC)',
    testSound: 'Tester le Son',
    stopSound: 'Arrêter',
    enableAlert: 'Activer l\'Alerte',
    fullScreenAlertPrompt: 'Afficher un écran plein rappel lors du déclenchement',
    noAlertsYet: 'Aucune alerte ajoutée. Cliquez sur "+ Ajouter une Alerte" pour commencer.',
    customAlertLabel: 'Description personnalisée (optionnel)',
    alertExamples: 'Exemples : 30 min avant le Fajr, 15 min avant le Dhuhr, 10 min avant l\'Asr...',

    approachingPrayerAlert: 'Alerte Prière Imminente',
    prayerApproaching: 'L\'Adhan approche pour la prière de',
    snooze5min: 'Répéter 5 min',
    snooze10min: 'Répéter 10 min',
    dismiss: 'Arrêter l\'Alerte',

    adhanTitle: 'Son & Vidéo d\'Adhan par Prière',
    adhanDesc: 'Associez un fichier audio ou vidéo de votre téléphone pour chaque prière de manière indépendante',
    selectAdhanVoice: 'Son / Vidéo d\'Adhan pour cette prière :',
    chooseFileFromPhone: '📱 Choisir un Fichier depuis le Téléphone (Audio ou Vidéo)',
    chooseVideoOrAudio: 'Prend en charge les formats audio et vidéo (MP3, WAV, M4A, AAC, MP4, MOV, MKV)',
    phoneCustomFile: 'Fichier personnalisé du téléphone',
    preview: 'Aperçu & Lecture',
    stopPreview: 'Arrêter l\'aperçu',
    resetDefaultAdhan: 'Revenir à l\'Adhan par défaut',
    adhanVolume: 'Volume de l\'Adhan :',
    fajrAdhan: 'Adhan Fajr',
    dhuhrAdhan: 'Adhan Dhuhr',
    asrAdhan: 'Adhan Asr',
    maghribAdhan: 'Adhan Maghrib',
    ishaAdhan: 'Adhan Isha',
    jumuahAdhan: 'Adhan Joujmou\'a',
    mosqueRecordings: 'Ou choisissez parmi les enregistrements des célèbres muezzins des deux Saintes Mosquées :',
    adhanNoticePhone: 'Remarque : Les vidéos complètes s\'afficheront en haute qualité sur l\'écran d\'Adhan.',

    musaharatiTitle: 'Musaharati — Nuits Bénies du Ramadan',
    musaharatiDesc: 'Réveil pour le Souhour avec les chants traditionnels ou vos propres fichiers audio/vidéo',
    enableMusaharati: 'Activer l\'Alerte Musaharati',
    musaharatiTime: 'Heure de déclenchement du Musaharati :',
    beforeFajrMinutes: 'Minutes avant l\'Adhan du Fajr',
    fixedClockTime: 'À une heure fixe (ex : 03:00)',
    musaharatiSound: 'Sonnerie du Musaharati :',
    traditionalPreset: 'Chant traditionnel du Ramadan ("Ya Nayem Wahed Al-Dayem")',
    musaharatiFromPhone: '📱 Fichier audio ou vidéo du téléphone',
    onlyDuringRamadan: 'Déclencher automatiquement pendant le mois sacré du Ramadan uniquement',
    testMusaharati: 'Tester le Son du Musaharati',
    wakeUpForSuhoor: '« Réveillez-vous, louez le Tout-Puissant, c\'est l\'heure du Souhour ! »',
    suhoorBlessing: '« Prenez le Souhour, car il y a certes une bénédiction dans le Souhour. »',

    darkMode: 'Mode Sombre (Dark)',
    lightMode: 'Mode Clair (Light)',
    twentyFourHour: 'Format 24 Heures',
    notifications: 'Notifications & Alertes',
    saveChanges: 'Enregistrer',
    close: 'Fermer',
    cancel: 'Annuler',
    save: 'Enregistrer',

    welcomeTitle: 'Bienvenue sur Muezzin Électronique',
    welcomeDesc: 'Configurons vos préférences essentielles en quelques étapes pour des horaires et alertes d\'une précision absolue.',
    step: 'Étape',
    next: 'Suivant',
    back: 'Précédent',
    getStarted: 'Commencer',
    stepLanguage: 'Choisir la Langue',
    stepLocation: 'Définir le Lieu',
    stepCalculation: 'Méthode & Madhab',
    stepAlertsAdhan: 'Alertes & Adhan',
  },
};

export function getTranslation(lang: Language = 'ar'): TranslationDict {
  return TRANSLATIONS[lang] || TRANSLATIONS.ar;
}

export function getLocalizedPrayerName(key: PrayerKey, lang: Language = 'ar'): string {
  const t = getTranslation(lang);
  switch (key) {
    case 'fajr': return t.fajr;
    case 'sunrise': return t.sunrise;
    case 'dhuhr': return t.dhuhr;
    case 'asr': return t.asr;
    case 'maghrib': return t.maghrib;
    case 'isha': return t.isha;
    case 'jumuah': return t.jumuah;
    case 'qiyam': return t.qiyam;
    default: return key;
  }
}
