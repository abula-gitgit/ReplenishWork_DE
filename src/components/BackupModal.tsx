import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, AlertCircle, CheckCircle2, Database, Trash2 } from 'lucide-react';
import { ConsumableItem, MasterOption } from '../types/consumable';
import { exportToJSONFile, parseAndValidateImportJSON } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ConsumableItem[];
  masterOptions?: MasterOption[];
  categories?: string[];
  onImportItems: (newItems: ConsumableItem[]) => void;
  onImportMasterOptions?: (newOptions: MasterOption[]) => void;
  onImportCategories?: (newCategories: string[]) => void;
  onResetToSample: () => void;
  onClearAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  items,
  masterOptions,
  categories,
  onImportItems,
  onImportMasterOptions,
  onImportCategories,
  onResetToSample,
  onClearAll
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportToJSONFile(items, masterOptions, categories);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseAndValidateImportJSON(content);
      if (result.success && result.items) {
        onImportItems(result.items);
        if (result.masterOptions && onImportMasterOptions) {
          onImportMasterOptions(result.masterOptions);
        }
        if (result.categories && onImportCategories) {
          onImportCategories(result.categories);
        }
        const parts = [
          `${result.items.length} Verbrauchsartikel`,
          result.masterOptions ? `${result.masterOptions.length} Vorlagen` : '',
          result.categories ? `${result.categories.length} Kategorien` : ''
        ].filter(Boolean);
        setImportStatus({
          type: 'success',
          message: `Wiederherstellung erfolgreich (${parts.join(', ')}).`
        });
      } else {
        setImportStatus({
          type: 'error',
          message: result.error || 'Fehler beim Einlesen der JSON-Datei.'
        });
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-4 h-4 stroke-[2.3]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Datensicherung & Wiederherstellung
              </h2>
              <p className="text-xs text-slate-500">
                Exportieren oder importieren Sie Ihre Betriebsdaten lokal im JSON-Format.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-4">
          {/* Statusmeldung */}
          {importStatus && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Sicherung erstellen (Export)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Lädt alle aktuellen Artikel ({items.length}), Wechseldaten und Notizen als Datei auf Ihren Rechner herunter.
            </p>
            <button
              type="button"
              onClick={handleExport}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>JSON-Sicherungsdatei herunterladen</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Sicherung einspielen (Import)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Stellen Sie eine zuvor gespeicherte JSON-Datei wieder her (überschreibt vorhandene Daten).
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>JSON-Datei auswählen & einspielen</span>
            </button>
          </div>

          {/* Erweiterte Aktionen / Zurücksetzen */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Möchten Sie die Liste wirklich auf die ursprünglichen Standardbeispiele zurücksetzen?')) {
                  onResetToSample();
                  onClose();
                }
              }}
              className="py-2 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Auf Standard-Beispieldaten zurücksetzen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Achtung: Dadurch werden ALLE aktuellen Verbrauchsartikel unwiderruflich gelöscht. Fortfahren?')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="py-2 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Alle Artikel leeren</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
