import React from 'react';
import { X, History, Trash2, Calendar } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { formatDateDisplay, formatCycleDisplay } from '../utils/dateCalc';

interface HistoryModalProps {
  isOpen: boolean;
  item: CalculatedItem | null;
  onClose: () => void;
  onDeleteHistoryEntry: (itemId: string, historyRecordId: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  item,
  onClose,
  onDeleteHistoryEntry
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <History className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Historie der Wechsel & Prüfungen
              </h2>
              <p className="text-xs text-slate-400 font-medium">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Stammdaten-Übersicht */}
          <div className="grid grid-cols-2 gap-2 text-xs p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Kategorie</span>
              <span className="font-bold text-slate-800">{item.category}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Modell- / Art.-Nr.</span>
              <span className="font-mono font-bold text-slate-800 select-all">
                {item.modelNumber || 'Nicht angegeben'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Intervall</span>
              <span className="font-bold text-slate-800">{formatCycleDisplay(item.cycleValue, item.cycleUnit)}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Lieferzeit / Vorlauf</span>
              <span className="font-bold text-slate-800">{item.purchaseLeadDays} Tag(e)</span>
            </div>
            {item.location && (
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Lagerort</span>
                <span className="font-bold text-slate-800">{item.location}</span>
              </div>
            )}
            {item.manager && (
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Zuständig</span>
                <span className="font-bold text-slate-800">{item.manager}</span>
              </div>
            )}
          </div>

          {/* Chronologische Verlaufsliste */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Protokoll der Wartungsereignisse ({item.history.length})
            </h3>

            {item.history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Bisher keine Wechselhistorie für diesen Artikel vorhanden.
              </p>
            ) : (
              <div className="space-y-2">
                {item.history.map((record) => (
                  <div
                    key={record.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{formatDateDisplay(record.replacedDate)}</span>
                      </div>
                      {record.memo && (
                        <p className="text-slate-500 text-[11px] mt-1 pl-5">
                          {record.memo}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteHistoryEntry(item.id, record.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Diesen Eintrag aus dem Protokoll entfernen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
