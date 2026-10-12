export type BannerCategory = 'all' | 'google_display' | 'social' | 'ecommerce';

export type StylePresetId = 'clean-modern' | 'bold-impact' | 'minimal-luxury' | 'direct-response';

export type ImageModelId = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type ImageResolution = '1K' | '2K' | '4K';

export type ImageAspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9' | '1:4' | '4:1' | '8:1';

export type BannerFontFamily = 'jakarta' | 'outfit' | 'playfair' | 'archivo' | 'cinzel';

export interface BannerPreset {
  id: string;
  name: string;
  category: 'google_display' | 'social' | 'ecommerce';
  width: number;
  height: number;
  aspectRatio: ImageAspectRatio;
  description: string;
  layoutType: 'horizontal' | 'vertical' | 'square' | 'wide-strip' | 'tall-skyscraper';
}

export interface AdCopyState {
  productName: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  badgeText: string;
  brandName: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: BannerFontFamily;
  headlineVariants: string[];
  subheadlineVariants: string[];
  ctaVariants: string[];
  badgeVariants: string[];
  visualPrompts: {
    square: string;
    landscape: string;
    portrait: string;
    studioPureAd: string;
  };
}

export interface BannerAdInstance {
  presetId: string;
  mode: 'layered' | 'studio_ai';
  customHeadline?: string;
  customSubheadline?: string;
  customCta?: string;
  customBadge?: string;
  backgroundImageUrl: string;
  aiRenderImageUrl?: string;
  aspectRatio: ImageAspectRatio;
  imageSize: ImageResolution;
  model: ImageModelId;
  scrimOpacity: number; // 0 to 1
  textAlignment: 'left' | 'center' | 'right';
  buttonStyle: 'rounded' | 'pill' | 'sharp';
}

export interface SampleProduct {
  id: string;
  name: string;
  tagline: string;
  url: string;
  description: string;
  stylePreset: StylePresetId;
  primaryColor: string;
  accentColor: string;
  fontFamily: BannerFontFamily;
  badgeText: string;
  ctaText: string;
  headline: string;
  subheadline: string;
  headlineVariants: string[];
  subheadlineVariants: string[];
  ctaVariants: string[];
  badgeVariants: string[];
  defaultBgImage: string;
  visualPrompts: {
    square: string;
    landscape: string;
    portrait: string;
    studioPureAd: string;
  };
}
