import { ConsumableItem, MasterOption, DEFAULT_CATEGORIES } from '../types/consumable';
import { generateSampleItems } from './sampleData';

const STORAGE_KEY = 'replenish_work_de_items_v1';
const STORAGE_KEY_CATEGORIES = 'replenish_work_de_categories_v1';

/**
 * Lädt benutzerdefinierte Kategorien aus dem LocalStorage oder gibt Standardkategorien zurück
 */
export function loadStoredCategories(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) return [...DEFAULT_CATEGORIES];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const list = parsed.map((c) => String(c).trim()).filter(Boolean);
      return list;
    }
    return [...DEFAULT_CATEGORIES];
  } catch (err) {
    console.error('Fehler beim Laden der Kategorien:', err);
    return [...DEFAULT_CATEGORIES];
  }
}

/**
 * Speichert benutzerdefinierte Kategorien im LocalStorage
 */
export function saveStoredCategories(categories: string[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    return true;
  } catch (err) {
    console.error('Fehler beim Speichern der Kategorien:', err);
    return false;
  }
}

/**
 * Lädt gespeicherte Verbrauchsartikel; initialisiert beim ersten Start mit Beispielen
 */
export function loadStoredItems(): ConsumableItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const sample = generateSampleItems();
      saveStoredItems(sample);
      return sample;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    if (Array.isArray(parsed) && parsed.length === 0) {
      return [];
    }
    return generateSampleItems();
  } catch (err) {
    console.error('Fehler beim Laden der Verbrauchsartikel:', err);
    return generateSampleItems();
  }
}

/**
 * Speichert Verbrauchsartikel im LocalStorage
 */
export function saveStoredItems(items: ConsumableItem[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (err) {
    console.error('Fehler beim Speichern der Verbrauchsartikel:', err);
    return false;
  }
}

export interface BackupData {
  version: string;
  exportedAt: string;
  app: string;
  locale: string;
  items: ConsumableItem[];
  categories?: string[];
  masterOptions?: MasterOption[];
}

/**
 * Erzeugt JSON-Sicherungszeichenkette
 */
export function exportBackup(items: ConsumableItem[], masterOptions?: MasterOption[], categories?: string[]): string {
  const data: BackupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    app: 'replenish-for-work',
    locale: 'de',
    items,
    categories: categories || loadStoredCategories(),
    masterOptions: masterOptions || []
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Lädt JSON-Sicherungsdatei herunter
 */
export function exportToJSONFile(items: ConsumableItem[], masterOptions?: MasterOption[], categories?: string[]): void {
  const jsonStr = exportBackup(items, masterOptions, categories);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `replenish-for-work-sicherung-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const parseAndValidateImportJSON = importBackup;

/**
 * Validiert und importiert JSON-Sicherungsdaten
 */
export function importBackup(jsonString: string): {
  success: boolean;
  items?: ConsumableItem[];
  categories?: string[];
  masterOptions?: MasterOption[];
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Ungültiges JSON-Format.' };
    }

    if (!Array.isArray(parsed.items)) {
      return { success: false, error: 'Artikelliste (items) fehlt oder ist fehlerhaft.' };
    }

    const items: ConsumableItem[] = parsed.items.map((it: any) => ({
      id: String(it.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
      name: String(it.name || 'Unbenannter Artikel'),
      category: String(it.category || 'Sonstige Betriebsverbrauchsgüter'),
      cycleValue: Number(it.cycleValue) || 1,
      cycleUnit: it.cycleUnit || 'month',
      lastReplacedDate: String(it.lastReplacedDate || new Date().toISOString().split('T')[0]),
      purchaseLeadDays: Number(it.purchaseLeadDays) || 3,
      location: it.location ? String(it.location) : undefined,
      manager: it.manager ? String(it.manager) : undefined,
      supplier: it.supplier ? String(it.supplier) : undefined,
      minStock: it.minStock ? String(it.minStock) : undefined,
      modelNumber: it.modelNumber ? String(it.modelNumber) : undefined,
      purchaseUrl: it.purchaseUrl ? String(it.purchaseUrl) : undefined,
      memo: it.memo ? String(it.memo) : undefined,
      history: Array.isArray(it.history) ? it.history : [],
      createdAt: it.createdAt || new Date().toISOString(),
      updatedAt: it.updatedAt || new Date().toISOString()
    }));

    return {
      success: true,
      items,
      categories: Array.isArray(parsed.categories) ? parsed.categories : undefined,
      masterOptions: Array.isArray(parsed.masterOptions) ? parsed.masterOptions : undefined
    };
  } catch (err: any) {
    return { success: false, error: `Fehler beim Einlesen der Datei: ${err?.message || 'Unbekannter Fehler'}` };
  }
}
