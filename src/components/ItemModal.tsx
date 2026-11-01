import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sliders, Check, MapPin, User, ShoppingBag, Package } from 'lucide-react';
import { ConsumableItem, Category, CATEGORIES, CycleUnit, MasterOption } from '../types/consumable';
import { getTodayString, addCycle, subtractDays, formatDateDisplay } from '../utils/dateCalc';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ConsumableItem>) => void;
  initialItem?: ConsumableItem | null;
  masterOptions: MasterOption[];
  onOpenMasterManager: () => void;
  onAddNewMasterOption: (option: MasterOption) => void;
  categories?: string[];
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  masterOptions,
  onOpenMasterManager,
  onAddNewMasterOption,
  categories = CATEGORIES
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(categories[0] || 'Bürobedarf & Schreibwaren');
  const [cycleValue, setCycleValue] = useState<number>(1);
  const [cycleUnit, setCycleUnit] = useState<CycleUnit>('month');
  const [lastReplacedDate, setLastReplacedDate] = useState(getTodayString());
  const [purchaseLeadDays, setPurchaseLeadDays] = useState<number>(7);
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [supplier, setSupplier] = useState('');
  const [minStock, setMinStock] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [saveToMaster, setSaveToMaster] = useState(true);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategory(initialItem.category);
      setCycleValue(initialItem.cycleValue);
      setCycleUnit(initialItem.cycleUnit);
      setLastReplacedDate(initialItem.lastReplacedDate);
      setPurchaseLeadDays(initialItem.purchaseLeadDays);
      setLocation(initialItem.location || '');
      setManager(initialItem.manager || '');
      setSupplier(initialItem.supplier || '');
      setMinStock(initialItem.minStock || '');
      setModelNumber(initialItem.modelNumber || '');
      setPurchaseUrl(initialItem.purchaseUrl || '');
      setMemo(initialItem.memo || '');
    } else {
      setName('');
      setCategory(categories[0] || 'Bürobedarf & Schreibwaren');
      setCycleValue(1);
      setCycleUnit('month');
      setLastReplacedDate(getTodayString());
      setPurchaseLeadDays(7);
      setLocation('');
      setManager('');
      setSupplier('');
      setMinStock('');
      setModelNumber('');
      setPurchaseUrl('');
      setMemo('');
    }
    setErrors({});
  }, [initialItem, isOpen, categories]);

  if (!isOpen) return null;

  const handleSelectMasterOption = (opt: MasterOption) => {
    setName(opt.name);
    setCategory(opt.category);
    if (opt.defaultCycleValue) setCycleValue(opt.defaultCycleValue);
    if (opt.defaultCycleUnit) setCycleUnit(opt.defaultCycleUnit);
    if (opt.defaultLeadDays !== undefined) setPurchaseLeadDays(opt.defaultLeadDays);
    if (opt.defaultLocation) setLocation(opt.defaultLocation);
    if (opt.defaultSupplier) setSupplier(opt.defaultSupplier);
    if (opt.defaultMinStock) setMinStock(opt.defaultMinStock);
    if (opt.defaultMemo) setMemo(opt.defaultMemo);
  };

  const calculatedNextDate = addCycle(lastReplacedDate, cycleValue, cycleUnit);
  const calculatedReminderDate = subtractDays(calculatedNextDate, purchaseLeadDays);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Der Artikelname ist ein Pflichtfeld.';
    }
    if (!cycleValue || cycleValue <= 0) {
      newErrors.cycleValue = 'Bitte ein Intervall größer als 0 angeben.';
    }
    if (!lastReplacedDate) {
      newErrors.lastReplacedDate = 'Das Datum des letzten Wechsels ist erforderlich.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!initialItem && saveToMaster) {
      const exists = masterOptions.some((m) => m.name.toLowerCase() === name.trim().toLowerCase());
      if (!exists) {
        onAddNewMasterOption({
          id: `master-${Date.now()}`,
          name: name.trim(),
          category,
          defaultCycleValue: cycleValue,
          defaultCycleUnit: cycleUnit,
          defaultLeadDays: purchaseLeadDays,
          defaultLocation: location.trim(),
          defaultSupplier: supplier.trim(),
          defaultMinStock: minStock.trim(),
          defaultMemo: memo.trim()
        });
      }
    }

    onSave({
      name: name.trim(),
      category,
      cycleValue: Number(cycleValue),
      cycleUnit,
      lastReplacedDate,
      purchaseLeadDays: Number(purchaseLeadDays) || 0,
      location: location.trim() || undefined,
      manager: manager.trim() || undefined,
      supplier: supplier.trim() || undefined,
      minStock: minStock.trim() || undefined,
      modelNumber: modelNumber.trim() || undefined,
      purchaseUrl: purchaseUrl.trim() || undefined,
      memo: memo.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Kopfbereich */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {initialItem ? 'Artikel / Prüfung bearbeiten' : 'Artikel oder Prüfung hinzufügen'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Zyklus und Vorlaufzeit für rechtzeitige Nachbestellung festlegen.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formularinhalt */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
          {/* Schnellauswahl (nur bei Neuanlage) */}
          {!initialItem && masterOptions.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Schnellauswahl (Klicken zum Übernehmen):
                </span>
                <button
                  type="button"
                  onClick={onOpenMasterManager}
                  className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  Verwalten
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-0.5">
                {masterOptions.slice(0, 10).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectMasterOption(opt)}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-100/60 active:scale-95 text-slate-700 font-semibold rounded-lg border border-blue-200/80 shadow-2xs transition truncate max-w-[200px]"
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Artikelname */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bezeichnung des Artikels / Prüfgegenstands <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Kopierpapier DIN A4, HEPA-Filter, Tonerkassette..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.name}</p>}
          </div>

          {/* Kategorie */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kategorie <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Zyklus */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wechselintervall <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={cycleValue}
                onChange={(e) => setCycleValue(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Zeiteinheit <span className="text-rose-500">*</span>
              </label>
              <select
                value={cycleUnit}
                onChange={(e) => setCycleUnit(e.target.value as CycleUnit)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-semibold cursor-pointer"
              >
                <option value="day">Tag(e)</option>
                <option value="week">Woche(n)</option>
                <option value="month">Monat(e)</option>
                <option value="year">Jahr(e)</option>
              </select>
            </div>
          </div>

          {/* Letzter Wechsel & Vorlaufzeit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Letzter Wechsel / Prüfung <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={lastReplacedDate}
                onChange={(e) => setLastReplacedDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lieferzeit / Vorlauf (Tage)
              </label>
              <input
                type="number"
                min="0"
                value={purchaseLeadDays}
                onChange={(e) => setPurchaseLeadDays(parseInt(e.target.value, 10) || 0)}
                placeholder="z.B. 5"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-bold"
              />
            </div>
          </div>

          {/* Berechnungsergebnis */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <span className="text-slate-500 block">Nächster Wechseltermin:</span>
              <span className="font-extrabold text-blue-900">{formatDateDisplay(calculatedNextDate)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Bestelltermin (Erinnerung):</span>
              <span className="font-bold text-sky-700">{formatDateDisplay(calculatedReminderDate)}</span>
            </div>
          </div>

          {/* Lagerort & Zuständiger */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Lagerort / Raum
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="z.B. Druckerraum EG, Regal A-1"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                Zuständig / Abteilung
              </label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="z.B. Verwaltung, IT, Hausmeister"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Lieferant & Mindestbestand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 text-slate-400" />
                Lieferant / Großhandel
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="z.B. Büromarkt24, Würth, Amazon"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Package className="w-3 h-3 text-slate-400" />
                Meldebestand / Mindestbestand
              </label>
              <input
                type="text"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="z.B. 2 Kartons, 1 Satz"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Modellnummer & URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Modell- / Artikelnummer
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="z.B. TK-5280, A4-80G"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bestell-Weblink (URL)
              </label>
              <input
                type="url"
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Notizen */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Arbeitshinweise & Notizen
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              placeholder="z.B. Nachbestellen sobald nur noch 2 Kartons übrig sind. Vor Feuchtigkeit schützen."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
            />
          </div>

          {/* Bibliothek-Speicheroption */}
          {!initialItem && (
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={saveToMaster}
                onChange={(e) => setSaveToMaster(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 w-4 h-4"
              />
              <span className="text-xs text-slate-600 font-medium">
                Auch in die Stammdaten-Bibliothek für spätere Wiederverwendung aufnehmen
              </span>
            </label>
          )}

          {/* Aktionsbuttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{initialItem ? 'Änderungen speichern' : 'Zur Liste hinzufügen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
