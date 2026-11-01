import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  UtensilsCrossed, 
  ShoppingBag, 
  Stethoscope, 
  Scissors, 
  Wrench,
  Hotel,
  HeartPulse,
  CheckSquare, 
  Square, 
  Sparkles, 
  X, 
  PlusCircle
} from 'lucide-react';
import { INDUSTRY_TEMPLATES } from '../data/industryTemplates';
import { ConsumableItem } from '../types/consumable';
import { getTodayString, formatCycleDisplay } from '../utils/dateCalc';
import { getCategoryStyle } from '../utils/categoryColors';

interface IndustryTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (itemsToAdd: ConsumableItem[], replaceAll: boolean) => void;
  currentItemsCount: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  Stethoscope,
  HeartPulse,
  UtensilsCrossed,
  Scissors,
  Wrench,
  Hotel,
  ShoppingBag
};

export const IndustryTemplateModal: React.FC<IndustryTemplateModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentItemsCount
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('office-general');
  const [selectedItemIndices, setSelectedItemIndices] = useState<Set<number>>(new Set());
  const [replaceExisting, setReplaceExisting] = useState<boolean>(false);

  const currentTemplate = INDUSTRY_TEMPLATES.find((t) => t.id === selectedTemplateId) || INDUSTRY_TEMPLATES[0];

  useEffect(() => {
    if (currentTemplate) {
      const all = new Set<number>();
      currentTemplate.items.forEach((_, idx) => all.add(idx));
      setSelectedItemIndices(all);
    }
  }, [selectedTemplateId]);

  if (!isOpen) return null;

  const toggleItem = (idx: number) => {
    const next = new Set(selectedItemIndices);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedItemIndices(next);
  };

  const handleSelectAll = () => {
    const all = new Set<number>();
    currentTemplate.items.forEach((_, idx) => all.add(idx));
    setSelectedItemIndices(all);
  };

  const handleDeselectAll = () => {
    setSelectedItemIndices(new Set());
  };

  const handleApply = () => {
    if (selectedItemIndices.size === 0) return;

    const todayStr = getTodayString();
    const itemsToAdd: ConsumableItem[] = [];

    currentTemplate.items.forEach((tmpl, idx) => {
      if (!selectedItemIndices.has(idx)) return;
      itemsToAdd.push({
        id: `work-item-de-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: tmpl.name,
        category: tmpl.category,
        cycleValue: tmpl.cycleValue,
        cycleUnit: tmpl.cycleUnit,
        lastReplacedDate: todayStr,
        purchaseLeadDays: tmpl.purchaseLeadDays,
        location: tmpl.location,
        manager: tmpl.manager,
        supplier: tmpl.supplier,
        minStock: tmpl.minStock,
        modelNumber: tmpl.modelNumber,
        memo: tmpl.memo,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    onApplyTemplate(itemsToAdd, replaceExisting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Kopfzeile */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Branchenvorlagen für Betriebe</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Verbrauchspaket nach Gewerk & Branche importieren
            </h2>
            <p className="text-xs text-slate-500">
              Starten Sie sofort mit typischen Verbrauchs- und Prüfzyklen für Ihr Unternehmen.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inhalt: 2 Spalten */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4 overflow-y-auto flex-1">
          {/* Linke Spalte: Branchenliste */}
          <div className="md:col-span-5 space-y-2 pr-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Branchen & Gewerke ({INDUSTRY_TEMPLATES.length})
            </span>
            {INDUSTRY_TEMPLATES.map((tmpl) => {
              const IconComp = ICON_MAP[tmpl.iconName] || Building2;
              const isSelected = tmpl.id === selectedTemplateId;

              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <IconComp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold block truncate">{tmpl.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {tmpl.items.length} vorkonfigurierte Artikel
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Rechte Spalte: Details des ausgewählten Pakets */}
          <div className="md:col-span-7 flex flex-col bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <div className="pb-3 border-b border-slate-200/80 mb-3">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full inline-block mb-1">
                {currentTemplate.badge}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">{currentTemplate.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentTemplate.description}
              </p>
              <div className="mt-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Zielgruppe:</span> {currentTemplate.targetRole}
              </div>
            </div>

            {/* Auswahlleiste */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700">
                Zu importierende Artikel ({selectedItemIndices.size} / {currentTemplate.items.length})
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] text-blue-600 font-bold hover:underline"
                >
                  Alle auswählen
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-[11px] text-slate-500 hover:text-slate-700"
                >
                  Alle abwählen
                </button>
              </div>
            </div>

            {/* Artikelliste */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 max-h-64">
              {currentTemplate.items.map((item, idx) => {
                const isChecked = selectedItemIndices.has(idx);
                const catStyle = getCategoryStyle(item.category);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleItem(idx)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-white border-blue-300 shadow-2xs'
                        : 'bg-white/50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="pt-0.5 text-blue-600">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 truncate">{item.name}</span>
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                          {formatCycleDisplay(item.cycleValue, item.cycleUnit)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span className={`px-1.5 py-0.2 rounded font-medium ${catStyle.badgeBg}`}>
                          {item.category}
                        </span>
                        {item.location && <span>• {item.location}</span>}
                        {item.purchaseLeadDays > 0 && <span>• Vorlauf {item.purchaseLeadDays} T.</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fußzeile mit Bestätigung */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="replaceExisting"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500/20 w-4 h-4"
            />
            <label htmlFor="replaceExisting" className="text-xs text-slate-600 font-medium cursor-pointer">
              Bestehende {currentItemsCount} Artikel ersetzen (statt hinzuzufügen)
            </label>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="button"
              disabled={selectedItemIndices.size === 0}
              onClick={handleApply}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-95 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{selectedItemIndices.size} Artikel importieren</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
