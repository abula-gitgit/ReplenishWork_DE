export interface IndustryTemplateItem {
  name: string;
  category: string;
  cycleValue: number;
  cycleUnit: 'day' | 'week' | 'month' | 'year';
  purchaseLeadDays: number;
  location?: string;
  manager?: string;
  supplier?: string;
  minStock?: string;
  modelNumber?: string;
  memo?: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  iconName: string;
  badge: string;
  description: string;
  targetRole: string;
  items: IndustryTemplateItem[];
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'office-general',
    name: 'Büro & Zentrale Verwaltung',
    iconName: 'Building2',
    badge: 'Empfohlen für: Firmenzentralen, Kanzleien & Mittelstand',
    description: 'Bürobedarf, A4/A3-Kopierpapier, Druckertoner, Aktenvernichter-Öl, Teeküchenhygiene und Luftfilter.',
    targetRole: 'Office Manager, Einkaufsleitung, Hausverwaltung',
    items: [
      {
        name: 'Kopierpapier DIN A4 standard (Karton 5x500 Blatt)',
        category: 'Bürobedarf & Schreibwaren',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 3,
        location: 'Druckerraum EG Regal A-1',
        manager: 'Zentrale Verwaltung',
        supplier: 'Büromarkt24 / Schäfer Shop',
        minStock: '2 Kartons',
        modelNumber: 'A4-80G-WEISS',
        memo: 'Nachbestellen sobald der Bestand unter 2 Kartons fällt. Trocken lagern.'
      },
      {
        name: 'Kopierpapier DIN A3 (Karton 5x500 Blatt)',
        category: 'Bürobedarf & Schreibwaren',
        cycleValue: 1,
        cycleUnit: 'month',
        purchaseLeadDays: 4,
        location: 'Druckerraum EG Regal A-2',
        manager: 'Zentrale Verwaltung',
        supplier: 'Büromarkt24',
        minStock: '1 Karton',
        modelNumber: 'A3-80G',
        memo: 'Für Pläne, Diagramme und Monatsberichte.'
      },
      {
        name: 'Aktenvernichter-Pflegeöl / Ölpapier',
        category: 'Bürobedarf & Schreibwaren',
        cycleValue: 1,
        cycleUnit: 'month',
        purchaseLeadDays: 4,
        location: 'Kopierraum / Reißwolf',
        manager: 'Verwaltung',
        supplier: 'Amazon Business',
        minStock: '1 Flasche',
        memo: 'DSGVO-Sicherheitsstufe erhalten: Schneidwalzen regelmäßig ölen.'
      },
      {
        name: 'Toner Schwarz (Multifunktions-Hauptkopierer)',
        category: 'IT- & Druckerausstattung',
        cycleValue: 2,
        cycleUnit: 'month',
        purchaseLeadDays: 5,
        location: 'IT-Schrank Raum 102',
        manager: 'IT-Support',
        supplier: 'Systemhaus / Wartungspartner',
        minStock: '1 Kartusche',
        modelNumber: 'TK-5280K',
        memo: 'Immer 1 ungeöffnete Originalkartusche im IT-Schrank vorhalten.'
      },
      {
        name: 'Kaffeebohnen Crema (4x 1kg Vorteilspack)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 3,
        location: 'Teeküche Schrank B',
        manager: 'Office Management',
        supplier: 'Dallmayr / Großhandel',
        minStock: '2 Beutel',
        memo: 'Für den Mitarbeiter-Kaffeevollautomaten.'
      },
      {
        name: 'Wasserfilter-Kartusche (Kaffeemaschine Teeküche)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 2,
        cycleUnit: 'month',
        purchaseLeadDays: 4,
        location: 'Teeküche Unterschrank',
        manager: 'Office Management',
        supplier: 'Brita Professional',
        minStock: '1 Filterpatrone',
        modelNumber: 'PURITY C150',
        memo: 'Kalkschutz für Leitungen, sichert unverfälschten Geschmack.'
      },
      {
        name: 'Falthandtücher 2-lagig Z-Falz (Karton 3.200 Blatt)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 4,
        location: 'Sanitär-Lager',
        manager: 'Reinigungsdienst',
        supplier: 'Hygiene-Shop Nord',
        minStock: '2 Kartons',
        memo: 'Spender in Mitarbeiter-WCs täglich auffüllen.'
      }
    ]
  },
  {
    id: 'clinic-medical',
    name: 'Medizinische Praxis & Apotheke',
    iconName: 'HeartPulse',
    badge: 'Empfohlen für: Arztpraxen, Zahnärzte, Reha & Labore',
    description: 'Medizinische Einmalhandschuhe, Händedesinfektion VAH, Autoklaven-Sterilbeutel, OP-Masken und Liegenabdeckungen.',
    targetRole: 'Praxismanager, Leitende MFA, Hygienebeauftragte',
    items: [
      {
        name: 'Nitril-Untersuchungshandschuhe puderfrei (Box 100 Stk. Gr. M)',
        category: 'Arbeitsschutz & Erste Hilfe',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 3,
        location: 'Behandlungszimmer 1-3 Spender',
        manager: 'Leitende MFA',
        supplier: 'DocCheck / Henry Schein',
        minStock: '5 Boxen',
        modelNumber: 'EN455-M-BLAU',
        memo: 'Norm EN 455 & EN ISO 374-5, latexfrei.'
      },
      {
        name: 'Händedesinfektionsmittel 1.000ml Euroflasche',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 3,
        cycleUnit: 'week',
        purchaseLeadDays: 4,
        location: 'Eurospender Eingang & Behandlungsräume',
        manager: 'Hygienebeauftragte',
        supplier: 'Bode Sterillium / Schülke',
        minStock: '3 Flaschen',
        memo: 'VAH-gelistet, begrenzt viruzid PLUS.'
      },
      {
        name: 'Flächendesinfektionstücher alkoholfrei (Spendereimer 120 Stk)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 3,
        location: 'Untersuchungsliegen Beistellwagen',
        manager: 'MFA Team',
        supplier: 'Schülke Mikrozid',
        minStock: '2 Eimer',
        memo: 'Für empfindliche Kunstlederbezüge von Untersuchungsliegen.'
      },
      {
        name: 'Autoklaven-Sterilisationsfolie / Klarsichtbeutel (DIN EN ISO 11607)',
        category: 'Wiederkehrende Prüfungen & Wartung',
        cycleValue: 1,
        cycleUnit: 'month',
        purchaseLeadDays: 5,
        location: 'Sterilisationsraum Regal 2',
        manager: 'Aufbereitungskraft',
        supplier: 'Melag Fachhändler',
        minStock: '2 Rollen',
        memo: 'Mit Farbwechsel-Prozessindikator Dampfsterilisation.'
      },
      {
        name: 'Ärzterollen Liegenpapier 50cm x 50m (Karton 9 Rollen)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 3,
        cycleUnit: 'week',
        purchaseLeadDays: 4,
        location: 'Praxis-Vorratskammer',
        manager: 'Praxisassistenz',
        supplier: 'Praxisdienst',
        minStock: '2 Kartons',
        memo: 'Patientenauflage nach jeder Behandlung erneuern.'
      }
    ]
  },
  {
    id: 'restaurant-kitchen',
    name: 'Gastronomie, Cafés & Großküche',
    iconName: 'UtensilsCrossed',
    badge: 'Empfohlen für: Restaurants, Cafés, Bäckereien & Bars',
    description: 'HACCP-Reiniger, Fettlöser, Wasserenthärter für Kaffeemaschinen, Frittieröl-Teststreifen und Spülchemie.',
    targetRole: 'Küchenchef, Restaurantleitung, Schichtleiter',
    items: [
      {
        name: 'Kombidämpfer-Reinigungstabletten & Klarspüler (Eimer)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 3,
        cycleUnit: 'week',
        purchaseLeadDays: 5,
        location: 'Chemielager Küche Regal 1',
        manager: 'Küchenchef',
        supplier: 'Rational / Gastro-Fachhändler',
        minStock: '1 Eimer',
        memo: 'Für das automatische Nacht-Reinigungsprogramm.'
      },
      {
        name: 'Wasserenthärter-Filterpatrone Gastro-Espressomaschine',
        category: 'Klima, Lüftung & Haustechnik',
        cycleValue: 2,
        cycleUnit: 'month',
        purchaseLeadDays: 6,
        location: 'Unter der Bar-Kaffeemaschine',
        manager: 'Barista / Barchef',
        supplier: 'Brita PURITY Finest',
        minStock: '1 Kartusche',
        memo: 'Verhindert Ausfallzeiten im Stoßgeschäft.'
      },
      {
        name: 'Frittieröl-Qualitätsprüfstreifen / TPM-Messgerät Batterien',
        category: 'Wiederkehrende Prüfungen & Wartung',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 4,
        location: 'Küche Frittierstation',
        manager: 'Postenchef Fritteuse',
        supplier: 'Testo / Gastro-Labor',
        minStock: '1 Packung',
        memo: 'HACCP-Messprotokoll: Wechsel bei über 24% TPM.'
      },
      {
        name: 'Küchenrollen nassfest 3-lagig (Großpackung blau)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 1,
        cycleUnit: 'week',
        purchaseLeadDays: 3,
        location: 'Küche Vorratsregal',
        manager: 'Spülküchenteam',
        supplier: 'Transgourmet / Metro',
        minStock: '2 Packungen',
        memo: 'Lebensmittelunbedenklich, fusselfrei.'
      }
    ]
  },
  {
    id: 'salon-beauty',
    name: 'Friseursalon, Barbershop & Kosmetik',
    iconName: 'Scissors',
    badge: 'Empfohlen für: Salons, Barbiere & Kosmetikstudios',
    description: 'Einweghalsschutzkrausen, biologisch abbaubare Handtücher, Scherkopf-Desinfektionsspray und Farbfolien.',
    targetRole: 'Salonleitung, Meister, Selbständige Stylisten',
    items: [
      {
        name: 'Krepp-Halsschutzbänder selbstklebend (Packung 5 Rollen)',
        category: 'Bürobedarf & Schreibwaren',
        cycleValue: 3,
        cycleUnit: 'week',
        purchaseLeadDays: 4,
        location: 'Bedienplätze Schublade',
        manager: 'Salonleitung',
        supplier: 'Friseurbedarf Großhandel',
        minStock: '2 Packungen',
        memo: 'Schützt den Kundenkragen vor Schnitthaaren und Feuchtigkeit.'
      },
      {
        name: 'Klingendesinfektionsspray & Scherkopföl (Blade Ice)',
        category: 'Werkstatt, Betrieb & Instandhaltung',
        cycleValue: 1,
        cycleUnit: 'month',
        purchaseLeadDays: 3,
        location: 'Barber-Arbeitsplatz',
        manager: 'Lead Barber',
        supplier: 'Wahl / Moser / Andis',
        minStock: '2 Dosen',
        memo: 'Reinigt, kühlt, ölt und schützt vor Rost.'
      },
      {
        name: 'Einmal-Friseurhandtücher biologisch abbaubar (100 Stk)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 4,
        location: 'Waschbereich Regal',
        manager: 'Assistenz Stylist',
        supplier: 'Eco-Towel / Hair-Direct',
        minStock: '1 Karton',
        memo: 'Enorme Energie- und Wasserersparnis gegenüber Wäscheservice.'
      },
      {
        name: 'Strähnenfolie Alufolie Rolle 12cm breit (100m)',
        category: 'Bürobedarf & Schreibwaren',
        cycleValue: 3,
        cycleUnit: 'week',
        purchaseLeadDays: 4,
        location: 'Farbküche Abroller',
        manager: 'Colorist',
        supplier: 'Wella / L’Oréal Partner',
        minStock: '2 Rollen',
        memo: 'Geprägte Spezialfolie für optimalen Halt bei Balayage.'
      }
    ]
  },
  {
    id: 'workshop-maintenance',
    name: 'Handwerk, Werkstatt & Instandhaltung',
    iconName: 'Wrench',
    badge: 'Empfohlen für: Schlossereien, Kfz-Betriebe & Fertigung',
    description: 'Industrie-Putztücher, Schnell-Bremsenreiniger, Hautschutzcremes, Schleifscheiben und Atemschutzmasken.',
    targetRole: 'Werkstattleiter, Instandhalter, Sicherheitsbeauftragter',
    items: [
      {
        name: 'Industrie-Putztuchrolle blau (1.000 Abrisse, ölbeständig)',
        category: 'Werkstatt, Betrieb & Instandhaltung',
        cycleValue: 2,
        cycleUnit: 'week',
        purchaseLeadDays: 3,
        location: 'Werkbank Ständer Halle 1',
        manager: 'Werkstattleiter',
        supplier: 'Würth / Berner',
        minStock: '2 Rollen',
        memo: 'Lösungsmittelresistent, saugt Schmieröle sofort auf.'
      },
      {
        name: 'Schnell-Teilereiniger / Bremsenreiniger (Karton 12x 500ml)',
        category: 'Werkstatt, Betrieb & Instandhaltung',
        cycleValue: 1,
        cycleUnit: 'month',
        purchaseLeadDays: 4,
        location: 'Gefahrstoffschrank Regal 2',
        manager: 'Montageleiter',
        supplier: 'Würth / Förch',
        minStock: '1 Karton',
        memo: 'Acetonfrei, rückstandslose Schnellabtrocknung.'
      },
      {
        name: 'Hautschutz- & Hautreinigungspaste (Kanister 10L für Spender)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 2,
        cycleUnit: 'month',
        purchaseLeadDays: 5,
        location: 'Waschraum Umkleide',
        manager: 'Sicherheitsbeauftragter',
        supplier: 'Stoko / Deb / Peter Greven',
        minStock: '1 Kanister',
        memo: 'Reibt auch hartnäckige Fette und Teer ohne Hautreizung ab.'
      },
      {
        name: 'Trennscheiben Edelstahl 125 x 1,0mm (Dose 25 Stk)',
        category: 'Werkstatt, Betrieb & Instandhaltung',
        cycleValue: 3,
        cycleUnit: 'week',
        purchaseLeadDays: 3,
        location: 'Werkzeugausgabe Schrank 3',
        manager: 'Schlossermeister',
        supplier: 'Rhodius / Pferd / Bosch',
        minStock: '1 Dose',
        memo: 'Für gratfreie Schnitte mit geringster thermischer Belastung.'
      }
    ]
  },
  {
    id: 'hotel-lodging',
    name: 'Hotellerie & Beherbergungsbetriebe',
    iconName: 'Hotel',
    badge: 'Empfohlen für: Hotels, Gasthöfe, Pensionen & Boardinghouses',
    description: 'Gäste-Kosmetik-Refills, Einweg-Slipper, Sanitär-Kalklöser, HEPA-Raumluftfilter und Begrüßungskapseln.',
    targetRole: 'Hoteldirektion, Housekeeping Managerin, Haustechniker',
    items: [
      {
        name: 'Gäste-Duschgel & Shampoo Nachfüllkanister (5L)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 3,
        cycleUnit: 'week',
        purchaseLeadDays: 5,
        location: 'Housekeeping-Zentrallager EG',
        manager: 'Housekeeping Managerin',
        supplier: 'ADA Cosmetics / Großhandel',
        minStock: '2 Kanister',
        memo: 'Für nachfüllbare Pumpspender in den Hotelbädern.'
      },
      {
        name: 'Hotel-Zimmerslipper Einweg (Karton 100 Paar)',
        category: 'Bürobedarf & Schreibwaren',
        cycleValue: 1,
        cycleUnit: 'month',
        purchaseLeadDays: 6,
        location: 'Wäschelager Fach B-3',
        manager: 'Housekeeping Team',
        supplier: 'Hotelbedarf-Online',
        minStock: '1 Karton',
        memo: 'Für Suiten, Spa-Gäste und VIP-Arrangements.'
      },
      {
        name: 'Sanitär-Entkalker & Glanzreiniger Konzentrat (10L)',
        category: 'Reinigung, Hygiene & Teeküche',
        cycleValue: 1,
        cycleUnit: 'month',
        purchaseLeadDays: 4,
        location: 'Reinigungszentrale UG',
        manager: 'Reinigungsleitung',
        supplier: 'Ecolab / Kiehl / Buzil',
        minStock: '1 Kanister',
        memo: 'Gegen Kalkflecken auf Duschglas und Armaturen.'
      },
      {
        name: 'HEPA-Ersatzfilter für Hotelzimmer-Luftreiniger',
        category: 'Klima, Lüftung & Haustechnik',
        cycleValue: 6,
        cycleUnit: 'month',
        purchaseLeadDays: 7,
        location: 'Haustechnik Werkstatt',
        manager: 'Leiter Haustechnik',
        supplier: 'Gerätehersteller Kundendienst',
        minStock: '2 Filtersätze',
        memo: 'Zertifizierter Filterwechsel für zertifizierte Allergikerzimmer.'
      }
    ]
  }
];
