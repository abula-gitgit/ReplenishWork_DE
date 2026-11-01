import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { getTodayString, formatCycleDisplay } from '../utils/dateCalc';

interface CustomReplaceModalProps {
  isOpen: boolean;
  item: CalculatedItem | null;
  onClose: () => void;
  onConfirm: (itemId: string, replacedDate: string, memo: string) => void;
}

export const CustomReplaceModal: React.FC<CustomReplaceModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm
}) => {
  const [replacedDate, setReplacedDate] = useState(getTodayString());
  const [memo, setMemo] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacedDate) return;
    onConfirm(item.id, replacedDate, memo.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4 stroke-[2.4]" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Anderes Wechseldatum eintragen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <span className="text-xs text-slate-400 block font-medium">Betroffener Artikel</span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5 tracking-tight">{item.name}</span>
            <span className="text-xs text-slate-500 block mt-0.5 font-medium">
              Eingestelltes Intervall: {formatCycleDisplay(item.cycleValue, item.cycleUnit)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tatsächliches Datum des Wechsels / der Prüfung
            </label>
            <input
              type="date"
              value={replacedDate}
              onChange={(e) => setReplacedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Notiz zum Wechsel (Optional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="z.B. Vorzeitiger Wechsel durch Servicetechniker..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Datum speichern</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
