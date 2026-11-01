import React, { useState, useMemo } from 'react';
import {
  History,
  Calendar,
  Search,
  Trash2,
  ArrowLeft,
  Clock,
  FileSpreadsheet,
  PackageOpen,
  CalendarDays,
  Wrench,
  Briefcase
} from 'lucide-react';
import { CalculatedItem, Category } from '../types/consumable';
import { formatDateDisplay } from '../utils/dateCalc';
import { getCategoryStyle } from '../utils/categoryColors';

interface HistoryTimelineViewProps {
  items: CalculatedItem[];
  categories: string[];
  onDeleteHistoryEntry: (itemId: string, historyRecordId: string) => void;
  onNavigateToList: () => void;
  onEditItem?: (item: CalculatedItem) => void;
}

interface FlatHistoryItem {
  recordId: string;
  itemId: string;
  itemName: string;
  category: Category;
  modelNumber?: string;
  purchaseUrl?: string;
  replacedDate: string;
  memo?: string;
  recordedAt: string;
  previousReplacedDate?: string;
  nextReplacementDate: string;
  daysUntilReplacement: number;
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

export const HistoryTimelineView: React.FC<HistoryTimelineViewProps> = ({
  items,
  categories,
  onDeleteHistoryEntry,
  onNavigateToList
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // Alle Verlaufseinträge aller Artikel sammeln
  const flatHistory: FlatHistoryItem[] = useMemo(() => {
    const list: FlatHistoryItem[] = [];
    items.forEach((item) => {
      (item.history || []).forEach((rec) => {
        list.push({
          recordId: rec.id,
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          modelNumber: item.modelNumber,
          purchaseUrl: item.purchaseUrl,
          replacedDate: rec.replacedDate,
          memo: rec.memo,
          recordedAt: rec.recordedAt,
          previousReplacedDate: rec.previousReplacedDate,
          nextReplacementDate: item.nextReplacementDate,
          daysUntilReplacement: item.daysUntilReplacement,
          item
        });
      });
    });

    return list.sort((a, b) => b.replacedDate.localeCompare(a.replacedDate));
  }, [items]);

  // Gefilterte Verlaufsliste
  const filteredHistory = useMemo(() => {
    return flatHistory.filter((rec) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rec.itemName.toLowerCase().includes(q) ||
        (rec.memo && rec.memo.toLowerCase().includes(q)) ||
        (rec.modelNumber && rec.modelNumber.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'all' || rec.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [flatHistory, searchQuery, selectedCategory]);

  // Nach Monat gruppieren
  const groupedHistory = useMemo(() => {
    const groups: { monthKey: string; monthLabel: string; entries: FlatHistoryItem[] }[] = [];
    const map = new Map<string, FlatHistoryItem[]>();

    filteredHistory.forEach((rec) => {
      const [year, month] = rec.replacedDate.split('-');
      const monthIdx = parseInt(month, 10) - 1;
      const key = `${year}-${month}`;
      const label = `${MONTH_NAMES[monthIdx]} ${year}`;

      const list = map.get(key) || [];
      list.push(rec);
      map.set(key, list);
    });

    map.forEach((entries, key) => {
      const [year, month] = key.split('-');
      const monthIdx = parseInt(month, 10) - 1;
      groups.push({
        monthKey: key,
        monthLabel: `${MONTH_NAMES[monthIdx]} ${year}`,
        entries
      });
    });

    return groups.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [filteredHistory]);

  // CSV-Export
  const handleExportCSV = () => {
    const headers = [
      'Wechseldatum',
      'Artikelbezeichnung',
      'Kategorie',
      'Art.-Nr.',
      'Notiz',
      'Nächster Wechsel'
    ];
    const rows = filteredHistory.map((rec) => [
      `"${rec.replacedDate}"`,
      `"${rec.itemName.replace(/"/g, '""')}"`,
      `"${rec.category.replace(/"/g, '""')}"`,
      `"${(rec.modelNumber || '').replace(/"/g, '""')}"`,
      `"${(rec.memo || '').replace(/"/g, '""')}"`,
      `"${rec.nextReplacementDate}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `replenish-work-historie-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Statistik-Zusammenfassung
  const stats = useMemo(() => {
    const totalCount = flatHistory.length;
    const now = new Date();
    const curYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthCount = flatHistory.filter((r) => r.replacedDate.startsWith(curYearMonth)).length;

    const catCounts = new Map<string, number>();
    flatHistory.forEach((r) => {
      catCounts.set(r.category, (catCounts.get(r.category) || 0) + 1);
    });
    let topCat = '-';
    let topCatCount = 0;
    catCounts.forEach((count, cat) => {
      if (count > topCatCount) {
        topCatCount = count;
        topCat = cat;
      }
    });

    return { totalCount, thisMonthCount, topCat, topCatCount };
  }, [flatHistory]);

  return (
    <div className="space-y-6">
      {/* Kopfbereich */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={onNavigateToList}
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition mr-1 cursor-pointer"
              title="Zurück zur Artikelliste"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Protokoll der Wechsel & Instandhaltung
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 pl-8">
            Lückenlose Nachverfolgung aller durchgeführten Austausche und Prüfungen.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center pl-8 md:pl-0">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={flatHistory.length === 0}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition inline-flex items-center gap-1.5 shadow-2xs disabled:opacity-40 cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV-Export</span>
          </button>
        </div>
      </div>

      {/* Statistik-Kacheln */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Gesamteinträge</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalCount}</span>
            <span className="text-xs text-slate-500">Wechsel</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Im laufenden Monat</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700">{stats.thisMonthCount}</span>
            <span className="text-xs text-slate-500">durchgeführt</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Verwaltete Artikel</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{items.length}</span>
            <span className="text-xs text-slate-500">im System</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Häufigste Kategorie</span>
          <div className="truncate">
            <span className="text-sm font-extrabold text-slate-900 truncate block">
              {stats.topCat}
            </span>
            <span className="text-[10px] text-slate-400">
              {stats.topCatCount > 0 ? `${stats.topCatCount} Ereignisse` : 'Keine'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter- und Suchleiste */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Historie durchsuchen (Name, Notiz, Art.-Nr.)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
          className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
        >
          <option value="all">Alle Kategorien</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Zeitleiste */}
      {groupedHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 mb-1">Keine Verlaufseinträge gefunden</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Sobald Sie Artikel ersetzen oder Prüfungen als erledigt markieren, werden diese hier lückenlos archiviert.
          </p>
          <button
            type="button"
            onClick={onNavigateToList}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Zur Artikelliste
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedHistory.map((group) => (
            <div key={group.monthKey} className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                  {group.monthLabel}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                  {group.entries.length}
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {group.entries.map((rec) => {
                  const catStyle = getCategoryStyle(rec.category);

                  return (
                    <div
                      key={rec.recordId}
                      className="p-4 hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {rec.itemName}
                            </span>
                            <span className={`text-[10px] px-2 py-0.2 rounded-md font-semibold ${catStyle.badgeBg}`}>
                              {rec.category}
                            </span>
                            {rec.modelNumber && (
                              <span className="text-[10px] font-mono text-slate-400">
                                {rec.modelNumber}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {formatDateDisplay(rec.replacedDate)}
                            </span>
                            <span>• Nächster Termin: {formatDateDisplay(rec.nextReplacementDate)}</span>
                          </div>

                          {rec.memo && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                              {rec.memo}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => onDeleteHistoryEntry(rec.itemId, rec.recordId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Eintrag aus Protokoll entfernen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
