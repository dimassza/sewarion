import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface DateRangePickerProps {
  onSelect: (range: { startDate: Date; endDate: Date; totalDays: number }) => void;
  bookedRanges?: { start: string; end: string }[];
  initialStart?: Date | null;
  initialEnd?: Date | null;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = day.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function isBooked(day: Date, bookedRanges: { start: string; end: string }[]): boolean {
  const t = day.getTime();
  for (const range of bookedRanges) {
    const s = new Date(range.start).getTime();
    const e = new Date(range.end).getTime();
    if (t >= s && t <= e) return true;
  }
  return false;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function DateRangePicker({ onSelect, bookedRanges = [], initialStart = null, initialEnd = null }: DateRangePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const years = useMemo(() => {
    const startYear = new Date().getFullYear();
    const arr = [];
    for (let y = startYear; y <= startYear + 5; y++) {
      arr.push(y);
    }
    return arr;
  }, []);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [startDate, setStartDate] = useState<Date | null>(initialStart);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd);
  const [isOpen, setIsOpen] = useState(false);

  const totalDays = useMemo(() => {
    if (startDate && endDate) {
      return Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return 0;
  }, [startDate, endDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: Date) => {
    if (day < today) return;
    if (isBooked(day, bookedRanges)) return;

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(day);
      setEndDate(null);
    } else {
      // Complete selection
      if (day < startDate) {
        setStartDate(day);
        setEndDate(startDate);
        const days = Math.max(1, Math.round((startDate.getTime() - day.getTime()) / (1000 * 60 * 60 * 24)));
        onSelect({ startDate: day, endDate: startDate, totalDays: days });
      } else {
        // Check no booked day in between
        let hasConflict = false;
        const checkDate = new Date(startDate);
        while (checkDate <= day) {
          if (isBooked(checkDate, bookedRanges)) {
            hasConflict = true;
            break;
          }
          checkDate.setDate(checkDate.getDate() + 1);
        }
        if (hasConflict) {
          // Reset — can't book across booked dates
          setStartDate(day);
          setEndDate(null);
          return;
        }
        setEndDate(day);
        const days = Math.max(1, Math.round((day.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        onSelect({ startDate, endDate: day, totalDays: days });
      }
    }
  };

  const formatDisplayDate = (d: Date | null) => {
    if (!d) return '—';
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
  };

  // Build calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(currentYear, currentMonth, d));
  }

  // Can't go before current month
  const canGoPrev = currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  return (
    <div className="relative w-full">
      {/* Trigger / Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-[#f4fcf0] dark:bg-[#1a2319]/40 px-4 py-3 rounded-2xl border border-[#bdcaba] dark:border-[#2b3a27] hover:border-[#006b2c] dark:hover:border-[#00873a] focus:border-[#006b2c] dark:focus:border-[#00873a] focus:ring-1 focus:ring-[#006b2c] dark:focus:ring-[#00873a] transition-all text-left"
      >
        <CalendarDays className="text-[#006b2c] dark:text-[#52d681] w-5 h-5 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-[9px] text-[#6e7b6c] dark:text-[#8ea08c] uppercase font-bold tracking-wider">Tanggal Sewa</span>
          <span className="text-xs font-bold text-[#171d16] dark:text-[#dde5d9]">
            {startDate ? `${formatDisplayDate(startDate)} — ${formatDisplayDate(endDate)}` : 'Pilih tanggal mulai & selesai'}
          </span>
        </div>
        {totalDays > 0 && (
          <span className="bg-[#006b2c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {totalDays} hari
          </span>
        )}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-[#151d14] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/45 border border-[#bdcaba]/40 dark:border-[#2b3a27] p-4 animate-in">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${canGoPrev ? 'hover:bg-[#eff6ea] dark:hover:bg-[#202c1e] text-[#171d16] dark:text-[#dde5d9]' : 'text-[#bdcaba] dark:text-[#435241] cursor-not-allowed'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              <select
                value={currentMonth}
                onChange={(e) => {
                  const nextMonth = parseInt(e.target.value, 10);
                  if (currentYear === today.getFullYear() && nextMonth < today.getMonth()) {
                    setCurrentMonth(today.getMonth());
                  } else {
                    setCurrentMonth(nextMonth);
                  }
                }}
                className="bg-transparent border-0 hover:bg-[#eff6ea] dark:hover:bg-[#202c1e] rounded-lg px-2 py-1 font-bold text-sm text-[#171d16] dark:text-[#dde5d9] focus:ring-1 focus:ring-[#006b2c] outline-none cursor-pointer font-sans"
              >
                {MONTH_NAMES.map((name, index) => {
                  const isDisabled = currentYear === today.getFullYear() && index < today.getMonth();
                  return (
                    <option key={index} value={index} disabled={isDisabled} className="bg-white dark:bg-[#151d14] text-[#171d16] dark:text-[#dde5d9]">
                      {name}
                    </option>
                  );
                })}
              </select>

              <select
                value={currentYear}
                onChange={(e) => {
                  const nextYear = parseInt(e.target.value, 10);
                  setCurrentYear(nextYear);
                  if (nextYear === today.getFullYear() && currentMonth < today.getMonth()) {
                    setCurrentMonth(today.getMonth());
                  }
                }}
                className="bg-transparent border-0 hover:bg-[#eff6ea] dark:hover:bg-[#202c1e] rounded-lg px-2 py-1 font-bold text-sm text-[#171d16] dark:text-[#dde5d9] focus:ring-1 focus:ring-[#006b2c] outline-none cursor-pointer font-sans"
              >
                {years.map((yr) => (
                  <option key={yr} value={yr} className="bg-white dark:bg-[#151d14] text-[#171d16] dark:text-[#dde5d9]">
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#eff6ea] dark:hover:bg-[#202c1e] text-[#171d16] dark:text-[#dde5d9] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map((name) => (
              <div key={name} className="text-center text-[10px] font-bold text-[#6e7b6c] dark:text-[#8ea08c] uppercase tracking-wider py-1">
                {name}
              </div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const isPast = day < today;
              const bookedDay = isBooked(day, bookedRanges);
              const isStart = startDate && isSameDay(day, startDate);
              const isEnd = endDate && isSameDay(day, endDate);
              const inRange = isInRange(day, startDate, endDate);
              const isToday = isSameDay(day, today);
              const disabled = isPast || bookedDay;

              let className = 'aspect-square rounded-xl flex items-center justify-center text-xs font-semibold transition-all relative ';

              if (disabled) {
                className += bookedDay
                  ? 'bg-red-50 dark:bg-red-950/20 text-red-300 dark:text-red-900 cursor-not-allowed line-through'
                  : 'text-[#bdcaba] dark:text-[#435241] cursor-not-allowed';
              } else if (isStart || isEnd) {
                className += 'bg-[#006b2c] text-white shadow-md cursor-pointer hover:bg-[#00873a]';
              } else if (inRange) {
                className += 'bg-[#006b2c]/10 dark:bg-[#006b2c]/20 text-[#006b2c] dark:text-[#52d681] cursor-pointer hover:bg-[#006b2c]/20 dark:hover:bg-[#006b2c]/30';
              } else {
                className += 'text-[#171d16] dark:text-[#dde5d9] cursor-pointer hover:bg-[#eff6ea] dark:hover:bg-[#202c1e]';
              }

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => !disabled && handleDayClick(day)}
                  disabled={disabled}
                  className={className}
                >
                  {day.getDate()}
                  {isToday && !isStart && !isEnd && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#006b2c] dark:bg-[#52d681]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#eff6ea] dark:border-[#2b3a27]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#006b2c]" />
              <span className="text-[10px] text-[#6e7b6c] dark:text-[#8ea08c]">Dipilih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#006b2c]/10 dark:bg-[#006b2c]/20" />
              <span className="text-[10px] text-[#6e7b6c] dark:text-[#8ea08c]">Rentang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35" />
              <span className="text-[10px] text-[#6e7b6c] dark:text-[#8ea08c]">Sudah dibooking</span>
            </div>
          </div>

          {/* Summary & Close */}
          {startDate && endDate && (
            <div className="mt-3 pt-3 border-t border-[#eff6ea] dark:border-[#2b3a27] flex justify-between items-center">
              <p className="text-xs text-[#3e4a3d] dark:text-[#dde5d9]">
                <span className="font-bold text-[#006b2c] dark:text-[#52d681]">{totalDays} hari</span> · {formatDisplayDate(startDate)} — {formatDisplayDate(endDate)}
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-[#006b2c] text-white text-[11px] font-bold px-4 py-2 rounded-full hover:bg-[#00873a] transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          )}

          {!startDate && (
            <p className="text-[11px] text-[#6e7b6c] dark:text-[#8ea08c] mt-3 text-center">Klik tanggal untuk memilih tanggal mulai sewa</p>
          )}
          {startDate && !endDate && (
            <p className="text-[11px] text-[#006b2c] dark:text-[#52d681] font-semibold mt-3 text-center">Sekarang pilih tanggal selesai sewa</p>
          )}
        </div>
      )}
    </div>
  );
}
