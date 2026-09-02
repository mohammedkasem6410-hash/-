import React, { useState, useMemo } from 'react';
import { X, Calendar, ChevronRight, ChevronLeft, Printer, MapPin, Download } from 'lucide-react';
import { AppSettings } from '../types';
import { getMonthlyCalendar } from '../utils/prayerEngine';

interface MonthlyCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const MonthlyCalendarModal: React.FC<MonthlyCalendarModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const calendarRows = useMemo(() => {
    return getMonthlyCalendar(year, month, settings);
  }, [year, month, settings]);

  const monthNameAr = new Intl.DateTimeFormat('ar-EG', {
    month: 'long',
    year: 'numeric',
  }).format(currentMonthDate);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handlePrint = () => {
    window.print();
  };

  const todayDateNumber = new Date().getDate();
  const isCurrentActiveMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-600/20 border border-teal-500/30 text-teal-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">إمساكية ومواقيت الصلاة للشهر</h3>
              <p className="text-xs text-slate-400">
                مدينة {settings.city.nameAr} ({settings.city.countryAr}) - طريقة الحساب: {settings.method}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1 text-xs"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الشهر السابق</span>
          </button>

          <div className="text-sm font-bold text-emerald-300">
            {monthNameAr}
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1 text-xs"
          >
            <span>الشهر التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 sticky top-0">
              <tr>
                <th className="p-3">اليوم</th>
                <th className="p-3">الميلادي</th>
                <th className="p-3">الهجري</th>
                <th className="p-3 text-emerald-400">الفجر</th>
                <th className="p-3 text-amber-400">الشروق</th>
                <th className="p-3 text-amber-300">الظهر</th>
                <th className="p-3 text-orange-400">العصر</th>
                <th className="p-3 text-rose-400">المغرب</th>
                <th className="p-3 text-blue-400">العشاء</th>
                <th className="p-3 text-indigo-400">قيام الليل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {calendarRows.map((row) => {
                const isToday = isCurrentActiveMonth && row.day === todayDateNumber;

                return (
                  <tr
                    key={row.day}
                    className={`transition-colors ${
                      isToday
                        ? 'bg-emerald-950/50 text-white font-bold ring-1 ring-emerald-500/40'
                        : 'hover:bg-slate-900/50 text-slate-300'
                    }`}
                  >
                    <td className="p-2.5 font-bold">
                      <div className="flex items-center gap-1.5">
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                        <span>{row.dayName}</span>
                      </div>
                    </td>
                    <td className="p-2.5 font-mono">{row.day}</td>
                    <td className="p-2.5 font-medium text-amber-300/90">{row.hijriFormatted}</td>
                    <td className="p-2.5 font-mono font-bold text-emerald-400">{row.fajr}</td>
                    <td className="p-2.5 font-mono text-amber-400/80">{row.sunrise}</td>
                    <td className="p-2.5 font-mono font-bold">{row.dhuhr}</td>
                    <td className="p-2.5 font-mono font-bold text-orange-300">{row.asr}</td>
                    <td className="p-2.5 font-mono font-bold text-rose-400">{row.maghrib}</td>
                    <td className="p-2.5 font-mono font-bold text-blue-300">{row.isha}</td>
                    <td className="p-2.5 font-mono text-indigo-300">{row.qiyam}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
