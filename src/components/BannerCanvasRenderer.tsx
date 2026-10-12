import React from 'react';
import { BannerPreset, BannerAdInstance, AdCopyState } from '../types/banner';

interface Props {
  preset: BannerPreset;
  banner: BannerAdInstance;
  copy: AdCopyState;
  containerWidth?: number;
  containerHeight?: number;
}

export const BannerCanvasRenderer: React.FC<Props> = ({
  preset,
  banner,
  copy,
}) => {
  const isWide = preset.width >= preset.height * 2.5;
  const isTall = preset.height >= preset.width * 2;
  const isSmallStrip = preset.height <= 60;

  // Font family class
  let fontClass = 'font-sans';
  if (copy.fontFamily === 'outfit') fontClass = 'font-outfit';
  if (copy.fontFamily === 'playfair') fontClass = 'font-playfair';
  if (copy.fontFamily === 'archivo') fontClass = 'font-archivo';
  if (copy.fontFamily === 'cinzel') fontClass = 'font-cinzel';

  const headline = banner.customHeadline || copy.headline;
  const subheadline = banner.customSubheadline || copy.subheadline;
  const cta = banner.customCta || copy.ctaText;
  const badge = banner.customBadge || copy.badgeText;
  const brand = copy.brandName || copy.productName.split(' ')[0] || 'ADFORGE';

  const imageSrc =
    banner.mode === 'studio_ai' && banner.aiRenderImageUrl
      ? banner.aiRenderImageUrl
      : banner.backgroundImageUrl;

  const scrimOpacity =
    banner.scrimOpacity !== undefined ? banner.scrimOpacity : 0.65;

  // If in Pure Studio AI mode and has image, show image directly
  if (banner.mode === 'studio_ai' && banner.aiRenderImageUrl) {
    return (
      <div
        className="relative w-full h-full overflow-hidden select-none"
        style={{ width: `${preset.width}px`, height: `${preset.height}px` }}
      >
        <img
          src={banner.aiRenderImageUrl}
          alt={headline}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden select-none text-white ${fontClass}`}
      style={{
        width: `${preset.width}px`,
        height: `${preset.height}px`,
        backgroundColor: '#090d16',
      }}
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={headline}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Scrim Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isWide
            ? `linear-gradient(to right, rgba(9,13,22,${Math.min(0.95, scrimOpacity + 0.25)}) 0%, rgba(9,13,22,${scrimOpacity}) 55%, rgba(9,13,22,0.2) 100%)`
            : isTall
            ? `linear-gradient(to bottom, rgba(9,13,22,${scrimOpacity * 0.7}) 0%, rgba(9,13,22,${scrimOpacity * 0.4}) 40%, rgba(9,13,22,${Math.min(0.98, scrimOpacity + 0.3)}) 100%)`
            : `linear-gradient(to bottom, rgba(9,13,22,${scrimOpacity * 0.6}) 0%, rgba(9,13,22,${scrimOpacity * 0.4}) 30%, rgba(9,13,22,${Math.min(0.95, scrimOpacity + 0.3)}) 100%)`,
        }}
      />

      {/* Content Layer */}
      {isSmallStrip ? (
        // Ultra-compact: 320x50 Mobile Leaderboard
        <div className="relative z-10 w-full h-full flex items-center justify-between px-3">
          <div className="flex flex-col justify-center min-w-0 pr-2">
            <span
              className="text-[9px] font-bold uppercase tracking-wider truncate"
              style={{ color: copy.accentColor || '#38bdf8' }}
            >
              {brand}
            </span>
            <span className="text-[11px] font-bold leading-tight truncate text-white">
              {headline}
            </span>
          </div>
          <button
            className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm text-white transition-transform active:scale-95"
            style={{ backgroundColor: copy.primaryColor || '#6366f1' }}
          >
            {cta}
          </button>
        </div>
      ) : isWide ? (
        // Wide Banners: 728x90, 970x250, 3000x600
        <div className="relative z-10 w-full h-full flex items-center justify-between px-6 py-2">
          <div className="flex flex-col justify-center max-w-[65%]">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: copy.accentColor || '#38bdf8' }}
              >
                {brand}
              </span>
              <span className="text-slate-400 text-[11px]">·</span>
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wide">
                {badge}
              </span>
            </div>
            <h2
              className="font-extrabold text-white leading-tight"
              style={{
                fontSize: `${Math.max(15, Math.round(preset.height * 0.28))}px`,
              }}
            >
              {headline}
            </h2>
            {preset.height >= 120 && subheadline && (
              <p
                className="text-slate-300 font-normal leading-snug line-clamp-2 mt-1"
                style={{
                  fontSize: `${Math.max(12, Math.round(preset.height * 0.12))}px`,
                }}
              >
                {subheadline}
              </p>
            )}
          </div>
          <div className="shrink-0 pl-4">
            <button
              className="font-bold text-white px-5 py-2.5 rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: copy.primaryColor || '#6366f1',
                fontSize: `${Math.max(11, Math.round(preset.height * 0.15))}px`,
              }}
            >
              {cta}
            </button>
          </div>
        </div>
      ) : isTall ? (
        // Tall Skyscraper: 160x600, 300x600, 1080x1920
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-5 text-center">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-100 mb-1">
              {brand}
            </div>
            <div
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: copy.accentColor || '#38bdf8' }}
            >
              {badge}
            </div>
          </div>

          <div className="my-auto py-4">
            <h2
              className="font-extrabold text-white leading-snug text-balance"
              style={{
                fontSize: `${Math.max(16, Math.round(preset.width * 0.09))}px`,
              }}
            >
              {headline}
            </h2>
            {subheadline && (
              <p
                className="text-slate-300 font-normal mt-2 leading-relaxed"
                style={{
                  fontSize: `${Math.max(11, Math.round(preset.width * 0.05))}px`,
                }}
              >
                {subheadline}
              </p>
            )}
          </div>

          <div>
            <button
              className="w-full font-bold text-white py-3 rounded-lg shadow-lg transition-transform hover:scale-102 active:scale-95"
              style={{
                backgroundColor: copy.primaryColor || '#6366f1',
                fontSize: `${Math.max(12, Math.round(preset.width * 0.06))}px`,
              }}
            >
              {cta}
            </button>
          </div>
        </div>
      ) : (
        // Standard Square/Rectangle: 300x250, 336x280, 1080x1080
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-5">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: copy.accentColor || '#38bdf8' }}
            >
              {brand}
            </span>
            <span className="text-slate-500 text-[10px]">·</span>
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wide">
              {badge}
            </span>
          </div>

          <div className="my-auto py-2">
            <h2
              className="font-extrabold text-white leading-tight text-balance"
              style={{
                fontSize: `${Math.max(16, Math.round(preset.width * 0.075))}px`,
              }}
            >
              {headline}
            </h2>
            {preset.height >= 220 && subheadline && (
              <p
                className="text-slate-300 font-normal mt-1.5 leading-snug line-clamp-2"
                style={{
                  fontSize: `${Math.max(11, Math.round(preset.width * 0.042))}px`,
                }}
              >
                {subheadline}
              </p>
            )}
          </div>

          <div>
            <button
              className="inline-block font-bold text-white px-4 py-2 rounded-md shadow-md transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: copy.primaryColor || '#6366f1',
                fontSize: `${Math.max(11, Math.round(preset.width * 0.045))}px`,
              }}
            >
              {cta}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
