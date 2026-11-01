import { ConsumableItem } from '../types/consumable';
import { getTodayString } from '../utils/dateCalc';

export interface ReplacementGuideItem {
  id: string;
  title: string;
  category: 'office' | 'it' | 'sanitary' | 'hvac' | 'safety' | 'facility' | 'maintenance';
  categoryLabel: string;
  cycleDays: number;
  cycleDisplay: string;
  hygieneReason: string;
  dangerOfNeglect: string;
  signsOfDegradation: string[];
  scientificNote?: string;
  proTips: string;
  urgencyLevel: 'high' | 'medium' | 'standard';
  badgeLabel?: string;
}

export const REPLACEMENT_GUIDES: ReplacementGuideItem[] = [
  {
    id: 'shredder-oil',
    title: 'Pflegeöl & Ölblätter für Aktenvernichter',
    category: 'office',
    categoryLabel: 'Büro & Dokumente',
    cycleDays: 14,
    cycleDisplay: 'Alle 2 Wochen (oder nach jedem 2. Behälterleeren)',
    hygieneReason:
      'Partikelschnitt-Schneidwerke sammeln feinen Papierstaub an. Ohne regelmäßige Ölung erhöht sich die Reibung, der Motor überhitzt und die Schneidwalzen stumpfen vorzeitig ab.',
    dangerOfNeglect:
      'Wiederkehrende Papierstaus, quietschende Geräusche, Motorüberhitzung und Erlöschen der Herstellergarantie.',
    signsOfDegradation: [
      'Schleifende oder laute Geräusche beim Schneidvorgang',
      'Spürbar langsamere Einzugsgeschwindigkeit',
      'Weiße Papierstaubablagerungen zwischen den Schneidrädern',
      'Ausgefranste, unsauber geschnittene Partikel'
    ],
    scientificNote:
      'Herstellertests belegen, dass regelmäßiges Ölen die Lebensdauer des Schneidwerks um bis zu 150 % verlängert und den Spitzenstromverbrauch um 18 % senkt.',
    proTips:
      'Lagern Sie einen Vorrat an Ölblättern direkt griffbereit auf dem Schredder, damit das Einlegen beim Leeren keine 10 Sekunden dauert.',
    urgencyLevel: 'high',
    badgeLabel: 'Geräteschutz'
  },
  {
    id: 'water-filter',
    title: 'Wasserfilter-Patrone (Kaffeevollautomat & Teeküche)',
    category: 'sanitary',
    categoryLabel: 'Küche & Pause',
    cycleDays: 60,
    cycleDisplay: 'Alle 6 bis 8 Wochen (oder ca. 150 Liter)',
    hygieneReason:
      'Kalk und Schwebstoffe verengen feine Ventile und Heizelemente. Ein frischer Filter schützt vor Verkalkung und sichert gleichbleibenden Kaffeegeschmack.',
    dangerOfNeglect:
      'Verkalkte Thermoblöcke, plötzlicher Ausfall der Maschine im Büroalltag und teure Reparatureinsätze.',
    signsOfDegradation: [
      'Kaffee schmeckt säuerlich oder flach',
      'Wasserauslauf stottert oder Durchlaufzeit verlängert sich stark',
      'Filterwechselanzeige der Maschine leuchtet auf'
    ],
    scientificNote:
      'Aktivkohle und Ionentauscherharz binden gezielt Chlor und Karbonathärte, verhindern aber auch Keimwachstum im stehenden Tankwasser.',
    proTips:
      'Bei hartem Leitungswasser (über 14 °dH) das Wechselintervall auf maximal 5 Wochen verkürzen.',
    urgencyLevel: 'medium',
    badgeLabel: 'Kalkschutz'
  },
  {
    id: 'air-filter',
    title: 'Lüftungs- & HEPA-Filter für Büros und Praxen',
    category: 'hvac',
    categoryLabel: 'Lüftung & Klima',
    cycleDays: 180,
    cycleDisplay: 'Alle 6 Monate (halbjährlich)',
    hygieneReason:
      'Luftreiniger und RLT-Anlagen filtern Feinstaub, Pollen, Aerosole und Viren. Gesättigte Filter erhöhen den Strömungswiderstand und vermindern den Luftaustausch.',
    dangerOfNeglect:
      'Muffiger Geruch, Überhitzung des Lüftermotors, Anstieg von Konzentrationsstörungen und Krankmeldungen im Team.',
    signsOfDegradation: [
      'Sichtbare graue Staubschicht auf dem Vorfilter',
      'Erhöhte Lüftergeräusche bei gleicher Luftleistung',
      'Filterwechselanzeige signalisiert Sättigung'
    ],
    scientificNote:
      'HEPA-H14-Filter scheiden 99,995 % aller Partikel bis 0,1 Mikrometer ab. Ein regelmäßiger Tausch sichert die Einhaltung der Arbeitsstättenrichtlinie ASR A3.6.',
    proTips:
      'Saugen Sie den Vorfilter monatlich vorsichtig ab, um die Standzeit der Haupt-HEPA-Kassette voll auszuschöpfen.',
    urgencyLevel: 'high',
    badgeLabel: 'Gesunde Raumluft'
  },
  {
    id: 'first-aid',
    title: 'Erste-Hilfe-Kasten Prüfung nach DIN 13157',
    category: 'safety',
    categoryLabel: 'Arbeitsschutz & DGUV',
    cycleDays: 180,
    cycleDisplay: 'Halbjährliche Sicht- & Verfallsprüfung',
    hygieneReason:
      'Sterile Kompressen und Verbandpäckchen haben begrenzte Haltbarkeitsfristen. Gealterte Klebstoffe bei Pflastern haften im Notfall nicht mehr zuverlässig.',
    dangerOfNeglect:
      'Fehlendes Material bei Notfällen, Beanstandung bei Berufsgenossenschafts-Prüfungen (DGUV Vorschrift 1).',
    signsOfDegradation: [
      'Siegel am Koffer gebrochen oder beschädigt',
      'Pflasterstreifen oder Einmalhandschuhe wurden entnommen und nicht nachgefüllt',
      'Aufdruck des Verfallsdatums nähert sich oder ist überschritten'
    ],
    scientificNote:
      'Elastische Binden und Handschuhe verspröden bei Temperaturschwankungen in Büro- und Werkstatträumen nach 2 bis 3 Jahren.',
    proTips:
      'Führen Sie ein Nachweisblatt im Kasten mit Datum und Unterschrift des Prüfers.',
    urgencyLevel: 'medium',
    badgeLabel: 'DGUV Vorschrift'
  }
];

export function mapGuideToPreset(guide: ReplacementGuideItem): ConsumableItem {
  const catMap: Record<string, string> = {
    office: 'Bürobedarf & Schreibwaren',
    it: 'IT- & Druckerausstattung',
    sanitary: 'Reinigung, Hygiene & Teeküche',
    hvac: 'Klima, Lüftung & Haustechnik',
    safety: 'Arbeitsschutz & Erste Hilfe',
    facility: 'Werkstatt, Betrieb & Instandhaltung',
    maintenance: 'Wiederkehrende Prüfungen & Wartung'
  };

  return {
    id: `guide-item-de-${Date.now()}`,
    name: guide.title,
    category: catMap[guide.category] || 'Sonstige Betriebsverbrauchsgüter',
    cycleValue: guide.cycleDays >= 30 ? Math.round(guide.cycleDays / 30) : guide.cycleDays,
    cycleUnit: guide.cycleDays >= 30 ? 'month' : 'day',
    lastReplacedDate: getTodayString(),
    purchaseLeadDays: 5,
    memo: guide.proTips,
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
