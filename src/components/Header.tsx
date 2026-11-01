import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  Database, 
  Sliders, 
  ChevronDown,
  LayoutGrid,
  Calendar,
  BookOpen,
  History,
  RotateCcw,
  Bell,
  Briefcase
} from 'lucide-react';
import { ViewMode } from '../types/consumable';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenMasterModal: () => void;
  onOpenIndustryTemplateModal?: () => void;
  notificationPermission: NotificationPermission | 'unsupported';
  onRequestNotification: () => void;
  onOpenNotificationModal?: () => void;
  urgentCount: number;
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenBackupModal,
  onOpenMasterModal,
  onOpenIndustryTemplateModal,
  notificationPermission,
  onRequestNotification,
  onOpenNotificationModal,
  urgentCount,
  viewMode = 'list',
  onViewChange
}) => {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const navItems = [
    { id: 'list' as ViewMode, label: 'Artikel', icon: LayoutGrid },
    { id: 'calendar' as ViewMode, label: 'Kalender', icon: Calendar },
    { id: 'history' as ViewMode, label: 'Historie', icon: History },
    { id: 'guide' as ViewMode, label: 'Wechsel-Leitfaden', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 h-16">
          {/* Logo und Markenauftritt */}
          <div 
            onClick={() => onViewChange && onViewChange('list')} 
            className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform duration-200">
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                Replenish
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-blue-100 text-blue-800 tracking-wider">
                  for Work
                </span>
                <span className="hidden lg:inline text-[10px] text-slate-500 font-medium tracking-wide">
                  Betriebsbedarf & Wartungszyklen
                </span>
              </div>
            </div>
          </div>

          {/* Desktop-Navigation */}
          {onViewChange && (
            <div className="hidden md:inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = viewMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-blue-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 stroke-[2.3]' : 'text-slate-400 stroke-[1.8]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Aktionen rechts */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Branchenvorlagen */}
            {onOpenIndustryTemplateModal && (
              <button
                onClick={onOpenIndustryTemplateModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100/80 active:scale-95 rounded-xl border border-blue-200/80 shadow-2xs transition-all cursor-pointer"
                title="Artikel & Prüfungen aus Branchenvorlagen importieren"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Vorlagen</span>
              </button>
            )}

            {/* Artikel hinzufügen */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
              <span>Hinzufügen</span>
            </button>

            {/* Benachrichtigungen */}
            <button
              onClick={() => {
                if (onOpenNotificationModal) onOpenNotificationModal();
                else onRequestNotification();
              }}
              className="p-1.5 sm:p-2 sm:px-2.5 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 bg-white transition-all inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium relative active:scale-95 shadow-2xs shrink-0"
              title="Erinnerungs- und Alarmeinstellungen"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline text-xs font-medium">Hinweise</span>
              {notificationPermission !== 'granted' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Stammdaten */}
            <button
              onClick={onOpenMasterModal}
              className="hidden sm:inline-flex p-2 sm:px-2.5 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 bg-white transition-all items-center gap-1.5 cursor-pointer text-xs font-medium active:scale-95 shadow-2xs shrink-0"
              title="Vordefinierte Bedarfsartikel und Kategorien verwalten"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline text-xs font-medium">Vorlagen</span>
            </button>

            {/* Daten & Tools Menü */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer border shadow-2xs active:scale-95 shrink-0 ${
                  isToolsMenuOpen
                    ? 'bg-slate-100 text-slate-900 border-slate-300'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Datenverwaltung und Systemeinstellungen"
              >
                <Database className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline text-xs font-medium">Daten & Tools</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsToolsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 w-64 sm:w-72 bg-white backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl py-2 z-30 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2 text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                      Systemtools & Daten
                    </div>

                    {onOpenIndustryTemplateModal && (
                      <button
                        onClick={() => {
                          setIsToolsMenuOpen(false);
                          onOpenIndustryTemplateModal();
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <div className="flex flex-col">
                          <span className="font-semibold">Branchenvorlagen</span>
                          <span className="text-[10px] text-slate-400">Verbrauchspakete nach Gewerken importieren</span>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        onOpenBackupModal();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <Database className="w-4 h-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold">JSON-Sicherung & Wiederherstellung</span>
                        <span className="text-[10px] text-slate-400">Lokale Daten exportieren oder übertragen</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        onOpenMasterModal();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold">Stammdaten & Kategorien</span>
                        <span className="text-[10px] text-slate-400">Vorlagen und Kategorien anpassen</span>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        if (onOpenNotificationModal) onOpenNotificationModal();
                        else onRequestNotification();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <div className="flex flex-col">
                          <span className="font-semibold">Benachrichtigungseinstellungen</span>
                          <span className="text-[10px] text-slate-400">Browser-Erinnerungen aktivieren</span>
                        </div>
                      </div>
                      {notificationPermission === 'granted' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">Aktiv</span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">Aktivieren</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
