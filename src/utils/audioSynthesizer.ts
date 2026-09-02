// Audio Synthesizer, Sound Library, and Presets for Adhan, Approaching Alerts, and Salawat

export interface MuazzinPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  isFajrSpecial?: boolean;
  audioUrl: string;
  videoUrl: string;
  posterImage: string;
  durationSeconds: number;
}

export const MUAZZIN_PRESETS: MuazzinPreset[] = [
  {
    id: 'makkah',
    nameAr: 'أذان الحرم المكي الشريف',
    nameEn: 'Makkah Al-Haram Adhan',
    locationAr: 'مكة المكرمة - المملكة العربية السعودية',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/makkah.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-the-mecca-at-night-42618-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    durationSeconds: 215,
  },
  {
    id: 'madinah',
    nameAr: 'أذان المسجد النبوي الشريف',
    nameEn: 'Madinah Al-Nabawi Adhan',
    locationAr: 'المدينة المنورة - المملكة العربية السعودية',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/madina.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-the-prophet-mosque-in-medina-saudi-arabia-42621-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    durationSeconds: 210,
  },
  {
    id: 'alaqsa',
    nameAr: 'أذان المسجد الأقصى المبارك',
    nameEn: 'Al-Aqsa Mosque Adhan',
    locationAr: 'القدس الشريف - فلسطين',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/aqsa.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dome-of-the-rock-in-jerusalem-42619-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
    durationSeconds: 220,
  },
  {
    id: 'abdulbasit',
    nameAr: 'الشيخ عبد الباسط عبد الصمد (أذان تاريخي)',
    nameEn: 'Sheikh Abdulbasit Abdussamad',
    locationAr: 'القاهرة - مصر',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/abdulbasit.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-over-a-mosque-42617-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    durationSeconds: 195,
  },
  {
    id: 'alafasy',
    nameAr: 'الشيخ مشاري راشد العفاسي',
    nameEn: 'Sheikh Mishary Rashid Alafasy',
    locationAr: 'الكويت',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/mishary.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-grand-mosque-in-abu-dhabi-at-sunset-42620-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    durationSeconds: 200,
  },
  {
    id: 'cairo',
    nameAr: 'أذان القاهرة - جامع الأزهر الشريف',
    nameEn: 'Cairo Al-Azhar Adhan',
    locationAr: 'القاهرة - مصر',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/egypt.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-over-a-mosque-42617-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    durationSeconds: 190,
  },
  {
    id: 'fajr_special',
    nameAr: 'أذان الفجر (الصلاة خير من النوم - الحرم)',
    nameEn: 'Special Fajr Adhan (Makkah)',
    locationAr: 'مكة المكرمة (بترديد الصلاة خير من النوم)',
    isFajrSpecial: true,
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/fajr.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-the-prophet-mosque-in-medina-saudi-arabia-42621-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    durationSeconds: 230,
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a gentle bell / chime for approaching alert
  playGentleBell(volume: number = 0.7) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const freqs = [528, 660, 792, 1056];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime((volume / freqs.length) * 0.6, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 2.6);
      });
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Play a double beep
  playBeep(volume: number = 0.5) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      [0, 0.2].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now + offset);

        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(volume * 0.5, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.16);
      });
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Play Tasbeeh click / ping (for electronic counter)
  playTasbeehClick() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Play Takbeer tone sequence (الله أكبر الله أكبر)
  playTakbeerTone(volume: number = 0.8) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Melodic notes representing Takbeer
      const notes = [
        { freq: 440, time: 0.0, dur: 0.6 },
        { freq: 523.25, time: 0.6, dur: 0.5 },
        { freq: 587.33, time: 1.1, dur: 0.8 },
        { freq: 523.25, time: 2.0, dur: 0.6 },
        { freq: 440, time: 2.6, dur: 1.0 },
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(0, now + note.time);
        gain.gain.linearRampToValueAtTime(volume * 0.4, now + note.time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur + 0.05);
      });
    } catch (e) {
      console.warn('Takbeer tone failed:', e);
    }
  }

  // Play Iqama tone sequence
  playIqamaTone(volume: number = 0.7) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const notes = [
        { freq: 392, time: 0.0, dur: 0.3 },
        { freq: 440, time: 0.35, dur: 0.3 },
        { freq: 523.25, time: 0.7, dur: 0.6 },
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(0, now + note.time);
        gain.gain.linearRampToValueAtTime(volume * 0.4, now + note.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur + 0.05);
      });
    } catch (e) {
      console.warn('Iqama tone failed:', e);
    }
  }

  // Play Makkah Chime (رنين الحرم المكي الوقور)
  playMakkahChime(volume: number = 0.75) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const chords = [
        { freqs: [440, 554.37, 659.25], time: 0.0, dur: 1.2 },
        { freqs: [493.88, 622.25, 739.99], time: 0.8, dur: 1.4 },
        { freqs: [523.25, 659.25, 783.99, 1046.50], time: 1.6, dur: 2.2 },
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + chord.time);

          gain.gain.setValueAtTime(0, now + chord.time);
          gain.gain.linearRampToValueAtTime((volume / chord.freqs.length) * 0.5, now + chord.time + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.time + chord.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + chord.time);
          osc.stop(now + chord.time + chord.dur + 0.1);
        });
      });
    } catch (e) {
      console.warn('Makkah chime failed:', e);
    }
  }

  // Play Duaa tone (نغمة الدعاء والخشوع)
  playDuaaTone(volume: number = 0.7) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const freqs = [329.63, 392.00, 493.88, 587.33, 659.25];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime((volume / freqs.length) * 0.6, now + idx * 0.18 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 1.9);
      });
    } catch (e) {
      console.warn('Duaa tone failed:', e);
    }
  }

  // Play Soft Gong (صدى نغمي دافئ)
  playSoftGong(volume: number = 0.6) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 2.0);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    } catch (e) {
      console.warn('Soft gong failed:', e);
    }
  }

  // Ramadan Musaharati Drum & Traditional Chants
  playMusaharatiDrum(volume: number = 0.85) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Traditional Drum Pattern: Dum... Dum-Tak... Dum... Dum-Tak...
      const strikes = [
        { time: 0.0, freq: 85, dur: 0.35, isTak: false },
        { time: 0.35, freq: 85, dur: 0.35, isTak: false },
        { time: 0.7, freq: 240, dur: 0.15, isTak: true },
        { time: 1.1, freq: 85, dur: 0.45, isTak: false },
        { time: 1.6, freq: 85, dur: 0.35, isTak: false },
        { time: 1.95, freq: 240, dur: 0.15, isTak: true },
        { time: 2.3, freq: 85, dur: 0.6, isTak: false },
        { time: 3.0, freq: 85, dur: 0.35, isTak: false },
        { time: 3.35, freq: 85, dur: 0.35, isTak: false },
        { time: 3.7, freq: 240, dur: 0.15, isTak: true },
      ];

      strikes.forEach((st) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = st.isTak ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(st.freq, now + st.time);
        if (!st.isTak) {
          osc.frequency.exponentialRampToValueAtTime(45, now + st.time + st.dur);
        }

        gain.gain.setValueAtTime(0, now + st.time);
        gain.gain.linearRampToValueAtTime(volume * (st.isTak ? 0.6 : 0.9), now + st.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + st.time + st.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + st.time);
        osc.stop(now + st.time + st.dur + 0.05);
      });
    } catch (e) {
      console.warn('Musaharati drum failed:', e);
    }
  }

  playMusaharatiPreset(presetId: string, volume: number = 0.85) {
    this.playMusaharatiDrum(volume);
    setTimeout(() => {
      switch (presetId) {
        case 'ya_nayem':
          this.speakArabic('اصحى يا نايم وحد الدايم.. رمضان كريم.. قوموا لسحوركم يرحمكم الله');
          break;
        case 'traditional_chant':
          this.speakArabic('يا عباد الله وحدوا الله.. لا إله إلا الله محمد رسول الله.. تسحروا فإن في السحور بركة');
          break;
        case 'makkah_sahur':
          this.speakArabic('سحوركم مبارك يا صائمين.. تقبل الله طاعتكم وصيامكم');
          break;
        case 'sahur_drum':
        default:
          // Just drum rhythms
          break;
      }
    }, 400);
  }

  stopAll() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.suspend();
      } catch {
        // ignore
      }
    }
  }

  // Unified Alert Sound Player
  playAlertSound(soundType: string, volume: number = 0.8) {
    switch (soundType) {
      case 'gentle_bell':
        this.playGentleBell(volume);
        break;
      case 'takbeer':
        this.playTakbeerTone(volume);
        break;
      case 'iqama':
        this.playIqamaTone(volume);
        break;
      case 'makkah_chime':
        this.playMakkahChime(volume);
        break;
      case 'duaa_tone':
        this.playDuaaTone(volume);
        break;
      case 'soft_gong':
        this.playSoftGong(volume);
        break;
      case 'tasbeeh':
        this.playTasbeehClick();
        break;
      case 'beep':
        this.playBeep(volume);
        break;
      case 'voice_reminder':
        this.speakArabic('اقترب موعد الصلاة، استعد للوضوء والصلاة وأداء السنن');
        break;
      case 'voice_fajr':
        this.speakArabic('الصلاة خير من النوم، استعد لصلاة الفجر وسنتها المباركة');
        break;
      case 'voice_kahf':
        this.speakArabic('تذكير بسورة الكهف والتبكير لصلاة الجمعة المباركة والصلاة على النبي');
        break;
      case 'voice_wudu':
        this.speakArabic('حان وقت إسباغ الوضوء والتأهب للصلاة');
        break;
      default:
        this.playGentleBell(volume);
        break;
    }
  }

  // Voice narration in Arabic using SpeechSynthesis
  speakArabic(text: string) {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Try to find an Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.name.includes('Arabic'));
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis failed:', e);
      }
    }
  }
}

