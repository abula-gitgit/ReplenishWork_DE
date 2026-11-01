import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Mail, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Globe, 
  Copy, 
  CheckCheck
} from 'lucide-react';

export type InfoTab = 'about' | 'privacy' | 'terms' | 'contact';

interface InfoPagesViewProps {
  initialTab?: InfoTab;
  onNavigateToList: () => void;
  onTabChange?: (tab: InfoTab) => void;
}

export const InfoPagesView: React.FC<InfoPagesViewProps> = ({
  initialTab = 'about',
  onNavigateToList,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<InfoTab>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const handleSelectTab = (tab: InfoTab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('stoooone.studio@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Zurück-Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateToList}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zurück zur Artikelliste</span>
        </button>
      </div>

      {/* Tab-Leiste */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => handleSelectTab('about')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Über die App</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('privacy')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Datenschutz</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('terms')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Nutzungsbedingungen</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('contact')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Kontakt & Support</span>
        </button>
      </div>

      {/* Tab: Über uns */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Über Replenish for Work
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Der professionelle Zyklus- & Nachbestellungsplaner für Betriebe, Büros und Praxen.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              In Unternehmen, Arztpraxen, Werkstätten und Gastronomiebetrieben führen verbrauchte Materialien oder versäumte Prüffristen schnell zu kostspieligen Arbeitsunterbrechungen. <strong>Replenish for Work</strong> wurde entwickelt, um Wechselzyklen zu automatisieren und Nachbestellfristen unter Berücksichtigung von Lieferanten-Vorlaufzeiten rechtzeitig anzumahnen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">100 % Lokale Datenspeicherung</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ihre Artikel, Preise, Lieferanten und Notizen werden ausschließlich in Ihrem Browser (IndexedDB/LocalStorage) gespeichert. Keine Übertragung an externe Cloud-Server.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Vorlaufzeit-Berechnung (Lead Time)</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bestellungen werden vor Erreichen des Stichtags erinnert, damit neue Ware rechtzeitig im Lager eintrifft.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-950 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block mb-0.5">Suchen Sie eine Version für den privaten Haushalt?</span>
                <p className="text-slate-600">
                  Nutzen Sie die Standardversion Replenish für Haushaltsartikel, Bad und Küche.
                </p>
              </div>
              <a
                href="https://rp.easy-log.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 inline-flex items-center gap-1.5"
              >
                <span>Haushaltsversion</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Datenschutz */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Datenschutzerklärung (DSGVO-Konformität)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Ihre Privatsphäre und Unternehmensdaten stehen an erster Stelle.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h3 className="text-sm font-bold text-slate-900">1. Lokale Speicherung im Browser</h3>
            <p>
              Replenish for Work speichert sämtliche eingegebenen Informationen (Artikelnamen, Lieferanten, Preise, Mindestbestände, Notizen und Wechseltermine) ausschließlich lokal im Speicher Ihres Endgeräts (Web Storage API / IndexedDB). Eine serverseitige Erfassung oder Speicherung dieser Daten findet zu keinem Zeitpunkt statt.
            </p>

            <h3 className="text-sm font-bold text-slate-900">2. Keine Tracking-Cookies für Profildaten</h3>
            <p>
              Wir setzen keine personengebundenen Tracking-Cookies ein. Etwaige Zugriffsstatistiken (z.B. über Cloudflare Web Analytics) werden vollständig anonymisiert und aggregiert erfasst, ohne dass Rückschlüsse auf Ihre Person oder Ihr Unternehmen möglich sind.
            </p>

            <h3 className="text-sm font-bold text-slate-900">3. Werbeeinblendungen (z.B. Google AdSense)</h3>
            <p>
              Zur Finanzierung des kostenfreien Betriebs können Drittanbieter-Anzeigen geschaltet werden. Diese Anbieter können Cookies zur Reichweitenmessung nutzen. Sie können personalisierte Werbung in den Einstellungen Ihres Browsers oder über die Google-Anzeigeneinstellungen deaktivieren.
            </p>

            <h3 className="text-sm font-bold text-slate-900">4. Datensicherung und -übertragung</h3>
            <p>
              Da keine Cloud-Synchronisation erfolgt, empfehlen wir regelmäßige Sicherungen über die integrierte Funktion «JSON-Sicherung». Bei Verlust oder Löschen des Browserverlaufs kann der Datenstand jederzeit aus dieser Datei wiederhergestellt werden.
            </p>
          </div>
        </div>
      )}

      {/* Tab: AGB */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Nutzungsbedingungen & Haftungsausschluss
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Rechtliche Hinweise zur Nutzung der Webanwendung.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h3 className="text-sm font-bold text-slate-900">1. Kostenfreie Bereitstellung</h3>
            <p>
              Replenish for Work wird kostenlos und ohne Notwendigkeit einer Registrierung zur Verfügung gestellt. Die Software dient der organisatorischen Unterstützung im betrieblichen Alltag.
            </p>

            <h3 className="text-sm font-bold text-slate-900">2. Haftungsausschluss</h3>
            <p>
              Die Nutzung erfolgt auf eigene Verantwortung. Der Betreiber haftet nicht für Schäden, die durch Materialengpässe, verspätete Nachbestellungen, versäumte gesetzliche Prüffristen oder Datenverlust infolge von Browser-Zurücksetzungen entstehen.
            </p>

            <h3 className="text-sm font-bold text-slate-900">3. Änderungen des Dienstes</h3>
            <p>
              Der Betreiber behält sich vor, Funktionen anzupassen, zu erweitern oder den Betrieb der kostenfreien Anwendung einzustellen.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Kontakt */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Kontakt & Support
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Feedback, Funktionswünsche und Anfragen an das Entwicklerteam.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Haben Sie Fragen zur Anwendung, Vorschläge für neue Branchenvorlagen oder möchten Sie einen Fehler melden? Wir freuen uns über Ihre Nachricht:
            </p>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Offizielle E-Mail-Adresse</span>
                <span className="font-mono font-bold text-slate-900 text-sm">stoooone.studio@gmail.com</span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Adresse kopieren</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
