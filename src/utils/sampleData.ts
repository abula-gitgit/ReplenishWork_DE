import { ConsumableItem } from '../types/consumable';
import { getTodayString, parseDate, formatDate } from './dateCalc';

/**
 * Erzeugt realistische Beispieldaten für Replenish for Work (Deutsche Edition)
 */
export function generateSampleItems(): ConsumableItem[] {
  const today = getTodayString();
  const todayDate = parseDate(today);

  const shiftFromToday = (days: number): string => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() + days);
    return formatDate(d);
  };

  return [
    {
      id: 'sample-paper',
      name: 'Kopierpapier DIN A4 standard (Karton 5x500 Blatt)',
      category: 'Bürobedarf & Schreibwaren',
      cycleValue: 2,
      cycleUnit: 'week',
      // 3 Tage überfällig
      lastReplacedDate: shiftFromToday(-17),
      purchaseLeadDays: 3,
      location: 'Druckerraum EG Regal A-1',
      manager: 'Zentrale Verwaltung',
      supplier: 'Büromarkt24 / Schäfer Shop',
      minStock: '2 Kartons',
      modelNumber: 'A4-80G-WEISS',
      purchaseUrl: 'https://www.bueromarkt24.de/',
      memo: 'Nachbestellen sobald der Bestand unter 2 Kartons fällt. Trocken lagern.',
      history: [
        {
          id: 'hist-paper-1',
          replacedDate: shiftFromToday(-31),
          memo: 'Regulärer Vorratswechsel durchgeführt',
          recordedAt: new Date(Date.now() - 31 * 86400000).toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-toner',
      name: 'Toner schwarz (Multifunktions-Hauptkopierer)',
      category: 'IT- & Druckerausstattung',
      cycleValue: 2,
      cycleUnit: 'month',
      // Heute fällig
      lastReplacedDate: (() => {
        const d = new Date(todayDate);
        d.setMonth(d.getMonth() - 2);
        return formatDate(d);
      })(),
      purchaseLeadDays: 5,
      location: 'IT-Schrank Raum 102',
      manager: 'IT-Support',
      supplier: 'Systemhaus / Wartungspartner',
      minStock: '1 Reservekartusche',
      modelNumber: 'TK-5280K',
      purchaseUrl: '',
      memo: 'Immer 1 neue Originalkartusche griffbereit im IT-Schrank vorhalten.',
      history: [
        {
          id: 'hist-toner-1',
          replacedDate: (() => {
            const d = new Date(todayDate);
            d.setMonth(d.getMonth() - 4);
            return formatDate(d);
          })(),
          memo: 'Leerkartusche gewechselt und ins Recycling gegeben',
          recordedAt: new Date(Date.now() - 120 * 86400000).toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-filter',
      name: 'Wasserfilter-Patrone (Kaffeevollautomat Teeküche)',
      category: 'Reinigung, Hygiene & Teeküche',
      cycleValue: 2,
      cycleUnit: 'month',
      // Nachbestellungsfrist aktiv
      lastReplacedDate: (() => {
        const d = new Date(todayDate);
        d.setMonth(d.getMonth() - 2);
        d.setDate(d.getDate() + 4);
        return formatDate(d);
      })(),
      purchaseLeadDays: 5,
      location: 'Teeküche Unterschrank Spüle',
      manager: 'Office Management',
      supplier: 'Brita Professional',
      minStock: '1 Filterpatrone',
      modelNumber: 'PURITY C150',
      purchaseUrl: '',
      memo: 'Schützt vor Heizelementverkalkung und sichert Kaffeegeschmack.',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-firstaid',
      name: 'Erste-Hilfe-Kasten Prüfung & Nachfüllpack DIN 13157',
      category: 'Arbeitsschutz & Erste Hilfe',
      cycleValue: 6,
      cycleUnit: 'month',
      // Im Plan (noch ca. 2 Monate)
      lastReplacedDate: (() => {
        const d = new Date(todayDate);
        d.setMonth(d.getMonth() - 4);
        return formatDate(d);
      })(),
      purchaseLeadDays: 7,
      location: 'Flur Sanitätskasten',
      manager: 'Sicherheitsbeauftragter',
      supplier: 'Söhngen Erste Hilfe',
      minStock: '1 Nachfüllsatz',
      modelNumber: 'DIN-13157-PLUS',
      purchaseUrl: '',
      memo: 'Sterilverfallsdaten und Pflastervorrat gemäß DGUV Vorschrift 1 prüfen.',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-wipes',
      name: 'Industrie-Putztuchrolle blau (1.000 Blatt)',
      category: 'Werkstatt, Betrieb & Instandhaltung',
      cycleValue: 3,
      cycleUnit: 'week',
      // Im Plan
      lastReplacedDate: shiftFromToday(-8),
      purchaseLeadDays: 4,
      location: 'Werkstatt Spenderständer',
      manager: 'Hausmeister / Werkstattleiter',
      supplier: 'Würth',
      minStock: '1 Rolle',
      modelNumber: 'W-PUTZ-BLAU',
      purchaseUrl: '',
      memo: 'Extrastark für Öl, Fette und Werkzeugreinigung.',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
