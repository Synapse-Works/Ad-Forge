import JSZip from 'jszip';
import { BannerPreset, BannerAdInstance, AdCopyState } from '../types/banner';

interface RenderOptions {
  preset: BannerPreset;
  banner: BannerAdInstance;
  copy: AdCopyState;
  quality?: number;
}

// Helper to load an image into an HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

// Word-wrap utility for HTML5 canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Render banner to HTML5 canvas at target resolution
export async function renderBannerToCanvas(options: RenderOptions): Promise<HTMLCanvasElement> {
  const { preset, banner, copy } = options;
  const canvas = document.createElement('canvas');
  canvas.width = preset.width;
  canvas.height = preset.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  const width = preset.width;
  const height = preset.height;
  const isWide = width >= height * 2.5; // e.g., 728x90, 320x50, 970x250
  const isTall = height >= width * 2;   // e.g., 160x600, 300x600, 1080x1920
  const isSmallStrip = height <= 60;    // e.g. 320x50

  // 1. Draw Background
  const imageSrc = banner.mode === 'studio_ai' && banner.aiRenderImageUrl
    ? banner.aiRenderImageUrl
    : banner.backgroundImageUrl;

  try {
    const img = await loadImage(imageSrc);
    // Draw image with "cover" fit
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let renderW = width;
    let renderH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
    } else {
      renderH = width / imgRatio;
      offsetY = (height - renderH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  } catch {
    // Elegant fallback gradient if image fails to load
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // If in Pure Studio AI mode and has image, we are done!
  if (banner.mode === 'studio_ai' && banner.aiRenderImageUrl) {
    return canvas;
  }

  // 2. Scrim Overlay for WCAG AA readability
  const scrimOpacity = banner.scrimOpacity !== undefined ? banner.scrimOpacity : 0.65;
  if (isWide) {
    // Horizontal gradient scrim: darker on text side
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, `rgba(9, 13, 22, ${Math.min(0.95, scrimOpacity + 0.25)})`);
    grad.addColorStop(0.55, `rgba(9, 13, 22, ${scrimOpacity})`);
    grad.addColorStop(1, 'rgba(9, 13, 22, 0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Vertical gradient scrim: darker on bottom and top
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, `rgba(9, 13, 22, ${scrimOpacity * 0.7})`);
    grad.addColorStop(0.4, `rgba(9, 13, 22, ${scrimOpacity * 0.5})`);
    grad.addColorStop(1, `rgba(9, 13, 22, ${Math.min(0.95, scrimOpacity + 0.3)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // Font family mapping
  let fontFamily = 'Plus Jakarta Sans, sans-serif';
  if (copy.fontFamily === 'outfit') fontFamily = 'Outfit, sans-serif';
  if (copy.fontFamily === 'playfair') fontFamily = 'Playfair Display, serif';
  if (copy.fontFamily === 'archivo') fontFamily = 'Archivo, sans-serif';
  if (copy.fontFamily === 'cinzel') fontFamily = 'Cinzel, serif';

  const headline = banner.customHeadline || copy.headline;
  const subheadline = banner.customSubheadline || copy.subheadline;
  const cta = banner.customCta || copy.ctaText;
  const badge = banner.customBadge || copy.badgeText;
  const brand = copy.brandName || copy.productName.split(' ')[0] || 'ADFORGE';

  // Base scaling factor relative to container min dimension
  const scale = Math.min(width, height) / 300;
  const pad = Math.max(8, Math.round(16 * Math.sqrt(scale)));

  if (isSmallStrip) {
    // Ultra-compact layout for Mobile Leaderboard (320x50)
    // Brand / Badge
    ctx.fillStyle = copy.accentColor || '#38bdf8';
    ctx.font = `600 ${Math.round(10 * scale)}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(brand.toUpperCase(), pad, 8);

    // Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.round(12 * scale)}px ${fontFamily}`;
    ctx.fillText(headline.slice(0, 32), pad, 24);

    // CTA Button
    const btnW = Math.round(74 * scale);
    const btnH = Math.round(28 * scale);
    const btnX = width - pad - btnW;
    const btnY = (height - btnH) / 2;

    ctx.fillStyle = copy.primaryColor || '#6366f1';
    roundRect(ctx, btnX, btnY, btnW, btnH, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.round(10 * scale)}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cta, btnX + btnW / 2, btnY + btnH / 2);

    return canvas;
  }

  if (isWide) {
    // Wide layout (Leaderboard 728x90, Billboard 970x250, Amazon 3000x600)
    const contentH = height - pad * 2;
    const leftX = pad;
    const centerY = height / 2;

    // Brand mark / Badge
    ctx.fillStyle = copy.accentColor || '#38bdf8';
    ctx.font = `700 ${Math.round(11 * scale)}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${brand.toUpperCase()} · ${badge.toUpperCase()}`, leftX, pad + 2);

    // Headline
    const headlineSize = Math.max(15, Math.round(contentH * 0.32));
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${headlineSize}px ${fontFamily}`;
    const maxTextWidth = width * 0.58;
    const headlineLines = wrapText(ctx, headline, maxTextWidth).slice(0, 2);

    let startTextY = pad + Math.round(18 * scale);
    if (headlineLines.length === 1) startTextY = centerY - headlineSize * 0.6;

    for (let i = 0; i < headlineLines.length; i++) {
      ctx.fillText(headlineLines[i], leftX, startTextY + i * (headlineSize * 1.15));
    }

    // Subhead if height permits
    if (height >= 120 && subheadline) {
      const subheadSize = Math.max(12, Math.round(headlineSize * 0.45));
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `400 ${subheadSize}px 'Plus Jakarta Sans', sans-serif`;
      const subLines = wrapText(ctx, subheadline, maxTextWidth).slice(0, 2);
      const subY = startTextY + headlineLines.length * (headlineSize * 1.15) + 6;
      for (let j = 0; j < subLines.length; j++) {
        ctx.fillText(subLines[j], leftX, subY + j * (subheadSize * 1.2));
      }
    }

    // CTA Button on right side
    const btnW = Math.max(100, Math.round(width * 0.18));
    const btnH = Math.max(34, Math.round(contentH * 0.44));
    const btnX = width - pad - btnW;
    const btnY = (height - btnH) / 2;

    ctx.fillStyle = copy.primaryColor || '#6366f1';
    roundRect(ctx, btnX, btnY, btnW, btnH, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.max(11, Math.round(btnH * 0.38))}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cta, btnX + btnW / 2, btnY + btnH / 2);

    return canvas;
  }

  if (isTall) {
    // Tall skyscraper layout (160x600, 300x600, 1080x1920)
    const align = banner.textAlignment || 'center';
    const textX = align === 'left' ? pad : align === 'right' ? width - pad : width / 2;
    ctx.textAlign = align;

    // Top: Brand Name
    ctx.fillStyle = '#f8fafc';
    ctx.font = `800 ${Math.max(12, Math.round(18 * scale))}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.fillText(brand.toUpperCase(), textX, pad);

    // Badge Pill
    const badgeSize = Math.max(9, Math.round(11 * scale));
    ctx.fillStyle = copy.accentColor || '#38bdf8';
    ctx.font = `700 ${badgeSize}px ${fontFamily}`;
    ctx.fillText(badge.toUpperCase(), textX, pad + Math.max(18, Math.round(24 * scale)));

    // Headline (centered in upper third or bottom third)
    const headlineSize = Math.max(16, Math.round(26 * scale));
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${headlineSize}px ${fontFamily}`;
    const maxTextW = width - pad * 2;
    const lines = wrapText(ctx, headline, maxTextW).slice(0, 4);

    const headlineY = height >= 1000 ? height * 0.6 : height * 0.35;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], textX, headlineY + i * (headlineSize * 1.2));
    }

    // Subhead
    if (subheadline) {
      const subSize = Math.max(11, Math.round(13 * scale));
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
      const subLines = wrapText(ctx, subheadline, maxTextW).slice(0, 3);
      const subY = headlineY + lines.length * (headlineSize * 1.2) + 12;
      for (let j = 0; j < subLines.length; j++) {
        ctx.fillText(subLines[j], textX, subY + j * (subSize * 1.25));
      }
    }

    // CTA Button near bottom
    const btnW = Math.min(width - pad * 2, Math.max(120, Math.round(width * 0.8)));
    const btnH = Math.max(38, Math.round(48 * scale));
    const btnX = (width - btnW) / 2;
    const btnY = height - pad - btnH - Math.round(12 * scale);

    ctx.fillStyle = copy.primaryColor || '#6366f1';
    roundRect(ctx, btnX, btnY, btnW, btnH, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.max(12, Math.round(15 * scale))}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cta, btnX + btnW / 2, btnY + btnH / 2);

    return canvas;
  }

  // Standard Square or Rectangle Layout (300x250, 336x280, 1080x1080)
  const align = banner.textAlignment || 'left';
  const textX = align === 'left' ? pad : align === 'right' ? width - pad : width / 2;
  ctx.textAlign = align;

  // Badge & Brand top
  ctx.fillStyle = copy.accentColor || '#38bdf8';
  ctx.font = `700 ${Math.max(9, Math.round(11 * scale))}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  ctx.fillText(`${brand.toUpperCase()} · ${badge.toUpperCase()}`, textX, pad);

  // Headline
  const headlineSize = Math.max(16, Math.round(22 * scale));
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${headlineSize}px ${fontFamily}`;
  const maxW = width - pad * 2;
  const lines = wrapText(ctx, headline, maxW).slice(0, 3);
  const headlineY = pad + Math.max(20, Math.round(24 * scale));

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], textX, headlineY + i * (headlineSize * 1.2));
  }

  // Subheadline if height allows
  if (height >= 240 && subheadline) {
    const subSize = Math.max(11, Math.round(12 * scale));
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
    const subLines = wrapText(ctx, subheadline, maxW).slice(0, 2);
    const subY = headlineY + lines.length * (headlineSize * 1.2) + 8;
    for (let j = 0; j < subLines.length; j++) {
      ctx.fillText(subLines[j], textX, subY + j * (subSize * 1.25));
    }
  }

  // CTA Button at bottom
  const btnW = Math.min(width - pad * 2, Math.max(110, Math.round(130 * scale)));
  const btnH = Math.max(34, Math.round(38 * scale));
  let btnX = pad;
  if (align === 'center') btnX = (width - btnW) / 2;
  if (align === 'right') btnX = width - pad - btnW;
  const btnY = height - pad - btnH;

  ctx.fillStyle = copy.primaryColor || '#6366f1';
  roundRect(ctx, btnX, btnY, btnW, btnH, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${Math.max(11, Math.round(13 * scale))}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cta, btnX + btnW / 2, btnY + btnH / 2);

  return canvas;
}

// Draw rounded rectangle helper
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Download individual banner
export async function downloadBanner(options: RenderOptions, format: 'png' | 'jpeg' = 'png') {
  const canvas = await renderBannerToCanvas(options);
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const dataUrl = canvas.toDataURL(mime, 0.95);

  const cleanName = options.preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filename = `adforge-${options.preset.width}x${options.preset.height}-${cleanName}.${extension}`;

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Download all banners in a ZIP bundle
export async function downloadAllBannersZip(
  presets: BannerPreset[],
  banners: Record<string, BannerAdInstance>,
  copy: AdCopyState,
  onProgress?: (current: number, total: number) => void
) {
  const zip = new JSZip();
  const folder = zip.folder('adforge-banner-suite');
  const total = presets.length;

  for (let i = 0; i < presets.length; i++) {
    const preset = presets[i];
    const banner = banners[preset.id];
    if (!banner) continue;

    if (onProgress) onProgress(i + 1, total);

    const canvas = await renderBannerToCanvas({ preset, banner, copy });
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
    );

    if (blob && folder) {
      const cleanName = preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `${preset.width}x${preset.height}_${cleanName}.png`;
      folder.file(filename, blob);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `adforge-campaign-suite-${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