export const soundEngine = new SoundEngine();

export interface AlertSoundOption {
  id: string;
  nameAr: string;
  descriptionAr: string;
  category: 'tones' | 'voices';
  iconName?: string;
}

export const ALERT_SOUND_OPTIONS: AlertSoundOption[] = [
  {
    id: 'gentle_bell',
    nameAr: 'جرس إسلامي هادئ ووقور',
    descriptionAr: 'رنين نغمي متناغم وخافت يبعث على الهدوء',
    category: 'tones',
  },
  {
    id: 'takbeer',
    nameAr: 'نغمة التكبير (الله أكبر)',
    descriptionAr: 'أنغام تكبيرات الصلاة والنداء',
    category: 'tones',
  },
  {
    id: 'makkah_chime',
    nameAr: 'رنين الحرم المكي الشريف',
    descriptionAr: 'نغمات كلاسيكية تذكر بأجواء الحرم',
    category: 'tones',
  },
  {
    id: 'iqama',
    nameAr: 'نغمة الإقامة والتأهب',
    descriptionAr: 'نغمات سريعة للتأهب والاصطفاف',
    category: 'tones',
  },
  {
    id: 'duaa_tone',
    nameAr: 'نغمة الدعاء والخشوع',
    descriptionAr: 'أوتار هادئة للاستغفار والدعاء',
    category: 'tones',
  },
  {
    id: 'soft_gong',
    nameAr: 'صدى نغمي دافئ (Gong)',
    descriptionAr: 'صدى منخفض ومريح للتنبيه الهادئ',
    category: 'tones',
  },
  {
    id: 'tasbeeh',
    nameAr: 'نقرة تسبيح إلكترونية',
    descriptionAr: 'صوت نقرة العداد النقي',
    category: 'tones',
  },
  {
    id: 'beep',
    nameAr: 'تنبيه رقمي حديث (Beep)',
    descriptionAr: 'نغمة تنبيه واضحة ومميزة',
    category: 'tones',
  },
  {
    id: 'voice_reminder',
    nameAr: 'صوت ناطق: اقتربت الصلاة',
    descriptionAr: 'تنبيه صوتي ناطق باللغة العربية للاستعداد',
    category: 'voices',
  },
  {
    id: 'voice_fajr',
    nameAr: 'صوت ناطق: الصلاة خير من النوم',
    descriptionAr: 'تنبيه ناطق مخصص للاستيقاظ وسنة الفجر',
    category: 'voices',
  },
  {
    id: 'voice_kahf',
    nameAr: 'صوت ناطق: سورة الكهف والجمعة',
    descriptionAr: 'تذكير ناطق بسورة الكهف والصلاة على النبي ﷺ',
    category: 'voices',
  },
  {
    id: 'voice_wudu',
    nameAr: 'صوت ناطق: إسباغ الوضوء والتأهب',
    descriptionAr: 'تنبيه ناطق للتطهر وإسباغ الوضوء',
    category: 'voices',
  },
];

