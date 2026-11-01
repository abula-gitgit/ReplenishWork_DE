import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Clock, 
  ShoppingCart, 
  Check, 
  ExternalLink, 
  X
} from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { getCalendarGrid, getTodayString, parseDate, formatDateDisplay } from '../utils/dateCalc';

interface CalendarViewProps {
  items: CalculatedItem[];
  onQuickReplace: (item: CalculatedItem) => void;
  onCustomReplace: (item: CalculatedItem) => void;
  onEdit: (item: CalculatedItem) => void;
  onViewHistory: (item: CalculatedItem) => void;
}

export interface DayEvent {
  type: 'replacement' | 'purchase';
  item: CalculatedItem;
}

const MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

const WEEKDAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  items,
  onQuickReplace,
  onCustomReplace,
  onViewHistory
}) => {
  const todayStr = getTodayString();
  const todayDate = parseDate(todayStr);

  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth());
  const [selectedDayDateStr, setSelectedDayDateStr] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonth(todayDate.getMonth());
    setSelectedDayDateStr(todayStr);
  };

  // Monatsgitter
  const calendarDays = useMemo(() => {
    return getCalendarGrid(currentYear, currentMonth, todayStr);
  }, [currentYear, currentMonth, todayStr]);

  // Ereignisse nach Datum sortiert
  const eventsByDate = useMemo(() => {
    const map = new Map<string, DayEvent[]>();

    items.forEach((item) => {
      // Wechseltermin
      if (item.nextReplacementDate) {
        const list = map.get(item.nextReplacementDate) || [];
        list.push({ type: 'replacement', item });
        map.set(item.nextReplacementDate, list);
      }
      // Nachbestelltermin
      if (item.purchaseReminderDate) {
        const list = map.get(item.purchaseReminderDate) || [];
        list.push({ type: 'purchase', item });
        map.set(item.purchaseReminderDate, list);
      }
    });

    return map;
  }, [items]);

  const selectedDayEvents = selectedDayDateStr ? eventsByDate.get(selectedDayDateStr) || [] : [];

  return (
    <div className="space-y-4">
      {/* Kalender-Steuerleiste */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200/60 transition active:scale-95 cursor-pointer"
          >
            Heute
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Legende */}
          <div className="hidden md:flex items-center gap-3 text-xs font-semibold text-slate-600 mr-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Wechseltermin</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Bestelltermin</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition active:scale-95 cursor-pointer"
              title="Vorheriger Monat"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition active:scale-95 cursor-pointer"
              title="Nächster Monat"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Kalendertabelle */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Wochentags-Kopfzeile */}
        <div className="grid grid-cols-7 border-b border-slate-200 text-center text-xs font-bold text-slate-400 py-2.5 bg-slate-50/70">
          {WEEKDAY_NAMES.map((w, idx) => (
            <div key={w} className={idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-blue-500' : ''}>
              {w}
            </div>
          ))}
        </div>

        {/* Tageszellen */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {calendarDays.map((day, idx) => {
            const dayEvents = eventsByDate.get(day.dateStr) || [];
            const hasReplacement = dayEvents.some((e) => e.type === 'replacement');
            const hasPurchase = dayEvents.some((e) => e.type === 'purchase');
            const isSelected = selectedDayDateStr === day.dateStr;

            return (
              <div
                key={idx}
                onClick={() => setSelectedDayDateStr(day.dateStr)}
                className={`min-h-[75px] sm:min-h-[95px] p-1.5 sm:p-2 transition-all cursor-pointer flex flex-col justify-between ${
                  !day.isCurrentMonth
                    ? 'bg-slate-50/40 text-slate-300'
                    : isSelected
                    ? 'bg-blue-50/80 ring-2 ring-blue-500/40'
                    : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      day.isToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : day.isWeekend === 'sun'
                        ? 'text-rose-600'
                        : day.isWeekend === 'sat'
                        ? 'text-blue-600'
                        : ''
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-black text-slate-400">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Ereignis-Badges */}
                <div className="space-y-1 mt-1">
                  {hasReplacement && (
                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 truncate">
                      <Clock className="w-3 h-3 shrink-0 text-rose-500" />
                      <span className="truncate">
                        {dayEvents.filter((e) => e.type === 'replacement')[0].item.name}
                      </span>
                    </div>
                  )}

                  {hasPurchase && (
                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 truncate">
                      <ShoppingCart className="w-3 h-3 shrink-0 text-sky-500" />
                      <span className="truncate">
                        {dayEvents.filter((e) => e.type === 'purchase')[0].item.name}
                      </span>
                    </div>
                  )}

                  {/* Mobile Indikatoren */}
                  <div className="flex sm:hidden items-center justify-center gap-1 mt-1">
                    {hasReplacement && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    {hasPurchase && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailansicht des ausgewählten Tages */}
      {selectedDayDateStr && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Termine am {formatDateDisplay(selectedDayDateStr)}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {selectedDayEvents.length} Ereignis(se)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDayDateStr(null)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              Keine Wechsel- oder Bestelltermine an diesem Tag eingetragen.
            </p>
          ) : (
            <div className="space-y-2.5">
              {selectedDayEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    evt.type === 'replacement'
                      ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                      : 'bg-sky-50/50 border-sky-200 text-sky-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        evt.type === 'replacement'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-sky-100 text-sky-600'
                      }`}
                    >
                      {evt.type === 'replacement' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {evt.item.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            evt.type === 'replacement'
                              ? 'bg-rose-200 text-rose-800'
                              : 'bg-sky-200 text-sky-800'
                          }`}
                        >
                          {evt.type === 'replacement' ? 'Wechsel fällig' : 'Nachbestellung (Vorlauf)'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Kategorie: {evt.item.category}
                        {evt.item.location ? ` • Ort: ${evt.item.location}` : ''}
                        {evt.item.manager ? ` • Zuständig: ${evt.item.manager}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {evt.item.purchaseUrl && (
                      <a
                        href={evt.item.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>Lieferant</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onQuickReplace(evt.item)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                      <span>Heute ersetzt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
