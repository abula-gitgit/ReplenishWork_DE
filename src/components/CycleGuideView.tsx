import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Search,
  X,
  Plus,
  BookOpen
} from 'lucide-react';
import { REPLACEMENT_GUIDES, ReplacementGuideItem, mapGuideToPreset } from '../data/replacementGuides';
import { ConsumableItem } from '../types/consumable';
import { GuideIllustration } from './GuideIllustrations';

interface CycleGuideViewProps {
  onNavigateToList?: () => void;
  onAddPresetItem?: (preset: ConsumableItem) => void;
}

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'Alle Leitfäden' },
  { id: 'office', label: 'Büro & Dokumente' },
  { id: 'sanitary', label: 'Küche & Pause' },
  { id: 'hvac', label: 'Lüftung & Klima' },
  { id: 'safety', label: 'Arbeitsschutz & DGUV' }
];

export const CycleGuideView: React.FC<CycleGuideViewProps> = ({ onNavigateToList, onAddPresetItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ReplacementGuideItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: REPLACEMENT_GUIDES.length };
    REPLACEMENT_GUIDES.forEach((guide) => {
      counts[guide.category] = (counts[guide.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredGuides = useMemo(() => {
    return REPLACEMENT_GUIDES.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(query);
        const matchesReason = item.hygieneReason.toLowerCase().includes(query);
        const matchesDanger = item.dangerOfNeglect.toLowerCase().includes(query);
        const matchesSigns = item.signsOfDegradation.some((s) => s.toLowerCase().includes(query));
        const matchesTips = item.proTips.toLowerCase().includes(query);
        return matchesTitle || matchesCategory || matchesReason || matchesDanger || matchesSigns || matchesTips;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Leitfaden-Kopfbereich */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Leitfaden für betriebliche Wartungs- & Wechselzyklen</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Herstellerempfehlungen und Richtwerte für Arbeitsplatz- und Betriebsausstattung.
              </p>
            </div>
          </div>

          {onNavigateToList && (
            <button
              type="button"
              onClick={onNavigateToList}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Zu meinen Artikeln</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Such- und Filterleiste */}
        <div className="pt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Im Leitfaden suchen (z.B. Schredder, Wasserfilter, Erste-Hilfe)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              const count = categoryCounts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leitfaden-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-5 sm:p-6 flex flex-col justify-between"
          >
            <div>
              <GuideIllustration
                guideId={guide.id}
                title={guide.title}
                categoryLabel={guide.categoryLabel}
                className="mb-4"
              />

              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2">
                {guide.title}
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Warum dieser Wechselzyklus?</span>
                  <p className="leading-relaxed text-slate-600">{guide.hygieneReason}</p>
                </div>

                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100">
                  <span className="font-bold text-rose-900 block mb-1">Risiken bei Verzögerung</span>
                  <p className="leading-relaxed text-rose-700">{guide.dangerOfNeglect}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedArticle(guide)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Technische Details einsehen &rarr;
              </button>

              {onAddPresetItem && (
                <button
                  type="button"
                  onClick={() => onAddPresetItem(mapGuideToPreset(guide))}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100/80 active:scale-95 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Diesen Artikel überwachen</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal mit Detailansicht */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  {selectedArticle.categoryLabel}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Empfohlenes Wechselintervall</h4>
                <p className="font-extrabold text-blue-700">{selectedArticle.cycleDisplay}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Technische & hygienische Begründung</h4>
                <p>{selectedArticle.hygieneReason}</p>
              </div>

              <div>
                <h4 className="font-bold text-rose-900 mb-1">Auswirkungen bei Vernachlässigung</h4>
                <p className="text-rose-700">{selectedArticle.dangerOfNeglect}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Typische Verschleißzeichen</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedArticle.signsOfDegradation.map((sign, idx) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>

              {selectedArticle.scientificNote && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs">
                  <span className="font-bold text-blue-900 block mb-0.5">Normative Grundlage / Referenz</span>
                  <p className="text-blue-950">{selectedArticle.scientificNote}</p>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">Praxistipp für den Betrieb</span>
                <p>{selectedArticle.proTips}</p>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Schließen
              </button>
              {onAddPresetItem && (
                <button
                  type="button"
                  onClick={() => {
                    onAddPresetItem(mapGuideToPreset(selectedArticle));
                    setSelectedArticle(null);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  In meine Liste aufnehmen
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
