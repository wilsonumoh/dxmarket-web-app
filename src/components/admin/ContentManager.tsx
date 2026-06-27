import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Save, RefreshCw, Eye, ArrowRight, AlertCircle, Check, Image, Layout, HelpCircle
} from 'lucide-react';
import { SystemConfig } from '../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../../lib/firebaseClient';

interface ContentManagerProps {
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

// Some high-quality recommended image presets from Unsplash
const RECOMMENDED_PRESETS = [
  {
    name: 'Enterprise Logistics',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&h=480&q=80',
    description: 'Cargo vessel shipping & high-contrast containers.'
  },
  {
    name: 'Tech & Electronics Desk',
    url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&h=480&q=80',
    description: 'Clean workplace with workspace accessories.'
  },
  {
    name: 'Modern Industrial Warehouse',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&h=480&q=80',
    description: 'Futuristic distribution center and tracking logistics.'
  },
  {
    name: 'Global Trade Map',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=480&q=80',
    description: 'Network grids spanning across a holographic globe.'
  }
];

export default function ContentManager({
  systemConfig,
  setSystemConfig,
}: ContentManagerProps) {
  // Hero section editing state variables initialized from systemConfig
  const [heroTitle, setHeroTitle] = useState(systemConfig.heroConfig?.title || 'Enterprise Cross-Border Logistics');
  const [heroSubtitle, setHeroSubtitle] = useState(systemConfig.heroConfig?.subtitle || 'Ship products globally with real-time transit telemetry tracking.');
  const [heroImageUrl, setHeroImageUrl] = useState(systemConfig.heroConfig?.imageUrl || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&h=400&q=80');

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasHeroChanges, setHasHeroChanges] = useState(false);

  // Keep state in sync if parent config shifts
  useEffect(() => {
    if (systemConfig.heroConfig) {
      setHeroTitle(systemConfig.heroConfig.title || '');
      setHeroSubtitle(systemConfig.heroConfig.subtitle || '');
      setHeroImageUrl(systemConfig.heroConfig.imageUrl || '');
    }
  }, [systemConfig.heroConfig]);

  // Track if there are unsaved local modifications
  useEffect(() => {
    const originalTitle = systemConfig.heroConfig?.title || '';
    const originalSubtitle = systemConfig.heroConfig?.subtitle || '';
    const originalImageUrl = systemConfig.heroConfig?.imageUrl || '';
    
    setHasHeroChanges(
      heroTitle.trim() !== originalTitle ||
      heroSubtitle.trim() !== originalSubtitle ||
      heroImageUrl.trim() !== originalImageUrl
    );
  }, [heroTitle, heroSubtitle, heroImageUrl, systemConfig.heroConfig]);

  const handlePublishHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroTitle.trim() || !heroImageUrl.trim()) {
      setErrorMessage('Title and Image URL are required fields.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const docRef = doc(db, 'settings', 'systemConfig');
      const updatedHeroConfig = {
        title: heroTitle.trim(),
        subtitle: heroSubtitle.trim(),
        imageUrl: heroImageUrl.trim(),
      };

      // Perform actual Firestore document updates
      await updateDoc(docRef, { heroConfig: updatedHeroConfig });
      
      // Update the parent's shared application state
      setSystemConfig(prev => ({
        ...prev,
        heroConfig: updatedHeroConfig
      }));

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (error) {
      console.error('Error publishing hero config: ', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
      
      try {
        handleFirestoreError(error, OperationType.WRITE, 'settings/systemConfig');
      } catch (innerError) {
        // Fallback catch block
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setHeroTitle(systemConfig.heroConfig?.title || '');
    setHeroSubtitle(systemConfig.heroConfig?.subtitle || '');
    setHeroImageUrl(systemConfig.heroConfig?.imageUrl || '');
    setSaveStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="space-y-6" id="hero-content-manager">
      {/* Header Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-[#0F4C81] rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </span>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Homepage Hero Visual Content Manager</h2>
          </div>
          <p className="text-xs text-slate-500">
            Control the main marketing showcase on your platform. Update headings, subtext descriptions, and backdrop graphics dynamically in Firestore.
          </p>
        </div>

        {/* Sync / Save State Indicators */}
        <div className="flex items-center gap-3">
          {hasHeroChanges ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Hero Edits
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Synced with Live Firestore
            </span>
          )}

          <button
            type="button"
            onClick={handlePublishHero}
            disabled={isSaving || !hasHeroChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition duration-150 cursor-pointer ${
              hasHeroChanges 
                ? 'bg-[#0F4C81] hover:bg-[#1C5D94] text-white cursor-pointer' 
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Publishing...' : 'Publish Hero'}</span>
          </button>
        </div>
      </div>

      {/* Action Toast Notifications */}
      {saveStatus === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300" id="hero-save-success">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-emerald-900">Hero Configuration Published Successfully!</p>
            <p className="mt-0.5">The homepage showcase layout has been updated and persisted to your system settings document.</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 flex items-center gap-3 text-xs" id="hero-save-error">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-rose-900">Failed to Save Configuration</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Grid Workdesk Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#0F4C81] border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-blue-500" />
              Visual Presentation Fields
            </h3>

            <form onSubmit={handlePublishHero} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 block">Hero Title Header</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Cross-Border Trading & Cargo Hub"
                  value={heroTitle}
                  onChange={e => setHeroTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-slate-800"
                />
                <p className="text-[10px] text-gray-400">Large primary display text styled at the center of the homepage slider showcase.</p>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 block">Supporting Subtext / Paragraph</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Experience direct access to validated manufacturers with robust logistics fulfillment."
                  value={heroSubtitle}
                  onChange={e => setHeroSubtitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none leading-relaxed text-slate-800"
                />
                <p className="text-[10px] text-gray-400">A short supporting description or promotion details presented under the headline.</p>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 block">Custom Backdrop Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={heroImageUrl}
                  onChange={e => setHeroImageUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-[11px] focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <p className="text-[10px] text-gray-400">Provide an internet-accessible link for high-resolution graphics or background banners.</p>
              </div>

              {/* Recommended Presets */}
              <div className="space-y-2 pt-2">
                <span className="font-extrabold text-slate-600 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-blue-500" />
                  Recommended Imagery Backdrops
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {RECOMMENDED_PRESETS.map((preset) => {
                    const isSelected = heroImageUrl === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setHeroImageUrl(preset.url)}
                        className={`text-left p-2.5 rounded-lg border text-xs transition duration-150 flex items-start gap-2.5 group cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                          <img 
                            src={preset.url} 
                            alt={preset.name} 
                            className="w-full h-full object-cover transition duration-150 group-hover:scale-110" 
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate leading-snug">{preset.name}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">{preset.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save/Reset controls */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasHeroChanges}
                  className={`px-4 py-2 rounded-lg font-bold transition text-xs ${
                    hasHeroChanges
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Reset Edits
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !hasHeroChanges}
                  className={`px-4 py-2 rounded-lg font-bold transition text-xs flex items-center gap-1.5 shadow-sm ${
                    hasHeroChanges 
                      ? 'bg-[#0F4C81] hover:bg-[#1C5D94] text-white cursor-pointer' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Publish Hero Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Real-Time Live Visualizer Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-white sticky top-24">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#1E88E5]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">Live Visualizer Preview</span>
              </div>
              <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded font-mono">
                Interactive
              </span>
            </div>

            {/* Simulated Hero Carousel Slide display */}
            <p className="text-[10px] text-slate-400 font-bold mb-2">Simulated Homepage Showcase Slide:</p>
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-950 shadow-inner border border-slate-800 flex items-center">
              {/* Backing image */}
              {heroImageUrl ? (
                <img 
                  src={heroImageUrl} 
                  alt="Homepage Backdrop Graphic" 
                  className="absolute inset-0 w-full h-full object-cover object-center transition duration-500"
                  onError={(e) => {
                    // Fallback on visual loading error
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&h=400&q=80';
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-600 gap-1.5 text-xs font-mono">
                  <Image className="w-8 h-8 opacity-40 text-slate-500 animate-pulse" />
                  <span>No Backdrop Image Set</span>
                </div>
              )}
              
              {/* Dark shading layer for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent z-10" />

              {/* Text content presentation */}
              <div className="relative z-20 p-5 text-white space-y-2 max-w-xs text-left">
                <span className="inline-block bg-[#1E88E5] text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest mb-1 shadow-sm">
                  LIVE COMPILATION PREVIEW
                </span>
                <h1 className="text-sm md:text-base font-extrabold tracking-tight leading-snug line-clamp-2 text-white">
                  {heroTitle || 'Please Enter Title'}
                </h1>
                <p className="text-gray-300 text-[10px] leading-relaxed line-clamp-3">
                  {heroSubtitle || 'Please enter visual description subtext...'}
                </p>
                <div className="pt-2">
                  <button type="button" className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded-md text-[9px] flex items-center gap-1 cursor-default hover:bg-slate-100 transition shadow">
                    Explore Marketplace <ArrowRight className="w-3 h-3 text-[#1E88E5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Instruction Footer */}
            <div className="mt-4 flex gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950 text-[10px] text-slate-400 items-start">
              <AlertCircle className="w-4 h-4 text-[#1E88E5] flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-300">Staging Mode Active</p>
                <p>Edits are displayed live here. Real-time changes will only apply globally to Firestore and the portal landing page after publishing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
