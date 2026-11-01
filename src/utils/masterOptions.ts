import { MasterOption } from '../types/consumable';

export const DEFAULT_MASTER_OPTIONS: (MasterOption & { order?: number; defaultManager?: string })[] = [
  // Bürobedarf & Schreibwaren
  {
    id: 'de-master-1',
    name: 'Kopierpapier DIN A4 standard (Karton 5x500 Blatt)',
    category: 'Bürobedarf & Schreibwaren',
    defaultCycleValue: 2,
    defaultCycleUnit: 'week',
    defaultLeadDays: 3,
    defaultLocation: 'Druckerraum Regal A-1',
    defaultManager: 'Zentrale Verwaltung',
    defaultSupplier: 'Büromarkt24 / Schäfer Shop',
    defaultMinStock: '2 Kartons',
    defaultMemo: 'Nachbestellen sobald der Vorrat unter 2 Kartons fällt. Trocken lagern.',
    order: 1
  },
  {
    id: 'de-master-2',
    name: 'Kopierpapier DIN A3 (Karton 5x500 Blatt)',
    category: 'Bürobedarf & Schreibwaren',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 4,
    defaultLocation: 'Druckerraum Regal A-2',
    defaultManager: 'Zentrale Verwaltung',
    defaultSupplier: 'Büromarkt24',
    defaultMinStock: '1 Karton',
    defaultMemo: 'Für Konstruktionspläne, Schaubilder und Monatsübersichten.',
    order: 2
  },
  {
    id: 'de-master-3',
    name: 'Aktenvernichter-Pflegeöl / Ölpapier',
    category: 'Bürobedarf & Schreibwaren',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 4,
    defaultLocation: 'Kopierraum / Reißwolf',
    defaultManager: 'Verwaltung',
    defaultSupplier: 'Amazon Business',
    defaultMinStock: '1 Flasche',
    defaultMemo: 'Nach jedem zweiten Beutelwechsel Schneidwalzen ölen.',
    order: 3
  },
  {
    id: 'de-master-4',
    name: 'Whiteboard-Marker & Reinigungsfilz-Set',
    category: 'Bürobedarf & Schreibwaren',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 3,
    defaultLocation: 'Besprechungsräume',
    defaultManager: 'Büroorganisation',
    defaultSupplier: 'Staedtler / Lyreco',
    defaultMinStock: '2 Sets (Schwarz, Blau, Rot, Grün)',
    defaultMemo: 'Vor wichtigen Kunden-Meetings Stifte auf Deckkraft testen.',
    order: 4
  },

  // IT- & Druckerausstattung
  {
    id: 'de-master-5',
    name: 'Toner Schwarz (Multifunktions-Großkopierer)',
    category: 'IT- & Druckerausstattung',
    defaultCycleValue: 2,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultLocation: 'IT-Schrank Raum 102',
    defaultManager: 'IT-Support',
    defaultSupplier: 'Druckerzubehoer.de / Original',
    defaultMinStock: '1 Ersatzkartusche',
    defaultMemo: 'Ersatzkartusche bei ca. 15% Restkapazität des Geräts bereitstellen.',
    order: 5
  },
  {
    id: 'de-master-6',
    name: 'Farbtoner-Kassette Set (Cyan, Magenta, Gelb)',
    category: 'IT- & Druckerausstattung',
    defaultCycleValue: 4,
    defaultCycleUnit: 'month',
    defaultLeadDays: 6,
    defaultLocation: 'IT-Schrank Raum 102',
    defaultManager: 'IT-Support',
    defaultSupplier: 'Fachhändler',
    defaultMinStock: '1 voller Satz',
    defaultMemo: 'Vor Quartalsberichten und Broschürendruck prüfen.',
    order: 6
  },
  {
    id: 'de-master-7',
    name: 'Resttonerbehälter & Hefter-Klammern (Finisher)',
    category: 'IT- & Druckerausstattung',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 5,
    defaultLocation: 'Druckerunterschrank',
    defaultManager: 'IT-Support',
    defaultSupplier: 'Drucker-Wartungspartner',
    defaultMinStock: '1 Box',
    defaultMemo: 'Vollmeldung stoppt das gesamte Drucksystem – Reserve einlagern.',
    order: 7
  },

  // Reinigung, Hygiene & Teeküche
  {
    id: 'de-master-8',
    name: 'Kaffeebohnen Crema / Espresso (4x 1kg Vorteilspack)',
    category: 'Reinigung, Hygiene & Teeküche',
    defaultCycleValue: 2,
    defaultCycleUnit: 'week',
    defaultLeadDays: 3,
    defaultLocation: 'Teeküche Schrank B',
    defaultManager: 'Office Management',
    defaultSupplier: 'Dallmayr / Lavazza / Großhandel',
    defaultMinStock: '2 Beutel',
    defaultMemo: 'Für den Vollautomaten in der Mitarbeiter-Küche.',
    order: 8
  },
  {
    id: 'de-master-9',
    name: 'Wasserfilter-Kartusche (Kaffeevollautomat & Teeküche)',
    category: 'Reinigung, Hygiene & Teeküche',
    defaultCycleValue: 2,
    defaultCycleUnit: 'month',
    defaultLeadDays: 4,
    defaultLocation: 'Teeküche Spüle',
    defaultManager: 'Office Management',
    defaultSupplier: 'Brita / Claris',
    defaultMinStock: '1 Patrone',
    defaultMemo: 'Kalkschutz für Heizelemente, sichert unverfälschten Kaffeegeschmack.',
    order: 9
  },
  {
    id: 'de-master-10',
    name: 'Geschirrspül-Tabs & Spezialsalz (Großpackung)',
    category: 'Reinigung, Hygiene & Teeküche',
    defaultCycleValue: 1,
    defaultCycleUnit: 'month',
    defaultLeadDays: 3,
    defaultLocation: 'Teeküche Unterschrank',
    defaultManager: 'Hauswirtschaft',
    defaultSupplier: 'Drogerie / Großmarkt',
    defaultMinStock: '1 Packung',
    defaultMemo: 'Klarspüler und Regeneriersalz bei jedem zweiten Tab-Kauf kontrollieren.',
    order: 10
  },
  {
    id: 'de-master-11',
    name: 'Falthandtücher 2-lagig Z-Falz (Karton 3.200 Blatt)',
    category: 'Reinigung, Hygiene & Teeküche',
    defaultCycleValue: 2,
    defaultCycleUnit: 'week',
    defaultLeadDays: 4,
    defaultLocation: 'Sanitär-Lager',
    defaultManager: 'Reinigungsdienst',
    defaultSupplier: 'Hygiene-Shop',
    defaultMinStock: '2 Kartons',
    defaultMemo: 'Spender in Damen- und Herren-WCs täglich auffüllen.',
    order: 11
  },

  // Klima, Lüftung & Haustechnik
  {
    id: 'de-master-12',
    name: 'Ersatz-Filterkassette für Luftreiniger (HEPA + Aktivkohle)',
    category: 'Klima, Lüftung & Haustechnik',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultLocation: 'Technikraum Keller',
    defaultManager: 'Haustechnik',
    defaultSupplier: 'Gerätehersteller',
    defaultMinStock: '1 Filtersatz',
    defaultMemo: 'Filterwechsel zu Beginn der Pollensaison und vor der Heizperiode.',
    order: 12
  },

  // Arbeitsschutz & Erste Hilfe
  {
    id: 'de-master-13',
    name: 'Erste-Hilfe-Kasten DIN 13157 Nachfüllpackung',
    category: 'Arbeitsschutz & Erste Hilfe',
    defaultCycleValue: 6,
    defaultCycleUnit: 'month',
    defaultLeadDays: 7,
    defaultLocation: 'Flur Sanitätskasten',
    defaultManager: 'Sicherheitsbeauftragter',
    defaultSupplier: 'Söhngen / Wero',
    defaultMinStock: '1 Komplettset',
    defaultMemo: 'Halbjährliche Sichtprüfung und Verfallsdaten sterile Verbandstoffe kontrollieren.',
    order: 13
  },
  {
    id: 'de-master-14',
    name: 'Händedesinfektionsmittel 500ml / 1000ml (Eurospender)',
    category: 'Arbeitsschutz & Erste Hilfe',
    defaultCycleValue: 3,
    defaultCycleUnit: 'week',
    defaultLeadDays: 4,
    defaultLocation: 'Empfang & Sanitärräume',
    defaultManager: 'Hygienebeauftragter',
    defaultSupplier: 'Bode Sterillium / Schülke',
    defaultMinStock: '2 Flaschen',
    defaultMemo: 'VAH-gelistet, viruzid wirksam.',
    order: 14
  },

  // Werkstatt, Betrieb & Instandhaltung
  {
    id: 'de-master-15',
    name: 'Industrie-Putztuchrolle blau (1.000 Blatt saugstark)',
    category: 'Werkstatt, Betrieb & Instandhaltung',
    defaultCycleValue: 3,
    defaultCycleUnit: 'week',
    defaultLeadDays: 4,
    defaultLocation: 'Werkstatt / Hausmeister',
    defaultManager: 'Werkstattleiter',
    defaultSupplier: 'Würth / Hoffmann Group',
    defaultMinStock: '1 Rolle',
    defaultMemo: 'Reißfest für Öle, Fette und Lösungsmittel.',
    order: 15
  },

  // Wiederkehrende Prüfungen & Wartung
  {
    id: 'de-master-16',
    name: 'Prüfplaketten DGUV Vorschrift 3 (Elektroprüfung)',
    category: 'Wiederkehrende Prüfungen & Wartung',
    defaultCycleValue: 1,
    defaultCycleUnit: 'year',
    defaultLeadDays: 14,
    defaultLocation: 'Elektro-Werkstatt',
    defaultManager: 'Elektrofachkraft',
    defaultSupplier: 'Kroschke / SETON',
    defaultMinStock: '1 Bogen',
    defaultMemo: 'Prüftermine für ortsveränderliche elektrische Betriebsmittel.',
    order: 16
  }
];

export function getMasterOptions(): MasterOption[] {
  try {
    const raw = localStorage.getItem('replenish_work_master_options_de');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Fehler beim Laden der Stammdaten-Optionen', e);
  }
  return DEFAULT_MASTER_OPTIONS;
}

export function saveMasterOptions(options: MasterOption[]): void {
  try {
    localStorage.setItem('replenish_work_master_options_de', JSON.stringify(options));
  } catch (e) {
    console.error('Fehler beim Speichern der Stammdaten-Optionen', e);
  }
}

