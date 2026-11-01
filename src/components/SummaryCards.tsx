import React from 'react';
import { ItemStatus } from '../types/consumable';
import { Layers, AlertCircle, Clock, ShoppingCart, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  statusCounts: {
    total: number;
    overdue: number;
    today: number;
    buy_soon: number;
    normal: number;
  };
  activeStatusFilter: ItemStatus | 'all';
  onSelectStatusFilter: (status: ItemStatus | 'all') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  statusCounts,
  activeStatusFilter,
  onSelectStatusFilter
}) => {
  const cards = [
    {
      id: 'all' as const,
      label: 'Alle Artikel',
      count: statusCounts.total,
      icon: Layers,
      iconBg: 'bg-slate-100 text-slate-700',
      countColor: 'text-slate-900',
      activeRing: 'ring-2 ring-slate-900 border-slate-900 bg-white shadow-sm',
      hoverBorder: 'hover:border-slate-300'
    },
    {
      id: 'overdue' as const,
      label: 'Überfällig',
      count: statusCounts.overdue,
      icon: AlertCircle,
      iconBg: 'bg-rose-50 text-rose-600',
      countColor: 'text-rose-600',
      activeRing: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/20 shadow-sm shadow-rose-500/10',
      hoverBorder: 'hover:border-rose-300'
    },
    {
      id: 'today' as const,
      label: 'Heute fällig',
      count: statusCounts.today,
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
      countColor: 'text-amber-600',
      activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20 shadow-sm shadow-amber-500/10',
      hoverBorder: 'hover:border-amber-300'
    },
    {
      id: 'buy_soon' as const,
      label: 'Nachbestellen',
      count: statusCounts.buy_soon,
      icon: ShoppingCart,
      iconBg: 'bg-sky-50 text-sky-600',
      countColor: 'text-sky-600',
      activeRing: 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/20 shadow-sm shadow-sky-500/10',
      hoverBorder: 'hover:border-sky-300'
    },
    {
      id: 'normal' as const,
      label: 'Im Plan',
      count: statusCounts.normal,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      countColor: 'text-emerald-600',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 shadow-sm shadow-emerald-500/10',
      hoverBorder: 'hover:border-emerald-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeStatusFilter === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectStatusFilter(c.id)}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
              isActive
                ? c.activeRing
                : `bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-2xs hover:bg-white ${c.hoverBorder} hover:shadow-xs`
            }`}
          >
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate mb-1">
                {c.label}
              </span>
              <span className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${c.countColor}`}>
                {c.count}
              </span>
            </div>

            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
