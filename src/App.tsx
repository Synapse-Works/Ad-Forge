import { useState } from 'react';
import { BANNER_PRESETS } from './data/bannerPresets';
import { SAMPLE_PRODUCTS } from './data/sampleProducts';
import {
  BannerCategory,
  BannerAdInstance,
  AdCopyState,
  BannerPreset,
  ImageModelId,
  ImageResolution,
  ImageAspectRatio,
  StylePresetId,
} from './types/banner';
import { Header } from './components/Header';
import { BriefDock } from './components/BriefDock';
import { BannerCard } from './components/BannerCard';
import { InspectorModal } from './components/InspectorModal';
import { BatchExportModal } from './components/BatchExportModal';
import { downloadBanner, downloadAllBannersZip } from './utils/canvasExporter';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const defaultSample = SAMPLE_PRODUCTS[0];

  // Global ad copy & strategist state
  const [copyState, setCopyState] = useState<AdCopyState>({
    productName: defaultSample.name,
    headline: defaultSample.headline,
    subheadline: defaultSample.subheadline,
    ctaText: defaultSample.ctaText,
    badgeText: defaultSample.badgeText,
    brandName: 'AEROPULSE',
    primaryColor: defaultSample.primaryColor,
    accentColor: defaultSample.accentColor,
    fontFamily: defaultSample.fontFamily,
    headlineVariants: defaultSample.headlineVariants,
    subheadlineVariants: defaultSample.subheadlineVariants,
    ctaVariants: defaultSample.ctaVariants,
    badgeVariants: defaultSample.badgeVariants,
    visualPrompts: defaultSample.visualPrompts,
  });

  // Per-banner instances state
  const [banners, setBanners] = useState<Record<string, BannerAdInstance>>(() => {
    const initial: Record<string, BannerAdInstance> = {};
    BANNER_PRESETS.forEach((preset) => {
      initial[preset.id] = {
        presetId: preset.id,
        mode: 'layered',
        backgroundImageUrl: defaultSample.defaultBgImage,
        aspectRatio: preset.aspectRatio,
        imageSize: '1K',
        model: 'gemini-3-pro-image-preview',
        scrimOpacity: 0.65,
        textAlignment: 'left',
        buttonStyle: 'rounded',
      };
    });
    return initial;
  });

  const [activeCategory, setActiveCategory] = useState<BannerCategory>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Batch export progress state
  const [batchModal, setBatchModal] = useState({
    isOpen: false,
    current: 0,
    total: 0,
    isComplete: false,
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Update copy state
  const handleUpdateCopy = (updates: Partial<AdCopyState>) => {
    setCopyState((prev) => ({ ...prev, ...updates }));
  };

  // Update specific banner instance
  const handleUpdateBanner = (presetId: string, updates: Partial<BannerAdInstance>) => {
    setBanners((prev) => ({
      ...prev,
      [presetId]: {
        ...prev[presetId],
        ...updates,
      },
    }));
  };

  // Load sample product
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PRODUCTS.find((p) => p.id === sampleId);
    if (!sample) return;

    setCopyState({
      productName: sample.name,
      headline: sample.headline,
      subheadline: sample.subheadline,
      ctaText: sample.ctaText,
      badgeText: sample.badgeText,
      brandName: sample.name.split(' ')[0].toUpperCase(),
      primaryColor: sample.primaryColor,
      accentColor: sample.accentColor,
      fontFamily: sample.fontFamily,
      headlineVariants: sample.headlineVariants,
      subheadlineVariants: sample.subheadlineVariants,
      ctaVariants: sample.ctaVariants,
      badgeVariants: sample.badgeVariants,
      visualPrompts: sample.visualPrompts,
    });

    // Update all banner backgrounds with sample default asset
    setBanners((prev) => {
      const next = { ...prev };
      BANNER_PRESETS.forEach((preset) => {
        if (next[preset.id]) {
          next[preset.id] = {
            ...next[preset.id],
            backgroundImageUrl: sample.defaultBgImage,
            customHeadline: undefined,
            customSubheadline: undefined,
            customCta: undefined,
            customBadge: undefined,
          };
        }
      });
      return next;
    });

    showToast(`Loaded "${sample.name}" preset with complete copy angles.`);
  };

  // Call Server Gemini copy analysis endpoint
  const handleAnalyzeProduct = async (url: string, description: string, stylePreset: StylePresetId) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, description, stylePreset }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze product with Gemini');
      }

      const data = await response.json();

      setCopyState((prev) => ({
        ...prev,
        productName: data.productName || prev.productName,
        headline: data.headlines?.[0] || prev.headline,
        subheadline: data.subheadlines?.[0] || prev.subheadline,
        ctaText: data.ctaOptions?.[0] || prev.ctaText,
        badgeText: data.badgeTexts?.[0] || prev.badgeText,
        brandName: (data.productName || prev.productName).split(' ')[0].toUpperCase(),
        primaryColor: data.brandColors?.primary || prev.primaryColor,
        accentColor: data.brandColors?.accent || prev.accentColor,
        headlineVariants: data.headlines || prev.headlineVariants,
        subheadlineVariants: data.subheadlines || prev.subheadlineVariants,
        ctaVariants: data.ctaOptions || prev.ctaVariants,
        badgeVariants: data.badgeTexts || prev.badgeVariants,
        visualPrompts: data.visualPrompts || prev.visualPrompts,
      }));

      showToast('AI Strategy & Copy generated! 3 headline angles and visual prompts ready.');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error connecting to Gemini API', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Call Server Gemini image generation endpoint
  const handleGenerateImage = async (
    presetId: string,
    prompt: string,
    model: ImageModelId,
    aspectRatio: ImageAspectRatio,
    imageSize: ImageResolution
  ) => {
    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-banner-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          aspectRatio,
          imageSize,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate image with Gemini');
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error('No image returned by server');
      }

      // Update banner with generated image
      handleUpdateBanner(presetId, {
        backgroundImageUrl: data.imageUrl,
        aiRenderImageUrl: data.imageUrl,
        aspectRatio: data.aspectRatio || aspectRatio,
        imageSize: data.imageSize || imageSize,
        model: data.model || model,
      });

      showToast(`Generated ${imageSize} resolution image with ${model === 'gemini-3-pro-image-preview' ? 'Gemini 3 Pro' : 'Nano Banana 2.1'}!`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to generate image', 'error');
      throw err;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Download individual banner
  const handleDownloadSingle = async (preset: BannerPreset, format: 'png' | 'jpeg') => {
    const banner = banners[preset.id];
    if (!banner) return;
    try {
      await downloadBanner({ preset, banner, copy: copyState }, format);
      showToast(`Downloaded ${preset.width}×${preset.height} (${format.toUpperCase()})`);
    } catch (err) {
      console.error(err);
      showToast('Download failed. Check image cross-origin permissions.', 'error');
    }
  };

  // Batch Export full ZIP
  const handleBatchExport = async () => {
    const filteredPresets = BANNER_PRESETS.filter(
      (p) => activeCategory === 'all' || p.category === activeCategory
    );

    setBatchModal({
      isOpen: true,
      current: 0,
      total: filteredPresets.length,
      isComplete: false,
    });

    try {
      await downloadAllBannersZip(
        filteredPresets,
        banners,
        copyState,
        (current, total) => {
          setBatchModal((prev) => ({ ...prev, current, total }));
        }
      );
      setBatchModal((prev) => ({ ...prev, isComplete: true }));
      showToast('Batch export complete! ZIP bundle downloaded.');
    } catch (err) {
      console.error(err);
      setBatchModal((prev) => ({ ...prev, isOpen: false }));
      showToast('Batch export encountered an error.', 'error');
    }
  };

  const filteredPresets = BANNER_PRESETS.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const selectedPreset = selectedPresetId
    ? BANNER_PRESETS.find((p) => p.id === selectedPresetId)
    : null;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs text-white animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onBatchExport={handleBatchExport}
        isExporting={batchModal.isOpen && !batchModal.isComplete}
        totalBannersCount={BANNER_PRESETS.length}
      />

      {/* Main Workspace: Brief Sidebar + Banner Gallery */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Brief Configuration Dock */}
        <BriefDock
          copyState={copyState}
          onUpdateCopy={handleUpdateCopy}
          onAnalyzeProduct={handleAnalyzeProduct}
          isAnalyzing={isAnalyzing}
          onLoadSample={handleLoadSample}
        />

        {/* Right Banner Staging Gallery */}
        <main className="flex-1 bg-[#070b12] p-6 overflow-y-auto">
          {/* Gallery Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Standard Banner Formats
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {filteredPresets.length} sizes active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pixel-perfect ad layouts with dual-mode composition (editable layers & studio AI renders). Click any banner to customize.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                All formats comply with IAB & social media advertising display standards
              </span>
            </div>
          </div>

          {/* Banner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPresets.map((preset) => {
              const banner = banners[preset.id];
              if (!banner) return null;
              return (
                <BannerCard
                  key={preset.id}
                  preset={preset}
                  banner={banner}
                  copy={copyState}
                  onOpenInspector={(id) => setSelectedPresetId(id)}
                  onDownload={handleDownloadSingle}
                />
              );
            })}
          </div>
        </main>
      </div>

      {/* Focused Inspector & AI Studio Modal */}
      {selectedPreset && banners[selectedPreset.id] && (
        <InspectorModal
          preset={selectedPreset}
          banner={banners[selectedPreset.id]}
          copy={copyState}
          onClose={() => setSelectedPresetId(null)}
          onUpdateBanner={handleUpdateBanner}
          onGenerateImage={handleGenerateImage}
          isGeneratingImage={isGeneratingImage}
          onDownload={handleDownloadSingle}
        />
      )}

      {/* Batch Export Progress Modal */}
      <BatchExportModal
        isOpen={batchModal.isOpen}
        current={batchModal.current}
        total={batchModal.total}
        isComplete={batchModal.isComplete}
        onClose={() => setBatchModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
