import React from 'react';
import { BannerPreset, BannerAdInstance, AdCopyState } from '../types/banner';
import { BannerCanvasRenderer } from './BannerCanvasRenderer';
import { Download, Sliders, Sparkles } from 'lucide-react';

interface Props {
  preset: BannerPreset;
  banner: BannerAdInstance;
  copy: AdCopyState;
  onOpenInspector: (presetId: string) => void;
  onDownload: (preset: BannerPreset, format: 'png' | 'jpeg') => void;
}

export const BannerCard: React.FC<Props> = ({
  preset,
  banner,
  copy,
  onOpenInspector,
  onDownload,
}) => {
  // Compute container height & aspect scale for preview gallery
  // Maximum preview container height so skyscrapers don't dominate the grid
  const maxPreviewHeight = 360;
  const maxPreviewWidth = 480;

  // Compute preview scaling factor
  let scale = 1;
  if (preset.width > maxPreviewWidth || preset.height > maxPreviewHeight) {
    const scaleX = maxPreviewWidth / preset.width;
    const scaleY = maxPreviewHeight / preset.height;
    scale = Math.min(scaleX, scaleY);
  }

  const containerW = Math.round(preset.width * scale);
  const containerH = Math.round(preset.height * scale);

  return (
    <div className="flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white font-mono tabular-nums">
            {preset.width} × {preset.height}
          </span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-xs font-medium text-slate-300 truncate max-w-[150px]">
            {preset.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-slate-800/70 text-slate-400">
            {banner.mode === 'studio_ai' ? 'Studio AI' : 'Layered'}
          </span>
        </div>
      </div>

      {/* Preview Viewport */}
      <div className="relative flex items-center justify-center p-4 bg-[#050810] min-h-[160px] flex-1 overflow-hidden">
        <div
          className="relative shadow-xl rounded overflow-hidden transition-transform duration-200"
          style={{
            width: `${containerW}px`,
            height: `${containerH}px`,
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
            <BannerCanvasRenderer preset={preset} banner={banner} copy={copy} />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/40 border-t border-slate-800/80 gap-2">
        <button
          onClick={() => onOpenInspector(preset.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/40 rounded-lg transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Customize & AI</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDownload(preset, 'png')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Download PNG at original dimensions"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>PNG</span>
          </button>
          <button
            onClick={() => onDownload(preset, 'jpeg')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Download JPG at original dimensions"
          >
            <span>JPG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
