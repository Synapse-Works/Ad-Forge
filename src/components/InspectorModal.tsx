import React, { useState } from 'react';
import {
  BannerPreset,
  BannerAdInstance,
  AdCopyState,
  ImageModelId,
  ImageResolution,
  ImageAspectRatio,
} from '../types/banner';
import { BannerCanvasRenderer } from './BannerCanvasRenderer';
import {
  X,
  Sparkles,
  Download,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RefreshCw,
  Sliders,
  Layers,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from 'lucide-react';

interface Props {
  preset: BannerPreset;
  banner: BannerAdInstance;
  copy: AdCopyState;
  onClose: () => void;
  onUpdateBanner: (presetId: string, updates: Partial<BannerAdInstance>) => void;
  onGenerateImage: (
    presetId: string,
    prompt: string,
    model: ImageModelId,
    aspectRatio: ImageAspectRatio,
    imageSize: ImageResolution
  ) => Promise<void>;
  isGeneratingImage: boolean;
  onDownload: (preset: BannerPreset, format: 'png' | 'jpeg') => void;
}

export const InspectorModal: React.FC<Props> = ({
  preset,
  banner,
  copy,
  onClose,
  onUpdateBanner,
  onGenerateImage,
  isGeneratingImage,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'ai_image'>('layers');
  const [prompt, setPrompt] = useState(
    copy.visualPrompts.square ||
      `Studio commercial photography of ${copy.productName}, clean minimalist background, commercial lighting, high quality advertising visual`
  );
  const [selectedModel, setSelectedModel] = useState<ImageModelId>(banner.model || 'gemini-3-pro-image-preview');
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(banner.imageSize || '1K');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<ImageAspectRatio>(banner.aspectRatio || preset.aspectRatio || '1:1');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // When switching presets or when prompt changes
  React.useEffect(() => {
    let defaultPrompt = copy.visualPrompts.square;
    if (preset.layoutType === 'wide-strip' || preset.layoutType === 'horizontal') {
      defaultPrompt = copy.visualPrompts.landscape;
    } else if (preset.layoutType === 'vertical' || preset.layoutType === 'tall-skyscraper') {
      defaultPrompt = copy.visualPrompts.portrait;
    }
    setPrompt(defaultPrompt);
    setSelectedAspectRatio(preset.aspectRatio || '1:1');
  }, [preset, copy]);

  const handleGenerate = async () => {
    setGenerationError(null);
    try {
      await onGenerateImage(
        preset.id,
        prompt,
        selectedModel,
        selectedAspectRatio,
        selectedResolution
      );
    } catch (err: any) {
      setGenerationError(err.message || 'Image generation failed');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateBanner(preset.id, {
            backgroundImageUrl: reader.result,
            aiRenderImageUrl: banner.mode === 'studio_ai' ? reader.result : undefined,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preview scale calculation to fit nicely in viewport
  const maxViewW = 600;
  const maxViewH = 450;
  let scale = 1;
  if (preset.width > maxViewW || preset.height > maxViewH) {
    scale = Math.min(maxViewW / preset.width, maxViewH / preset.height);
  }
  const previewW = Math.round(preset.width * scale);
  const previewH = Math.round(preset.height * scale);

  const aspectRatios: ImageAspectRatio[] = [
    '1:1',
    '2:3',
    '3:2',
    '3:4',
    '4:3',
    '9:16',
    '16:9',
    '21:9',
    '1:4',
    '4:1',
    '8:1',
  ];

  const resolutions: ImageResolution[] = ['1K', '2K', '4K'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-base font-mono tabular-nums">
              {preset.width} × {preset.height}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-semibold text-slate-200 text-sm">
              {preset.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
              {preset.category.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onDownload(preset, 'png')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG ({preset.width}×{preset.height})</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left preview canvas, Right controls dock */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Visual Preview Area */}
          <div className="flex-1 bg-[#050810] p-8 flex flex-col items-center justify-center overflow-auto border-b lg:border-b-0 lg:border-r border-slate-800">
            <div
              className="relative shadow-2xl rounded overflow-hidden border border-slate-800/80"
              style={{
                width: `${previewW}px`,
                height: `${previewH}px`,
              }}
            >
              <div
                style={{
                  width: `${preset.width}px`,
                  height: `${preset.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <BannerCanvasRenderer
                  preset={preset}
                  banner={banner}
                  copy={copy}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
              <span>Preview Scale: {Math.round(scale * 100)}%</span>
              <span>·</span>
              <span>Target Output: {preset.width} × {preset.height} px</span>
              <span>·</span>
              <span>Mode: {banner.mode === 'studio_ai' ? 'Pure Studio AI' : 'Layered Canvas'}</span>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="w-full lg:w-[440px] flex flex-col bg-slate-900 overflow-y-auto">
            {/* Mode & Tab Switcher */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Composition Mode
                </span>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => onUpdateBanner(preset.id, { mode: 'layered' })}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      banner.mode === 'layered'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Layered WYSIWYG
                  </button>
                  <button
                    onClick={() => onUpdateBanner(preset.id, { mode: 'studio_ai' })}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      banner.mode === 'studio_ai'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Studio AI Render
                  </button>
                </div>
              </div>

              {/* Sub-Tabs: Layers vs AI Generator */}
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab('layers')}
                  className={`flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'layers'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Text & Layers</span>
                </button>
                <button
                  onClick={() => setActiveTab('ai_image')}
                  className={`flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'ai_image'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Image Studio</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Text & Layers Controls */}
            {activeTab === 'layers' && (
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Custom Headline (For this size)
                  </label>
                  <textarea
                    rows={2}
                    value={banner.customHeadline !== undefined ? banner.customHeadline : copy.headline}
                    onChange={(e) => onUpdateBanner(preset.id, { customHeadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Custom Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={banner.customSubheadline !== undefined ? banner.customSubheadline : copy.subheadline}
                    onChange={(e) => onUpdateBanner(preset.id, { customSubheadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={banner.customCta !== undefined ? banner.customCta : copy.ctaText}
                      onChange={(e) => onUpdateBanner(preset.id, { customCta: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Badge Callout
                    </label>
                    <input
                      type="text"
                      value={banner.customBadge !== undefined ? banner.customBadge : copy.badgeText}
                      onChange={(e) => onUpdateBanner(preset.id, { customBadge: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Text Alignment
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateBanner(preset.id, { textAlignment: 'left' })}
                      className={`flex-1 flex items-center justify-center p-2 rounded-lg border text-xs ${
                        banner.textAlignment === 'left' || !banner.textAlignment
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <AlignLeft className="w-4 h-4 mr-1" /> Left
                    </button>
                    <button
                      onClick={() => onUpdateBanner(preset.id, { textAlignment: 'center' })}
                      className={`flex-1 flex items-center justify-center p-2 rounded-lg border text-xs ${
                        banner.textAlignment === 'center'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <AlignCenter className="w-4 h-4 mr-1" /> Center
                    </button>
                    <button
                      onClick={() => onUpdateBanner(preset.id, { textAlignment: 'right' })}
                      className={`flex-1 flex items-center justify-center p-2 rounded-lg border text-xs ${
                        banner.textAlignment === 'right'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <AlignRight className="w-4 h-4 mr-1" /> Right
                    </button>
                  </div>
                </div>

                {/* Scrim Darkness Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Background Scrim Darkness
                    </label>
                    <span className="text-xs font-mono text-slate-400">
                      {Math.round((banner.scrimOpacity !== undefined ? banner.scrimOpacity : 0.65) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={banner.scrimOpacity !== undefined ? banner.scrimOpacity : 0.65}
                    onChange={(e) =>
                      onUpdateBanner(preset.id, { scrimOpacity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Upload Custom Background File */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Upload Custom Background Image
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer text-xs text-slate-400 hover:text-white transition-colors bg-slate-950/40">
                    <Upload className="w-4 h-4" />
                    <span>Upload Local Image (PNG, JPG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Tab 2: AI Image Studio Controls */}
            {activeTab === 'ai_image' && (
              <div className="p-5 space-y-4 flex-1">
                {/* Model Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Gemini Image Generation Model</span>
                    <span className="text-[10px] text-indigo-400">Paid Key Configured</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedModel('gemini-3-pro-image-preview');
                        onUpdateBanner(preset.id, { model: 'gemini-3-pro-image-preview' });
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        selectedModel === 'gemini-3-pro-image-preview'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white">Gemini 3 Pro</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Studio-Quality Images</div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModel('gemini-nano-banana-2.1');
                        onUpdateBanner(preset.id, { model: 'gemini-nano-banana-2.1' });
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        selectedModel === 'gemini-nano-banana-2.1'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white">Nano Banana 2.1</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Fast General Cases</div>
                    </button>
                  </div>
                </div>

                {/* Resolution Selector: 1K, 2K, 4K */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Image Resolution (1K, 2K, 4K)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {resolutions.map((res) => (
                      <button
                        key={res}
                        onClick={() => {
                          setSelectedResolution(res);
                          onUpdateBanner(preset.id, { imageSize: res });
                        }}
                        className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                          selectedResolution === res
                            ? 'border-indigo-500 bg-indigo-600 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Aspect Ratio (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9...)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => {
                          setSelectedAspectRatio(ratio);
                          onUpdateBanner(preset.id, { aspectRatio: ratio });
                        }}
                        className={`py-1.5 rounded-md border text-xs font-mono font-medium transition-colors ${
                          selectedAspectRatio === ratio
                            ? 'border-indigo-500 bg-indigo-950 text-indigo-300 font-bold'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Advertising Image Prompt
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the product studio setting, background lighting, angle, mood..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Error Banner if any */}
                {generationError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{generationError}</span>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGeneratingImage}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating with {selectedModel === 'gemini-3-pro-image-preview' ? 'Gemini 3 Pro' : 'Nano Banana 2.1'}...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Generate {selectedResolution} Image ({selectedAspectRatio})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
