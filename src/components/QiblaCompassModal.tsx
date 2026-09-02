import React, { useState, useEffect } from 'react';
import { X, Compass, MapPin, Navigation, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';
import { calculateQiblaBearing, calculateDistanceToKaaba, getBearingNameAr } from '../utils/qibla';

interface QiblaCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const QiblaCompassModal: React.FC<QiblaCompassModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState(false);

  const { lat, lng } = settings.city;
  const qiblaAngle = calculateQiblaBearing(lat, lng);
  const distanceKm = calculateDistanceToKaaba(lat, lng);
  const directionName = getBearingNameAr(qiblaAngle);

  // Device orientation listener (for mobile device compass)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const iosHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (iosHeading !== undefined) {
        // iOS
        setDeviceHeading(iosHeading);
        setHasCompassSensor(true);
      } else if (e.alpha !== null) {
        // Android
        setDeviceHeading(360 - e.alpha);
        setHasCompassSensor(true);
      }
    };

    if (isOpen && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Visual dial rotation: Qibla relative to top
  const needleRotation = qiblaAngle - deviceHeading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">بوصلة اتجاه القبلة</h3>
              <p className="text-xs text-slate-400">نحو الكعبة المشرفة بمكة المكرمة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location & Bearing Stats */}
        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 mb-1">زاوية القبلة الدقيقة</div>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {qiblaAngle.toFixed(1)}°
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{directionName}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 mb-1">المسافة إلى مكة</div>
            <div className="text-lg font-black text-amber-400 font-mono">
              {distanceKm.toLocaleString('ar-EG')} كم
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">خط جوي مباشر</div>
          </div>
        </div>

        {/* The Graphic Compass Dial */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-64 h-64 rounded-full bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Cardinal Marks (N, S, E, W) */}
            <span className="absolute top-2 text-xs font-bold text-rose-500 font-mono">ش (N)</span>
            <span className="absolute bottom-2 text-xs font-bold text-slate-400 font-mono">ج (S)</span>
            <span className="absolute right-2 text-xs font-bold text-slate-400 font-mono">ق (E)</span>
            <span className="absolute left-2 text-xs font-bold text-slate-400 font-mono">غ (W)</span>

            {/* Inner Ring with Kaaba Pointer */}
            <div
              className="relative w-48 h-48 rounded-full border border-emerald-500/40 flex items-center justify-center transition-transform duration-300"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              {/* Kaaba Marker on top of dial */}
              <div className="absolute -top-3 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <div className="w-3 h-3 bg-amber-400 rounded-sm" />
                </div>
                <div className="w-0.5 h-6 bg-emerald-400 mt-0.5" />
              </div>

              {/* Center Needle Pivot */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 ring-4 ring-emerald-950 shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-4">
            {hasCompassSensor
              ? 'قم بتدوير هاتفك حتى يشير المؤشر الذهبي إلى الكعبة المشرفة'
              : `الاتجاه هو ${qiblaAngle.toFixed(1)}° من الشمال الجغرافي باتجاه ${directionName}`}
          </p>
        </div>

        {/* City Info footer */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-center text-slate-300 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>الموقع الحالي: {settings.city.nameAr} ({settings.city.countryAr})</span>
        </div>
      </div>
    </div>
  );
};
