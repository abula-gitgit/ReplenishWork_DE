import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ShoppingCart, 
  CheckCircle2, 
  ExternalLink, 
  Check, 
  Calendar, 
  MoreVertical, 
  Edit3, 
  History, 
  Trash2, 
  Copy, 
  CheckCheck,
  MapPin,
  User,
  Package,
  FileText,
  Monitor,
  Sparkles,
  Wind,
  ShieldAlert,
  Wrench,
  ClipboardCheck,
  Layers
} from 'lucide-react';
import { CalculatedItem, Category } from '../types/consumable';
import { formatDateDisplay, formatCycleDisplay } from '../utils/dateCalc';
import { getCategoryStyle } from '../utils/categoryColors';

interface ItemCardProps {
  item: CalculatedItem;
  onQuickReplace: (item: CalculatedItem) => void;
  onCustomReplace: (item: CalculatedItem) => void;
  onEdit: (item: CalculatedItem) => void;
  onViewHistory: (item: CalculatedItem) => void;
  onDelete: (id: string, name: string) => void;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Bürobedarf & Schreibwaren':
      return FileText;
    case 'IT- & Druckerausstattung':
      return Monitor;
    case 'Reinigung, Hygiene & Teeküche':
      return Sparkles;
    case 'Klima, Lüftung & Haustechnik':
      return Wind;
    case 'Arbeitsschutz & Erste Hilfe':
      return ShieldAlert;
    case 'Werkstatt, Betrieb & Instandhaltung':
      return Wrench;
    case 'Wiederkehrende Prüfungen & Wartung':
      return ClipboardCheck;
    case 'Sonstige Betriebsverbrauchsgüter':
    default:
      return Layers;
  }
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onQuickReplace,
  onCustomReplace,
  onEdit,
  onViewHistory,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedModel, setCopiedModel] = useState(false);

  const catStyle = getCategoryStyle(item.category);
  const CategoryIcon = getCategoryIcon(item.category);

  const handleCopyModel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.modelNumber) return;
    navigator.clipboard.writeText(item.modelNumber);
    setCopiedModel(true);
    setTimeout(() => setCopiedModel(false), 2000);
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.8]" />
            <span>{item.statusLabel}</span>
          </span>
        );
      case 'today':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
            <Clock className="w-3.5 h-3.5 stroke-[2.8]" />
            <span>{item.statusLabel}</span>
          </span>
        );
      case 'buy_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <ShoppingCart className="w-3.5 h-3.5 text-sky-600 stroke-[2.5]" />
            <span>{item.statusLabel}</span>
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>{item.statusLabel}</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
        item.status === 'overdue'
          ? 'border-rose-300 ring-1 ring-rose-200'
          : item.status === 'today'
          ? 'border-amber-300 ring-1 ring-amber-200'
          : item.status === 'buy_soon'
          ? 'border-sky-300 ring-1 ring-sky-200'
          : 'border-slate-200/90 hover:border-slate-300'
      } ${catStyle.cardAccent}`}
    >
      <div className="p-4 sm:p-5">
        {/* Oberste Zeile: Kategorie-Badge & Status & Menü */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight ${catStyle.badgeBg}`}
            >
              <CategoryIcon className={`w-3.5 h-3.5 ${catStyle.iconColor} stroke-[2.4]`} />
              <span>{item.category}</span>
            </span>
            {getStatusBadge()}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Aktionen"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 w-44 bg-white border border-slate-200/90 rounded-xl shadow-lg py-1 z-20 text-xs font-semibold animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(item);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Bearbeiten</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onViewHistory(item);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Historie anzeigen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onCustomReplace(item);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Anderes Datum wählen</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete(item.id, item.name);
                    }}
                    className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Löschen</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Artikelname */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug mb-2">
          {item.name}
        </h3>

        {/* Modellnummer & Metadaten (Lagerort, Zuständiger, Mindestbestand) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 mb-3.5">
          {item.modelNumber && (
            <button
              type="button"
              onClick={handleCopyModel}
              className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer"
              title="Modell-/Art.-Nr. kopieren"
            >
              {copiedModel ? (
                <>
                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>{item.modelNumber}</span>
                </>
              )}
            </button>
          )}

          {item.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-[200px]">{item.location}</span>
            </span>
          )}

          {item.manager && (
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[140px]">{item.manager}</span>
            </span>
          )}

          {item.minStock && (
            <span className="inline-flex items-center gap-1 font-medium text-slate-500">
              <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Mindestbestand: {item.minStock}</span>
            </span>
          )}
        </div>

        {/* Termindetails: Nächster Wechsel & Nachbestelltermin */}
        <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
              Nächster Wechsel
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 text-sm">
                {formatDateDisplay(item.nextReplacementDate)}
              </span>
              <span className="text-[11px] text-slate-500">
                ({formatCycleDisplay(item.cycleValue, item.cycleUnit)})
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
              Bestelltermin (Vorlauf {item.purchaseLeadDays} Tage)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`font-extrabold text-sm ${item.daysUntilPurchase <= 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                {formatDateDisplay(item.purchaseReminderDate)}
              </span>
              {item.daysUntilPurchase <= 0 && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  Fällig!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Fortschrittsbalken Nutzungsdauer */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span>Verbleibende Nutzungsdauer</span>
            <span>{item.lifeRemainingPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                item.lifeRemainingPercent <= 15
                  ? 'bg-rose-500'
                  : item.lifeRemainingPercent <= 35
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(5, item.lifeRemainingPercent)}%` }}
            />
          </div>
        </div>

        {/* Notiz falls vorhanden */}
        {item.memo && (
          <p className="text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 mb-4 line-clamp-2 leading-relaxed">
            {item.memo}
          </p>
        )}

        {/* Aktionen unten: Schneller Wechsel & Lieferanten-Link */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {item.purchaseUrl ? (
              <a
                href={item.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 active:scale-95 transition-all"
              >
                <span>{item.supplier || 'Bestellen'}</span>
                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
              </a>
            ) : item.supplier ? (
              <span className="text-xs font-semibold text-slate-500">
                Lieferant: <strong className="text-slate-700">{item.supplier}</strong>
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onCustomReplace(item)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 bg-white transition active:scale-95 cursor-pointer text-xs font-semibold"
              title="Anderes Wechseldatum wählen"
            >
              <Calendar className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onQuickReplace(item)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-2xs transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Heute ersetzt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
