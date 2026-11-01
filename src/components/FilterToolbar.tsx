import React from 'react';
import { Search, X } from 'lucide-react';
import { Category, CATEGORIES } from '../types/consumable';
import { getCategoryStyle } from '../utils/categoryColors';

export type SortOption = 'priority' | 'date_asc' | 'date_desc' | 'name' | 'location';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories?: string[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  categories = CATEGORIES
}) => {
  const selectedCatStyle = selectedCategory !== 'all' ? getCategoryStyle(selectedCategory) : null;

  return (
    <div className="mb-4 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
        {/* Suchfeld */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2.2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nach Name, Art.-Nr., Lagerort, Lieferant, Zuständigem suchen..."
            className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              title="Suche löschen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Auswahllisten */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Kategorie-Auswahl */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value as Category | 'all')}
              className={`w-full sm:w-auto text-xs py-2 pl-3 pr-8 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-slate-50/90 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  : selectedCatStyle?.badgeBg || 'bg-blue-50 text-blue-900 border-blue-300'
              }`}
            >
              <option value="all">Alle Kategorien</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Sortier-Auswahl */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full sm:w-auto text-xs py-2 pl-3 pr-8 rounded-xl font-semibold bg-slate-50/90 text-slate-700 border border-slate-200/80 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none transition-all"
            >
              <option value="priority">Dringlichkeit (Fälligkeit)</option>
              <option value="date_asc">Fälligkeit: Nächste zuerst</option>
              <option value="date_desc">Fälligkeit: Späteste zuerst</option>
              <option value="name">Name alphabetisch (A → Z)</option>
              <option value="location">Lagerort</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
