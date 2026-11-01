import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Wind,
  ShieldAlert,
  Flame,
  Activity,
  RotateCcw
} from 'lucide-react';

interface GuideMeta {
  frTitle: string;
  categoryName: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  urgencyTag: string;
  urgencyBadgeStyle: string;
  metricLabel: string;
  metricValue: string;
  keyCheck: string;
  imageFileName?: string;
}

const GUIDE_METAS: Record<string, GuideMeta> = {
  'shredder-oil': {
    frTitle: 'LUBRIFIANT DESTRUCTEUR',
    categoryName: 'Bureautique & Impression',
    icon: Sparkles,
    accentColor: 'text-blue-700',
    bgGradient: 'from-blue-500/15 via-indigo-500/10 to-sky-500/10',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    badgeText: 'Longévité du matériel',
    urgencyTag: 'Évite les bourrages de lames',
    urgencyBadgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    metricLabel: 'Cycle recommandé',
    metricValue: 'Toutes les 2 semaines',
    keyCheck: 'Grincements · Poussière · Bourrages',
    imageFileName: 'power_strip.jpg'
  },
  'paper-towel': {
    frTitle: 'DISTRIBUTEURS ESSUIE-MAINS',
    categoryName: 'Hygiène & Sanitaires',
    icon: Droplets,
    accentColor: 'text-teal-700',
    bgGradient: 'from-teal-500/15 via-emerald-500/10 to-sky-500/10',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    badgeText: 'Hygiène des mains',
    urgencyTag: 'Contrôle des infections',
    urgencyBadgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    metricLabel: 'Cycle recommandé',
    metricValue: 'Hebdomadaire',
    keyCheck: 'Niveau fenêtre · Réserve · Propreté',
    imageFileName: 'towel.jpg'
  },
  'ups-battery': {
    frTitle: 'BATTERIES ONDULEURS (ASI)',
    categoryName: 'Informatique & Réseau',
    icon: Activity,
    accentColor: 'text-purple-700',
    bgGradient: 'from-purple-500/15 via-indigo-500/10 to-blue-500/10',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    badgeText: 'Sécurité serveurs',
    urgencyTag: 'Zéro coupure électrique',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Cycle recommandé',
    metricValue: '2 à 3 ans',
    keyCheck: 'Autonomie · Voyant batterie · Température',
    imageFileName: 'toothbrush.jpg'
  },
  'hvac-filters': {
    frTitle: 'FILTRES CLIMATISATION & VMC',
    categoryName: 'Climatisation & Qualité de l’air',
    icon: Wind,
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-cyan-500/10',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeText: 'Qualité de l’air',
    urgencyTag: 'Économie d’énergie',
    urgencyBadgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    metricLabel: 'Cycle recommandé',
    metricValue: 'Tous les 3 mois',
    keyCheck: 'Encrassement · Débit d’air · Odeurs',
    imageFileName: 'purifier.jpg'
  },
  'fire-extinguisher': {
    frTitle: 'EXTINCTEURS D’INCENDIE',
    categoryName: 'Sécurité incendie & ERP',
    icon: Flame,
    accentColor: 'text-rose-700',
    bgGradient: 'from-rose-500/15 via-red-500/10 to-amber-500/10',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    badgeText: 'Sécurité ERP & Travail',
    urgencyTag: 'Obligation réglementaire',
    urgencyBadgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    metricLabel: 'Cycle recommandé',
    metricValue: 'Mensuel (Visuel)',
    keyCheck: 'Manomètre vert · Plomb intact · Dégagement',
    imageFileName: 'gas_canister.jpg'
  }
};

interface GuideIllustrationProps {
  guideId: string;
  title: string;
  categoryLabel?: string;
  className?: string;
}

export const GuideIllustration: React.FC<GuideIllustrationProps> = ({
  guideId,
  title,
  categoryLabel,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const meta = GUIDE_METAS[guideId];

  const IconComp = meta?.icon || Sparkles;
  const accentColor = meta?.accentColor || 'text-blue-700';
  const bgGradient = meta?.bgGradient || 'from-blue-500/15 via-slate-500/10 to-sky-500/10';
  const frTitle = meta?.frTitle || title.toUpperCase();
  const catName = categoryLabel || meta?.categoryName || 'Consommables & Maintenance';
  const badgeText = meta?.badgeText || 'Entretien préventif';
  const urgencyTag = meta?.urgencyTag || 'Gestion du cycle';
  const metricLabel = meta?.metricLabel || 'Périodicité';
  const metricValue = meta?.metricValue || 'Régulier';
  const keyCheck = meta?.keyCheck || 'Contrôle visuel · Usure';

  const imageSrc = meta?.imageFileName ? `/guides/${meta.imageFileName}` : undefined;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${bgGradient} p-4 sm:p-5 shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center">
            <IconComp className={`w-5 h-5 ${accentColor}`} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {catName}
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              {frTitle}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
            {badgeText}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {urgencyTag}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-500 block">{metricLabel}</span>
          <span className="font-extrabold text-slate-800">{metricValue}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Points de contrôle</span>
          <span className="text-[11px] font-medium text-slate-600">{keyCheck}</span>
        </div>
      </div>
    </div>
  );
};
