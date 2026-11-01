import React, { useState } from 'react';
import { AlertCircle, Clock, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { CalculatedItem, ItemStatus } from '../types/consumable';

interface UrgentAlertBannerProps {
  urgentItems: CalculatedItem[];
  onFocusStatus: (status: ItemStatus) => void;
}

export const UrgentAlertBanner: React.FC<UrgentAlertBannerProps> = ({
  urgentItems,
  onFocusStatus
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const overdueItems = urgentItems.filter((i) => i.status === 'overdue');
  const todayItems = urgentItems.filter((i) => i.status === 'today');
  const buySoonItems = urgentItems.filter((i) => i.status === 'buy_soon');

  if (isDismissed || (overdueItems.length === 0 && todayItems.length === 0 && buySoonItems.length === 0)) {
    return null;
  }

  const isOverdue = overdueItems.length > 0;
  const isToday = !isOverdue && todayItems.length > 0;
  const isBuySoon = !isOverdue && !isToday && buySoonItems.length > 0;

  const targetItems = isOverdue ? overdueItems : isToday ? todayItems : buySoonItems;
  const targetStatus: ItemStatus = isOverdue ? 'overdue' : isToday ? 'today' : 'buy_soon';

  const previewNames = targetItems.slice(0, 2).map((i) => i.name).join(', ') + (targetItems.length > 2 ? ` und ${targetItems.length - 2} weitere` : '');

  return (
    <div className="mb-4">
      <div
        className={`px-4 py-3 rounded-2xl text-xs flex items-center justify-between gap-3 border shadow-xs transition-all ${
          isOverdue
            ? 'bg-rose-50/90 border-rose-200/90 text-rose-950 backdrop-blur-xs'
            : isToday
            ? 'bg-amber-50/90 border-amber-200/90 text-amber-950 backdrop-blur-xs'
            : 'bg-sky-50/90 border-sky-200/90 text-sky-950 backdrop-blur-xs'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isOverdue
              ? 'bg-rose-100 text-rose-600'
              : isToday
              ? 'bg-amber-100 text-amber-600'
              : 'bg-sky-100 text-sky-600'
          }`}>
            {isOverdue && <AlertCircle className="w-4 h-4 stroke-[2.4]" />}
            {isToday && <Clock className="w-4 h-4 stroke-[2.4]" />}
            {isBuySoon && <ShoppingBag className="w-4 h-4 stroke-[2.4]" />}
          </div>

          <div className="flex items-baseline gap-2 truncate">
            <span className="font-extrabold whitespace-nowrap text-sm tracking-tight">
              {isOverdue && `Überfällige Artikel: ${overdueItems.length}`}
              {isToday && `Heute fällig: ${todayItems.length}`}
              {isBuySoon && `Nachbestellen empfohlen: ${buySoonItems.length}`}
            </span>
            <span className="hidden sm:inline text-slate-500 truncate text-[11px]">
              ({previewNames})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onFocusStatus(targetStatus)}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] inline-flex items-center gap-1 active:scale-95 transition-all shadow-2xs cursor-pointer ${
              isOverdue
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : isToday
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            <span>Ansehen</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-black/5 transition cursor-pointer"
            title="Benachrichtigung schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};