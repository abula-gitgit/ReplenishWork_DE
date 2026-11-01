import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  Trash2, 
  Check, 
  RotateCcw, 
  Sliders, 
  Search,
  Tag
} from 'lucide-react';
import { 
  MasterOption, 
  Category, 
  CATEGORIES, 
  DEFAULT_CATEGORIES, 
  CycleUnit, 
  ConsumableItem 
} from '../types/consumable';
import { DEFAULT_MASTER_OPTIONS } from '../utils/masterOptions';
import { formatCycleDisplay } from '../utils/dateCalc';
import { getCategoryStyle } from '../utils/categoryColors';

interface MasterOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: MasterOption[];
  onUpdateOptions: (newOptions: MasterOption[]) => void;
  categories?: string[];
  onUpdateCategories?: (newCategories: string[]) => void;
  items?: ConsumableItem[];
  onUpdateItems?: (newItems: ConsumableItem[]) => void;
}

export const MasterOptionModal: React.FC<MasterOptionModalProps> = ({
  isOpen,
  onClose,
  options,
  onUpdateOptions,
  categories = CATEGORIES,
  onUpdateCategories,
  items = [],
  onUpdateItems
}) => {
  const [activeTab, setActiveTab] = useState<'options' | 'categories'>('options');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const listContainerRef = useRef<HTMLDivElement>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(categories[0] || 'Bürobedarf & Schreibwaren');
  const [newCycleValue, setNewCycleValue] = useState<number>(1);
  const [newCycleUnit, setNewCycleUnit] = useState<CycleUnit>('month');
  const [newLeadDays, setNewLeadDays] = useState<number>(5);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<Category>(categories[0] || 'Bürobedarf & Schreibwaren');
  const [editCycleValue, setEditCycleValue] = useState<number>(1);
  const [editCycleUnit, setEditCycleUnit] = useState<CycleUnit>('month');
  const [editLeadDays, setEditLeadDays] = useState<number>(5);

  // Kategorien
  const [newCatName, setNewCatName] = useState('');
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState('');

  if (!isOpen) return null;

  const filteredOptions = options.filter((opt) => {
    const matchesSearch = opt.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || opt.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewName('');
    setNewCategory(selectedCategory !== 'all' ? selectedCategory : categories[0] || 'Bürobedarf & Schreibwaren');
    setNewCycleValue(1);
    setNewCycleUnit('month');
    setNewLeadDays(5);
  };

  const handleSaveAdd = () => {
    if (!newName.trim()) return;
    const newOpt: MasterOption = {
      id: `master-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      defaultCycleValue: newCycleValue,
      defaultCycleUnit: newCycleUnit,
      defaultLeadDays: newLeadDays
    };
    onUpdateOptions([...options, newOpt]);
    setIsAdding(false);
  };

  const handleStartEdit = (opt: MasterOption) => {
    setEditingId(opt.id);
    setEditName(opt.name);
    setEditCategory(opt.category);
    setEditCycleValue(opt.defaultCycleValue || 1);
    setEditCycleUnit(opt.defaultCycleUnit || 'month');
    setEditLeadDays(opt.defaultLeadDays || 5);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    const updated = options.map((opt) => {
      if (opt.id === editingId) {
        return {
          ...opt,
          name: editName.trim(),
          category: editCategory,
          defaultCycleValue: editCycleValue,
          defaultCycleUnit: editCycleUnit,
          defaultLeadDays: editLeadDays
        };
      }
      return opt;
    });
    onUpdateOptions(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onUpdateOptions(options.filter((opt) => opt.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= options.length) return;
    const newOptions = [...options];
    const temp = newOptions[index];
    newOptions[index] = newOptions[targetIndex];
    newOptions[targetIndex] = temp;
    onUpdateOptions(newOptions);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Möchten Sie die Vorlagenliste auf den Auslieferungszustand zurücksetzen?')) {
      onUpdateOptions([...DEFAULT_MASTER_OPTIONS]);
    }
  };

  // Kategorien verwalten
  const handleAddCategory = () => {
    if (!newCatName.trim() || !onUpdateCategories) return;
    const trimmed = newCatName.trim();
    if (!categories.includes(trimmed)) {
      onUpdateCategories([...categories, trimmed]);
      setNewCatName('');
    }
  };

  const handleSaveEditCategory = (index: number) => {
    if (!editCatName.trim() || !onUpdateCategories) return;
    const oldCat = categories[index];
    const newCat = editCatName.trim();
    if (oldCat === newCat) {
      setEditingCatIndex(null);
      return;
    }
    const updatedCategories = [...categories];
    updatedCategories[index] = newCat;
    onUpdateCategories(updatedCategories);

    // Kategoriereferenzen in Artikeln und Optionen aktualisieren
    if (onUpdateItems && items.length > 0) {
      const updatedItems = items.map((it) => (it.category === oldCat ? { ...it, category: newCat } : it));
      onUpdateItems(updatedItems);
    }
    const updatedOptions = options.map((opt) => (opt.category === oldCat ? { ...opt, category: newCat } : opt));
    onUpdateOptions(updatedOptions);

    setEditingCatIndex(null);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (!onUpdateCategories) return;
    if (categories.length <= 1) {
      alert('Mindestens eine Kategorie muss erhalten bleiben.');
      return;
    }
    if (window.confirm(`Kategorie "${catToDelete}" wirklich löschen?`)) {
      const fallbackCat = categories.find((c) => c !== catToDelete) || 'Sonstige Betriebsverbrauchsgüter';
      const updatedCategories = categories.filter((c) => c !== catToDelete);
      onUpdateCategories(updatedCategories);

      if (onUpdateItems && items.length > 0) {
        const updatedItems = items.map((it) => (it.category === catToDelete ? { ...it, category: fallbackCat } : it));
        onUpdateItems(updatedItems);
      }
      const updatedOptions = options.map((opt) => (opt.category === catToDelete ? { ...opt, category: fallbackCat } : opt));
      onUpdateOptions(updatedOptions);
    }
  };

  const handleResetCategories = () => {
    if (!onUpdateCategories) return;
    if (window.confirm('Kategorien auf Standardwerte zurücksetzen?')) {
      onUpdateCategories([...DEFAULT_CATEGORIES]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Kopfbereich */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Stammdaten & Kategorien
              </h2>
              <p className="text-xs text-slate-500">
                Wiederverwendbare Vorlagen und eigene Branchenkategorien anpassen.
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

        {/* Tab-Umschaltung */}
        <div className="flex border-b border-slate-100 shrink-0 gap-4 mt-3">
          <button
            type="button"
            onClick={() => setActiveTab('options')}
            className={`pb-2.5 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'options'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Artikel-Vorlagen ({options.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`pb-2.5 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Kategorien ({categories.length})</span>
          </button>
        </div>

        {/* Tab 1: Artikel-Vorlagen */}
        {activeTab === 'options' && (
          <div className="flex-1 flex flex-col overflow-hidden pt-4">
            {/* Filter- und Suchleiste */}
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Vorlagen durchsuchen..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="all">Alle Kategorien</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleStartAdd}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Neu</span>
              </button>
            </div>

            {/* Neues Element anlegen */}
            {isAdding && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl mb-3 space-y-2 shrink-0 animate-in fade-in duration-100">
                <div className="text-xs font-bold text-blue-900">Neue Vorlage erfassen</div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Bezeichnung (z.B. Kopierpapier DIN A4)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  autoFocus
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="text-xs px-2.5 py-1.5 bg-white border border-blue-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="1"
                      value={newCycleValue}
                      onChange={(e) => setNewCycleValue(parseInt(e.target.value, 10) || 1)}
                      className="w-16 px-2 py-1.5 text-xs bg-white border border-blue-200 rounded-xl font-bold"
                    />
                    <select
                      value={newCycleUnit}
                      onChange={(e) => setNewCycleUnit(e.target.value as CycleUnit)}
                      className="flex-1 text-xs px-2 py-1.5 bg-white border border-blue-200 rounded-xl"
                    >
                      <option value="day">Tag(e)</option>
                      <option value="week">Woche(n)</option>
                      <option value="month">Monat(e)</option>
                      <option value="year">Jahr(e)</option>
                    </select>
                  </div>

                  <input
                    type="number"
                    min="0"
                    value={newLeadDays}
                    onChange={(e) => setNewLeadDays(parseInt(e.target.value, 10) || 0)}
                    placeholder="Vorlaufzeit (Tage)"
                    className="text-xs px-2.5 py-1.5 bg-white border border-blue-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAdd}
                    className="px-3.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            )}

            {/* Vorlagenliste */}
            <div ref={listContainerRef} className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Keine Vorlagen gefunden.
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isEditing = editingId === opt.id;
                  const catStyle = getCategoryStyle(opt.category);

                  if (isEditing) {
                    return (
                      <div key={opt.id} className="p-3 bg-slate-50 border border-slate-300 rounded-2xl space-y-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value as Category)}
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              min="1"
                              value={editCycleValue}
                              onChange={(e) => setEditCycleValue(parseInt(e.target.value, 10) || 1)}
                              className="w-16 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                            />
                            <select
                              value={editCycleUnit}
                              onChange={(e) => setEditCycleUnit(e.target.value as CycleUnit)}
                              className="flex-1 text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-xl"
                            >
                              <option value="day">Tag(e)</option>
                              <option value="week">Woche(n)</option>
                              <option value="month">Monat(e)</option>
                              <option value="year">Jahr(e)</option>
                            </select>
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={editLeadDays}
                            onChange={(e) => setEditLeadDays(parseInt(e.target.value, 10) || 0)}
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-xs text-slate-500 font-semibold"
                          >
                            Abbrechen
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                          >
                            Aktualisieren
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={opt.id}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-2 text-xs transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 truncate">{opt.name}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded-md font-semibold ${catStyle.badgeBg}`}>
                            {opt.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex gap-2">
                          <span>Intervall: {formatCycleDisplay(opt.defaultCycleValue || 1, opt.defaultCycleUnit || 'month')}</span>
                          {opt.defaultLeadDays !== undefined && (
                            <span>• Vorlauf: {opt.defaultLeadDays} T.</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Nach oben"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === options.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Nach unten"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(opt)}
                          className="p-1 text-slate-400 hover:text-blue-600"
                          title="Bearbeiten"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(opt.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Auf Werkseinstellungen zurücksetzen</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Fertig
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Kategorien */}
        {activeTab === 'categories' && (
          <div className="flex-1 flex flex-col overflow-hidden pt-4">
            {/* Neue Kategorie hinzufügen */}
            <div className="flex gap-2 mb-3 shrink-0">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Neue Kategoriebezeichnung..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Hinzufügen</span>
              </button>
            </div>

            {/* Kategorienliste */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {categories.map((cat, idx) => {
                const isEditing = editingCatIndex === idx;
                const catStyle = getCategoryStyle(cat);

                if (isEditing) {
                  return (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl flex gap-2">
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="flex-1 px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditCategory(idx)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatIndex(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${catStyle.badgeBg}`}>
                        {cat}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatIndex(idx);
                          setEditCatName(cat);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600"
                        title="Umbenennen"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={handleResetCategories}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kategorien zurücksetzen</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Fertig
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
