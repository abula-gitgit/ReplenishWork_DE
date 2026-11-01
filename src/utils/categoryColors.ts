/**
 * Farbpaletten und Stildefinitionen nach Kategorien für Replenish for Work (Deutsche Edition)
 */

export interface CategoryColorStyle {
  badgeBg: string;
  iconColor: string;
  borderColor: string;
  cardAccent: string;
  activeTabBg: string;
  pillBg: string;
}

const CATEGORY_COLOR_MAP: Record<string, CategoryColorStyle> = {
  // Deutsche Kategorien
  'Bürobedarf & Schreibwaren': {
    badgeBg: 'bg-blue-100/90 text-blue-900 border border-blue-400 shadow-2xs',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-400',
    cardAccent: 'border-l-4 border-l-blue-500',
    activeTabBg: 'bg-blue-600 text-white font-bold shadow-xs',
    pillBg: 'bg-blue-50'
  },
  'IT- & Druckerausstattung': {
    badgeBg: 'bg-purple-100/90 text-purple-900 border border-purple-400 shadow-2xs',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-400',
    cardAccent: 'border-l-4 border-l-purple-500',
    activeTabBg: 'bg-purple-600 text-white font-bold shadow-xs',
    pillBg: 'bg-purple-50'
  },
  'Reinigung, Hygiene & Teeküche': {
    badgeBg: 'bg-teal-100/90 text-teal-900 border border-teal-400 shadow-2xs',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-400',
    cardAccent: 'border-l-4 border-l-teal-500',
    activeTabBg: 'bg-teal-600 text-white font-bold shadow-xs',
    pillBg: 'bg-teal-50'
  },
  'Klima, Lüftung & Haustechnik': {
    badgeBg: 'bg-emerald-100/90 text-emerald-900 border border-emerald-400 shadow-2xs',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-400',
    cardAccent: 'border-l-4 border-l-emerald-500',
    activeTabBg: 'bg-emerald-600 text-white font-bold shadow-xs',
    pillBg: 'bg-emerald-50'
  },
  'Arbeitsschutz & Erste Hilfe': {
    badgeBg: 'bg-rose-100/90 text-rose-900 border border-rose-400 shadow-2xs',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-400',
    cardAccent: 'border-l-4 border-l-rose-500',
    activeTabBg: 'bg-rose-600 text-white font-bold shadow-xs',
    pillBg: 'bg-rose-50'
  },
  'Werkstatt, Betrieb & Instandhaltung': {
    badgeBg: 'bg-amber-100/90 text-amber-950 border border-amber-400 shadow-2xs',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-400',
    cardAccent: 'border-l-4 border-l-amber-500',
    activeTabBg: 'bg-amber-600 text-white font-bold shadow-xs',
    pillBg: 'bg-amber-50'
  },
  'Wiederkehrende Prüfungen & Wartung': {
    badgeBg: 'bg-indigo-100/90 text-indigo-900 border border-indigo-400 shadow-2xs',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-400',
    cardAccent: 'border-l-4 border-l-indigo-500',
    activeTabBg: 'bg-indigo-600 text-white font-bold shadow-xs',
    pillBg: 'bg-indigo-50'
  },
  'Sonstige Betriebsverbrauchsgüter': {
    badgeBg: 'bg-slate-200/90 text-slate-800 border border-slate-400 shadow-2xs',
    iconColor: 'text-slate-600',
    borderColor: 'border-slate-300',
    cardAccent: 'border-l-4 border-l-slate-400',
    activeTabBg: 'bg-slate-700 text-white font-bold shadow-xs',
    pillBg: 'bg-slate-50'
  }
};

const DEFAULT_STYLE: CategoryColorStyle = {
  badgeBg: 'bg-slate-100 text-slate-700 border border-slate-300',
  iconColor: 'text-slate-500',
  borderColor: 'border-slate-200',
  cardAccent: 'border-l-4 border-l-slate-400',
  activeTabBg: 'bg-slate-700 text-white font-bold',
  pillBg: 'bg-slate-50'
};

export function getCategoryStyle(categoryName: string): CategoryColorStyle {
  if (!categoryName) return DEFAULT_STYLE;
  return CATEGORY_COLOR_MAP[categoryName] || DEFAULT_STYLE;
}
