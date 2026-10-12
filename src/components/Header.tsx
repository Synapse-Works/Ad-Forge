import React from 'react';
import { BannerCategory } from '../types/banner';
import { Download, Sparkles } from 'lucide-react';

interface Props {
  activeCategory: BannerCategory;
  onSelectCategory: (category: BannerCategory) => void;
  onBatchExport: () => void;
  isExporting: boolean;
  totalBannersCount: number;
}

export const Header: React.FC<Props> = ({
  activeCategory,
  onSelectCategory,
  onBatchExport,
  isExporting,
  totalBannersCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-[#090d16]/90 backdrop-blur sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
          <Sparkles className="w-4 h-4 text-indigo-200" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
          AdForge Studio
        </span>
      </div>

      {/* Zone 2: 4-5 clean single-line category filter tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Formats ({totalBannersCount})
        </button>
        <button
          onClick={() => onSelectCategory('google_display')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'google_display'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Google Display (7)
        </button>
        <button
          onClick={() => onSelectCategory('social')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'social'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Social Media (4)
        </button>
        <button
          onClick={() => onSelectCategory('ecommerce')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'ecommerce'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          E-Commerce (3)
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBatchExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExporting ? 'Packaging ZIP...' : 'Export Full Suite (.zip)'}</span>
        </button>
      </div>
    </header>
  );
};
