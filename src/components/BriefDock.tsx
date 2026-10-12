import React, { useState } from 'react';
import { AdCopyState, StylePresetId, BannerFontFamily } from '../types/banner';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { Sparkles, Globe, FileText, Palette, Type, RefreshCw, Wand2, ChevronRight, Check } from 'lucide-react';

interface Props {
  copyState: AdCopyState;
  onUpdateCopy: (updates: Partial<AdCopyState>) => void;
  onAnalyzeProduct: (url: string, description: string, stylePreset: StylePresetId) => Promise<void>;
  isAnalyzing: boolean;
  onLoadSample: (sampleId: string) => void;
}

export const BriefDock: React.FC<Props> = ({
  copyState,
  onUpdateCopy,
  onAnalyzeProduct,
  isAnalyzing,
  onLoadSample,
}) => {
  const [url, setUrl] = useState('https://aeropulse.audio/pro-anc');
  const [description, setDescription] = useState(
    'Next-generation wireless headphones with adaptive hybrid active noise cancellation, custom 40mm beryllium drivers, spatial audio tracking, and 45-hour battery life. Engineered for studio professionals and discerning audiophiles.'
  );
  const [selectedStyle, setSelectedStyle] = useState<StylePresetId>('clean-modern');
  const [selectedSampleId, setSelectedSampleId] = useState('headphones');

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    onLoadSample(sampleId);
    const sample = SAMPLE_PRODUCTS.find((p) => p.id === sampleId);
    if (sample) {
      setUrl(sample.url);
      setDescription(sample.description);
      setSelectedStyle(sample.stylePreset);
    }
  };

  const handleGenerateCopy = async () => {
    await onAnalyzeProduct(url, description, selectedStyle);
  };

  const fonts: { id: BannerFontFamily; label: string; sample: string }[] = [
    { id: 'outfit', label: 'Outfit (Modern Bold)', sample: 'Outfit' },
    { id: 'jakarta', label: 'Jakarta (Clean Tech)', sample: 'Jakarta' },
    { id: 'archivo', label: 'Archivo (High Impact)', sample: 'Archivo' },
    { id: 'playfair', label: 'Playfair (Luxury Serif)', sample: 'Playfair' },
    { id: 'cinzel', label: 'Cinzel (Editorial Royal)', sample: 'Cinzel' },
  ];

  return (
    <aside className="w-full lg:w-[400px] shrink-0 bg-slate-900/60 border-r border-slate-800 p-5 overflow-y-auto space-y-6">
      {/* 1-Click Samples Bar */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>1-Click Test Samples</span>
          </label>
          <span className="text-[11px] text-slate-400">Instant Demo</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              onClick={() => handleSelectSample(prod.id)}
              className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                selectedSampleId === prod.id
                  ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold truncate text-slate-200">{prod.name.split(' ')[0]}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{prod.tagline}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Brief Inputs */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Product Page URL</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourstore.com/products/item"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Product Description & USPs</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key selling points, specifications, discounts, target audience..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Style Preset Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Creative Aesthetic Style
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setSelectedStyle('clean-modern')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStyle === 'clean-modern'
                  ? 'border-indigo-500 bg-indigo-950/30 text-white'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-medium">Clean Modern</div>
              <div className="text-[10px] text-slate-400">Crisp & Balanced</div>
            </button>
            <button
              onClick={() => setSelectedStyle('bold-impact')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStyle === 'bold-impact'
                  ? 'border-indigo-500 bg-indigo-950/30 text-white'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-medium">Bold Impact</div>
              <div className="text-[10px] text-slate-400">High Contrast</div>
            </button>
            <button
              onClick={() => setSelectedStyle('minimal-luxury')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStyle === 'minimal-luxury'
                  ? 'border-indigo-500 bg-indigo-950/30 text-white'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-medium">Minimal Luxury</div>
              <div className="text-[10px] text-slate-400">Serif Elegance</div>
            </button>
            <button
              onClick={() => setSelectedStyle('direct-response')}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedStyle === 'direct-response'
                  ? 'border-indigo-500 bg-indigo-950/30 text-white'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-medium">Direct Response</div>
              <div className="text-[10px] text-slate-400">High Urgency</div>
            </button>
          </div>
        </div>

        {/* Generate AI Copy Button */}
        <button
          onClick={handleGenerateCopy}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Product with Gemini...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5 text-indigo-200" />
              <span>Generate AI Copy & Angles</span>
            </>
          )}
        </button>
      </div>

      {/* Copy Angle & Variants Control */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Active Banner Headline
            </label>
            <span className="text-[10px] text-slate-400">
              {copyState.headlineVariants.length} AI variants
            </span>
          </div>
          <input
            type="text"
            value={copyState.headline}
            onChange={(e) => onUpdateCopy({ headline: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
          {copyState.headlineVariants.length > 0 && (
            <div className="mt-1.5 space-y-1">
              {copyState.headlineVariants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => onUpdateCopy({ headline: variant })}
                  className={`w-full text-left text-[11px] p-1.5 rounded transition-colors truncate flex items-center justify-between ${
                    copyState.headline === variant
                      ? 'bg-indigo-950/60 text-indigo-300 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="truncate">{variant}</span>
                  {copyState.headline === variant && <Check className="w-3 h-3 text-indigo-400 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Subheadline / Supporting Text
          </label>
          <input
            type="text"
            value={copyState.subheadline}
            onChange={(e) => onUpdateCopy({ subheadline: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Call to Action
            </label>
            <input
              type="text"
              value={copyState.ctaText}
              onChange={(e) => onUpdateCopy({ ctaText: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
            {copyState.ctaVariants.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {copyState.ctaVariants.slice(0, 3).map((cta, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdateCopy({ ctaText: cta })}
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      copyState.ctaText === cta
                        ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cta}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Badge / Promo Tag
            </label>
            <input
              type="text"
              value={copyState.badgeText}
              onChange={(e) => onUpdateCopy({ badgeText: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Brand Styling & Colors */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Button Color</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={copyState.primaryColor}
                onChange={(e) => onUpdateCopy({ primaryColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 uppercase">
                {copyState.primaryColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Accent Color</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={copyState.accentColor}
                onChange={(e) => onUpdateCopy({ accentColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 uppercase">
                {copyState.accentColor}
              </span>
            </div>
          </div>
        </div>

        {/* Typography Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <span>Banner Headline Font</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => onUpdateCopy({ fontFamily: f.id })}
                className={`text-left px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  copyState.fontFamily === f.id
                    ? 'border-indigo-500 bg-indigo-950/40 text-white font-semibold'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{f.label}</span>
                {copyState.fontFamily === f.id && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
