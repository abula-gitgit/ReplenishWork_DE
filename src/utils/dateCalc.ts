import { ConsumableItem, CalculatedItem, CycleUnit, ItemStatus } from '../types/consumable';

/**
 * Gibt das heutige Datum im Format YYYY-MM-DD (lokale Zeit) zurück
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parst eine YYYY-MM-DD Zeichenkette in ein lokales Date-Objekt
 */
export function parseDate(dateStr: string): Date {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Formatiert ein Date-Objekt in YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatiert das Datum lesbar auf Deutsch: z.B. 5. Nov. 2026 (Do.)
 */
export function formatDateDisplay(dateStr: string, includeDayOfWeek: boolean = true): string {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  const months = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];
  const daysOfWeek = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];

  const year = date.getFullYear();
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const dayOfWeek = daysOfWeek[date.getDay()];

  if (includeDayOfWeek) {
    return `${day}. ${monthName} ${year} (${dayOfWeek})`;
  }
  return `${day}. ${monthName} ${year}`;
}

/**
 * Addiert ein Zyklusintervall zu einem Startdatum
 */
export function addCycle(startDateStr: string, cycleValue: number, cycleUnit: CycleUnit): string {
  const startDate = parseDate(startDateStr);
  const val = Math.max(1, Math.floor(cycleValue));

  if (cycleUnit === 'day') {
    startDate.setDate(startDate.getDate() + val);
    return formatDate(startDate);
  }

  if (cycleUnit === 'week') {
    startDate.setDate(startDate.getDate() + val * 7);
    return formatDate(startDate);
  }

  if (cycleUnit === 'month') {
    const origDay = startDate.getDate();
    const targetMonth = startDate.getMonth() + val;
    startDate.setDate(1);
    startDate.setMonth(targetMonth);
    const maxDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    startDate.setDate(Math.min(origDay, maxDays));
    return formatDate(startDate);
  }

  if (cycleUnit === 'year') {
    const origDay = startDate.getDate();
    const origMonth = startDate.getMonth();
    const targetYear = startDate.getFullYear() + val;
    startDate.setFullYear(targetYear);
    if (origMonth === 1 && origDay === 29) {
      const isLeap = (targetYear % 4 === 0 && targetYear % 100 !== 0) || (targetYear % 400 === 0);
      if (!isLeap) startDate.setDate(28);
    }
    return formatDate(startDate);
  }

  return startDateStr;
}

/**
 * Subtrahiert Tage von einem Datum
 */
export function subtractDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() - Math.max(0, Math.floor(days)));
  return formatDate(date);
}

/**
 * Berechnet Differenz in Tagen
 */
export function diffInDays(targetDateStr: string, baseDateStr: string): number {
  const target = parseDate(targetDateStr).getTime();
  const base = parseDate(baseDateStr).getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((target - base) / msPerDay);
}

/**
 * Berechnet Termine und Status für einen Verbrauchsartikel
 */
export function calculateItem(item: ConsumableItem, todayStr: string = getTodayString()): CalculatedItem {
  const nextReplacementDate = addCycle(item.lastReplacedDate, item.cycleValue, item.cycleUnit);
  const purchaseLeadDays = item.purchaseLeadDays ?? 3;
  const purchaseReminderDate = subtractDays(nextReplacementDate, purchaseLeadDays);

  const daysUntilReplacement = diffInDays(nextReplacementDate, todayStr);
  const daysUntilPurchase = diffInDays(purchaseReminderDate, todayStr);

  let status: ItemStatus;
  let statusLabel: string;

  if (daysUntilReplacement < 0) {
    status = 'overdue';
    const overdueDays = Math.abs(daysUntilReplacement);
    statusLabel = `${overdueDays} T. überfällig`;
  } else if (daysUntilReplacement === 0) {
    status = 'today';
    statusLabel = 'Heute fällig!';
  } else if (daysUntilPurchase <= 0) {
    status = 'buy_soon';
    statusLabel = 'Nachbestellen';
  } else {
    status = 'normal';
    statusLabel = 'Im Plan';
  }

  const totalDays = Math.max(1, diffInDays(nextReplacementDate, item.lastReplacedDate));
  let lifeRemainingPercent = 0;
  if (daysUntilReplacement > 0) {
    lifeRemainingPercent = Math.min(100, Math.max(0, Math.round((daysUntilReplacement / totalDays) * 100)));
  } else {
    lifeRemainingPercent = 0;
  }

  return {
    ...item,
    nextReplacementDate,
    purchaseReminderDate,
    daysUntilReplacement,
    daysUntilPurchase,
    lifeRemainingPercent,
    status,
    statusLabel
  };
}

/**
 * Sortierung nach Dringlichkeit
 */
export function sortCalculatedItems(items: CalculatedItem[]): CalculatedItem[] {
  const statusRank: Record<ItemStatus, number> = {
    overdue: 1,
    today: 2,
    buy_soon: 3,
    normal: 4
  };

  return [...items].sort((a, b) => {
    const rankDiff = statusRank[a.status] - statusRank[b.status];
    if (rankDiff !== 0) return rankDiff;

    if (a.status === 'overdue' && b.status === 'overdue') {
      return a.daysUntilReplacement - b.daysUntilReplacement;
    }

    if (a.nextReplacementDate !== b.nextReplacementDate) {
      return a.nextReplacementDate.localeCompare(b.nextReplacementDate);
    }

    return a.name.localeCompare(b.name, 'de');
  });
}

/**
 * Formatiert das Zyklusintervall auf Deutsch
 */
export function formatCycleDisplay(cycleValue: number, cycleUnit: CycleUnit): string {
  const unitLabels: Record<CycleUnit, { singular: string; plural: string }> = {
    day: { singular: 'Tag', plural: 'Tage' },
    week: { singular: 'Woche', plural: 'Wochen' },
    month: { singular: 'Monat', plural: 'Monate' },
    year: { singular: 'Jahr', plural: 'Jahre' }
  };

  const label = cycleValue <= 1 ? unitLabels[cycleUnit].singular : unitLabels[cycleUnit].plural;
  return `${cycleValue} ${label}`;
}

export interface CalendarDayInfo {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: 'sun' | 'sat' | null;
}

/**
 * Erzeugt Kalendergitter für Monat
 */
export function getCalendarGrid(year: number, month: number, todayStr: string = getTodayString()): CalendarDayInfo[] {
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();

  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days: CalendarDayInfo[] = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDate(prevDate);
    const dayOfWeek = prevDate.getDay();
    days.push({
      date: prevDate,
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 ? 'sun' : dayOfWeek === 6 ? 'sat' : null
    });
  }

  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month, d);
    const dateStr = formatDate(curDate);
    const dayOfWeek = curDate.getDay();
    days.push({
      date: curDate,
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 ? 'sun' : dayOfWeek === 6 ? 'sat' : null
    });
  }

  const trailingDaysNeeded = (7 - (days.length % 7)) % 7;
  for (let t = 1; t <= trailingDaysNeeded; t++) {
    const nextDate = new Date(year, month + 1, t);
    const dateStr = formatDate(nextDate);
    const dayOfWeek = nextDate.getDay();
    days.push({
      date: nextDate,
      dateStr,
      dayNumber: t,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 ? 'sun' : dayOfWeek === 6 ? 'sat' : null
    });
  }

  return days;
}

export function formatRelativeDays(days: number): string {
  if (days < 0) return `${Math.abs(days)} Tage überfällig`;
  if (days === 0) return 'Heute fällig';
  if (days === 1) return 'Morgen fällig';
  return `in ${days} Tagen`;
}
