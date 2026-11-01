import React from 'react';
import { LayoutGrid, Calendar, History, ShoppingCart, Plus, BookOpen } from 'lucide-react';

export type BottomNavTab = 'stock' | 'schedule' | 'history' | 'buy' | 'insights' | 'guide';

interface BottomNavBarProps {
  currentTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  onOpenAddModal: () => void;
  urgentCount?: number;
  buyCount?: number;
  isAdVisible?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  urgentCount = 0,
  buyCount = 0,
  isAdVisible = false,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className={`fixed ${isAdVisible ? 'bottom-[50px]' : 'bottom-0'} inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] md:hidden transition-all`}
    >
      <div className="max-w-md mx-auto grid grid-cols-6 h-[54px] px-1 safe-area-inset-bottom items-center">
        {/* Tab 1: Artikelliste */}
        <button
          type="button"
          onClick={() => onTabChange('stock')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'stock'
              ? 'text-blue-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <LayoutGrid className={`w-[19px] h-[19px] transition-transform ${currentTab === 'stock' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {urgentCount > 0 && currentTab !== 'stock' && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-tight">Artikel</span>
        </button>

        {/* Tab 2: Kalender */}
        <button
          type="button"
          onClick={() => onTabChange('schedule')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'schedule'
              ? 'text-blue-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <Calendar className={`w-[19px] h-[19px] transition-transform ${currentTab === 'schedule' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-tight">Kalender</span>
        </button>

        {/* Zentrale Aktion: Hinzufügen */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 active:scale-90 transition-transform cursor-pointer -mt-3.5 ring-4 ring-white"
            title="Artikel hinzufügen"
          >
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </button>
        </div>

        {/* Tab 3: Einkauf / Bestellungen */}
        <button
          type="button"
          onClick={() => onTabChange('buy')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'buy'
              ? 'text-blue-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-[19px] h-[19px] transition-transform ${currentTab === 'buy' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {buyCount > 0 && currentTab !== 'buy' && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {buyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-tight">Einkauf</span>
        </button>

        {/* Tab 4: Historie */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'history'
              ? 'text-blue-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <History className={`w-[19px] h-[19px] transition-transform ${currentTab === 'history' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-tight">Historie</span>
        </button>

        {/* Tab 5: Leitfaden */}
        <button
          type="button"
          onClick={() => onTabChange('guide')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all relative cursor-pointer active:scale-95 ${
            currentTab === 'guide'
              ? 'text-blue-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-800 font-medium'
          }`}
        >
          <BookOpen className={`w-[19px] h-[19px] transition-transform ${currentTab === 'guide' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-tight">Leitfaden</span>
        </button>
      </div>
    </nav>
  );
};
