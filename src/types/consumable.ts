/**
 * Datenmodelle und Typdefinitionen für Replenish for Work (Deutsche Edition)
 */

export type CycleUnit = 'day' | 'week' | 'month' | 'year';

export type ViewMode = 'list' | 'calendar' | 'history' | 'guide' | 'about' | 'privacy' | 'terms' | 'contact';

export type Category = string;

export const DEFAULT_CATEGORIES: Category[] = [
  'Bürobedarf & Schreibwaren',
  'IT- & Druckerausstattung',
  'Reinigung, Hygiene & Teeküche',
  'Klima, Lüftung & Haustechnik',
  'Arbeitsschutz & Erste Hilfe',
  'Werkstatt, Betrieb & Instandhaltung',
  'Wiederkehrende Prüfungen & Wartung',
  'Sonstige Betriebsverbrauchsgüter'
];

export const CATEGORIES: Category[] = [...DEFAULT_CATEGORIES];

export type ItemStatus = 'overdue' | 'today' | 'buy_soon' | 'normal';

export interface ReplacementRecord {
  id: string;
  replacedDate: string; // YYYY-MM-DD
  memo?: string;
  recordedAt: string; // ISO string
  previousReplacedDate?: string; // Previous date for rollback
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: Category;
  cycleValue: number;
  cycleUnit: CycleUnit;
  lastReplacedDate: string; // YYYY-MM-DD
  purchaseLeadDays: number;
  location?: string; // Lagerort (z.B. Etage 2, Druckerraum Regal A, Werkstatt)
  manager?: string; // Zuständig / Abteilung (z.B. Verwaltung, IT, Haustechnik)
  supplier?: string; // Lieferant (z.B. Büromarkt24, Amazon Business, Würth, Schäfer Shop)
  minStock?: string; // Meldebestand / Mindestbestand (z.B. 2 Kartons, 3 Dosen)
  modelNumber?: string;
  purchaseUrl?: string;
  memo?: string;
  history: ReplacementRecord[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CalculatedItem extends ConsumableItem {
  nextReplacementDate: string; // YYYY-MM-DD
  purchaseReminderDate: string; // YYYY-MM-DD
  daysUntilReplacement: number; // 0: heute, <0: überfällig, >0: verbleibende Tage
  daysUntilPurchase: number;    // <=0: Nachbestellung fällig
  lifeRemainingPercent: number; // 0 bis 100 verbleibender Nutzungsgrad in %
  status: ItemStatus;
  statusLabel: string;
}

export interface MasterOption {
  id: string;
  name: string;
  category: Category;
  defaultCycleValue?: number;
  defaultCycleUnit?: CycleUnit;
  defaultLeadDays?: number;
  defaultLocation?: string;
  defaultSupplier?: string;
  defaultMinStock?: string;
  defaultMemo?: string;
}

export interface IndustryTemplateItem {
  name: string;
  category: Category;
  cycleValue: number;
  cycleUnit: CycleUnit;
  purchaseLeadDays: number;
  location?: string;
  manager?: string;
  supplier?: string;
  minStock?: string;
  memo?: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge: string;
  color: string;
  items: IndustryTemplateItem[];
}
