import React, { useState, useEffect } from 'react';
import { 
  Menu, Plus, Trash2, Edit2, MoveUp, MoveDown, Save, RefreshCw, 
  Check, X, Eye, AlertCircle, ArrowRight, ExternalLink, Link2
} from 'lucide-react';
import { SystemConfig } from '../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../../lib/firebaseClient';

interface MenuManagerProps {
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export default function MenuManager({
  systemConfig,
  setSystemConfig,
}: MenuManagerProps) {
  // Local state for editing to prevent immediate unsaved database writes
  const [localMenu, setLocalMenu] = useState<{ label: string; view: string }[]>([...systemConfig.appMenu]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [label, setLabel] = useState('');
  const [viewType, setViewType] = useState('preset'); // 'preset' or 'custom'
  const [presetView, setPresetView] = useState('products');
  const [customView, setCustomView] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Preset Views description mapping
  const presetViewsList = [
    { value: 'products', label: 'Catalog Products (products)' },
    { value: 'categories', label: 'All Categories Page (categories)' },
    { value: 'merchant-stores', label: 'Store Directory (merchant-stores)' },
    { value: 'blog', label: 'Market Blogs (blog)' },
    { value: 'faq', label: 'FAQs Helpdesk (faq)' },
    { value: 'contact', label: 'Contact Support (contact)' },
    { value: 'about', label: 'About Us / Story (about)' },
  ];

  // Sync with prop when parent config changes
  useEffect(() => {
    setLocalMenu([...systemConfig.appMenu]);
  }, [systemConfig.appMenu]);

  // Track if there are unsaved local edits for menu
  useEffect(() => {
    const isDifferent = JSON.stringify(localMenu) !== JSON.stringify(systemConfig.appMenu);
    setHasChanges(isDifferent);
  }, [localMenu, systemConfig.appMenu]);

  // Save changes to Firestore
  const handlePublishMenu = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const docRef = doc(db, 'settings', 'systemConfig');
      const updatedConfig = {
        ...systemConfig,
        appMenu: localMenu,
      };

      await updateDoc(docRef, { appMenu: localMenu });
      
      // Update global parent states
      setSystemConfig(updatedConfig);
      setSaveStatus('success');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (error) {
      console.error('Error publishing menu: ', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
      
      try {
        handleFirestoreError(error, OperationType.WRITE, 'settings/systemConfig');
      } catch (innerError) {
        // Fallback
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Create or Update item
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const finalView = viewType === 'preset' ? presetView : customView.trim();
    if (!finalView) {
      alert('Please specify a valid view or destination URL.');
      return;
    }

    const newItem = {
      label: label.trim(),
      view: finalView,
    };

    if (editingIndex !== null) {
      // Update existing
      const updatedMenu = [...localMenu];
      updatedMenu[editingIndex] = newItem;
      setLocalMenu(updatedMenu);
      setEditingIndex(null);
    } else {
      // Add new
      // Check for duplicate labels
      if (localMenu.some(item => item.label.toLowerCase() === label.trim().toLowerCase())) {
        alert('A menu item with this label already exists.');
        return;
      }
      setLocalMenu([...localMenu, newItem]);
    }

    // Reset Form
    setLabel('');
    setCustomView('');
    setViewType('preset');
    setPresetView('products');
  };

  const handleStartEdit = (index: number) => {
    const item = localMenu[index];
    setLabel(item.label);
    
    const isPreset = presetViewsList.some(p => p.value === item.view);
    if (isPreset) {
      setViewType('preset');
      setPresetView(item.view);
    } else {
      setViewType('custom');
      setCustomView(item.view);
    }
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setLabel('');
    setCustomView('');
    setViewType('preset');
    setPresetView('products');
  };

  const handleRemoveItem = (index: number) => {
    if (confirm(`Are you sure you want to delete the "${localMenu[index].label}" menu link?`)) {
      setLocalMenu(localMenu.filter((_, idx) => idx !== index));
      if (editingIndex === index) {
        handleCancelEdit();
      }
    }
  };

  // Re-ordering links
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === localMenu.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedMenu = [...localMenu];
    const temp = updatedMenu[index];
    updatedMenu[index] = updatedMenu[targetIndex];
    updatedMenu[targetIndex] = temp;
    setLocalMenu(updatedMenu);

    if (editingIndex === index) {
      setEditingIndex(targetIndex);
    } else if (editingIndex === targetIndex) {
      setEditingIndex(index);
    }
  };

  const isExternalUrl = (path: string) => {
    return path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/');
  };

  return (
    <div className="space-y-6" id="menu-manager-workspace">
      {/* CMS Header Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-[#0F4C81] rounded-lg">
              <Menu className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Navigation Menu Manager</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Build, edit, reorder, and maintain primary navigation header links and custom target destination URLs globally.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {hasChanges ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Menu Changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Synced with Live Firestore
            </span>
          )}

          <button
            onClick={handlePublishMenu}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition duration-150 cursor-pointer ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Publishing...' : 'Publish Menu'}</span>
          </button>
        </div>
      </div>

      {/* Action Toast Notifications */}
      {saveStatus === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300" id="menu-save-success">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-emerald-900">Navigation Menu Successfully Published!</p>
            <p className="mt-0.5">The app headers and navigation menus have been updated instantly in Firestore.</p>
          </div>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300" id="menu-save-error">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-rose-900">Publish to Firestore Failed</p>
            <p className="mt-0.5 font-mono text-[10px] bg-white/60 p-1.5 rounded border border-rose-100 overflow-x-auto">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Grid Work Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: CRUD Builder & Current Menu List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Builder Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#0F4C81] border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" />
              {editingIndex !== null ? `Modify Link: "${localMenu[editingIndex].label}"` : 'Create Navigation Link'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Link Label Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Promo Deals, Support Center"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-400">The human-friendly text displayed in the header bar.</p>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700 font-sans">Destination Target Type</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                    <button
                      type="button"
                      onClick={() => setViewType('preset')}
                      className={`flex-1 py-1.5 rounded font-bold text-center transition ${viewType === 'preset' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Preset View
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewType('custom')}
                      className={`flex-1 py-1.5 rounded font-bold text-center transition ${viewType === 'custom' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Custom URL/View
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">Select standard marketplace sections or custom urls.</p>
                </div>
              </div>

              {viewType === 'preset' ? (
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Select Preset Destination</label>
                  <select
                    value={presetView}
                    onChange={e => setPresetView(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    {presetViewsList.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Enter Custom Path / URL</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. /custom-promos, https://partner-site.com"
                      value={customView}
                      onChange={e => setCustomView(e.target.value)}
                      className="w-full p-2.5 pl-9 border border-slate-200 rounded-lg font-mono text-[11px] outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">Accepts relative routing endpoints or fully qualified external URLs starting with http:// or https://.</p>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold transition cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#0F4C81] hover:bg-[#1C5D94] text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingIndex !== null ? 'Save Changes' : 'Add Link to Menu'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current table of items */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-sm text-slate-800">Current Navigation Links ({localMenu.length})</h3>
              <span className="text-[10px] text-slate-400 italic font-medium">Reorder inline or use actions</span>
            </div>

            {localMenu.length === 0 ? (
              <div className="border border-dashed p-10 text-center text-xs text-gray-400 rounded-xl bg-slate-50/50">
                <Menu className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                <p>No custom menu items defined. Create your first link above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                      <th className="py-3 px-4 w-12 text-center">Pos</th>
                      <th className="py-3 px-4">Link Label</th>
                      <th className="py-3 px-4">Destination Target</th>
                      <th className="py-3 px-3 w-20 text-center">Type</th>
                      <th className="py-3 px-4 w-40 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {localMenu.map((item, idx) => {
                      const isExternal = isExternalUrl(item.view);
                      const isPreset = presetViewsList.some(p => p.value === item.view);
                      
                      return (
                        <tr 
                          key={idx} 
                          className={`transition-colors ${
                            editingIndex === idx 
                              ? 'bg-blue-50/50 hover:bg-blue-50' 
                              : 'hover:bg-slate-50/80 bg-white'
                          }`}
                        >
                          {/* Position index & Reorder */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-400 text-center">
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                {idx + 1}
                              </span>
                            </div>
                          </td>

                          {/* Link Label */}
                          <td className="py-3 px-4 font-extrabold text-slate-800">
                            <span className="flex items-center gap-1.5">
                              {item.label}
                              {isExternal && <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                            </span>
                          </td>

                          {/* Destination Target */}
                          <td className="py-3 px-4 max-w-xs truncate font-mono text-[11px] text-gray-500">
                            <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-700 font-medium tracking-tight">
                              {item.view}
                            </span>
                          </td>

                          {/* Type */}
                          <td className="py-3 px-3 text-center">
                            {isPreset ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-[#0F4C81] border border-blue-100">
                                Preset
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                                Custom
                              </span>
                            )}
                          </td>

                          {/* Actions (Reorder and CRUD buttons) */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {/* Move Up */}
                              <button
                                type="button"
                                onClick={() => moveItem(idx, 'up')}
                                disabled={idx === 0}
                                className={`p-1 rounded transition ${
                                  idx === 0 
                                    ? 'text-slate-200 cursor-not-allowed' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                                title="Move Up"
                              >
                                <MoveUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Move Down */}
                              <button
                                type="button"
                                onClick={() => moveItem(idx, 'down')}
                                disabled={idx === localMenu.length - 1}
                                className={`p-1 rounded transition ${
                                  idx === localMenu.length - 1 
                                    ? 'text-slate-200 cursor-not-allowed' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                                title="Move Down"
                              >
                                <MoveDown className="w-3.5 h-3.5" />
                              </button>

                              <span className="w-[1px] h-3 bg-slate-200 mx-1" />

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleStartEdit(idx)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-white sticky top-24">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-sans">Live Header Preview</span>
              </div>
              <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded font-mono">
                Interactive
              </span>
            </div>

            {/* Simulated Desktop Subheader Bar */}
            <p className="text-[10px] text-slate-400 font-bold mt-4 mb-2">Simulated Desktop Menu bar:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-between text-slate-800 text-[10px] font-semibold shadow-inner">
              <div className="flex items-center gap-3 py-1 px-2">
                <span className="text-slate-800 font-extrabold flex items-center gap-1">
                  <Menu className="w-3.5 h-3.5 text-slate-700" /> All Categories
                </span>
                
                {/* Simulated links */}
                <div className="flex flex-wrap gap-3.5 border-l border-slate-200 pl-3">
                  {localMenu.slice(0, 4).map((item, idx) => (
                    <span 
                      key={idx} 
                      className="text-gray-600 hover:text-[#0F4C81] transition cursor-pointer font-bold flex items-center gap-0.5 border-b-2 border-transparent hover:border-[#0F4C81] py-0.5"
                    >
                      {item.label}
                      {isExternalUrl(item.view) && <ExternalLink className="w-2.5 h-2.5 text-gray-400" />}
                    </span>
                  ))}
                  {localMenu.length > 4 && (
                    <span className="text-[#0F4C81] font-black underline cursor-pointer text-[9px]">
                      +{localMenu.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated Mobile Dropdown Menu Drawer */}
            <p className="text-[10px] text-slate-400 font-bold mt-6 mb-2">Simulated Mobile Drawer Layout:</p>
            <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col text-[11px] text-slate-300">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center font-bold">
                <span>Navigation Menu Drawer</span>
                <X className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="p-4 space-y-2">
                {localMenu.length === 0 ? (
                  <p className="text-center text-slate-600 py-4 italic">No navigation links configured</p>
                ) : (
                  localMenu.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/60 hover:bg-slate-850 transition cursor-pointer"
                    >
                      <span className="font-extrabold text-white flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-[#1E88E5]" />
                        {item.label}
                      </span>
                      <span className="text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 truncate max-w-[120px]">
                        {item.view}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-1.5 p-3 rounded-lg border border-slate-800 bg-slate-950 text-[10px] text-slate-400 items-start">
              <AlertCircle className="w-4 h-4 text-[#1E88E5] flex-shrink-0" />
              <span>
                Verify that labels fit within the horizontal constraints. Staging edits are purely client-side until you click <strong>"Publish Menu"</strong> at the top.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
