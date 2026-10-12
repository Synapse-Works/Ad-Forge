import React from 'react';
import { RefreshCw, CheckCircle, Package } from 'lucide-react';

interface Props {
  isOpen: boolean;
  current: number;
  total: number;
  isComplete: boolean;
  onClose: () => void;
}

export const BatchExportModal: React.FC<Props> = ({
  isOpen,
  current,
  total,
  isComplete,
  onClose,
}) => {
  if (!isOpen) return null;

  const percentage = Math.round((current / (total || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
          {isComplete ? (
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          ) : (
            <Package className="w-6 h-6 animate-pulse text-indigo-400" />
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-white">
            {isComplete ? 'Campaign Bundle Ready!' : 'Rendering Banner Ad Suite...'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isComplete
              ? `All ${total} standard format banners were compiled and downloaded in high resolution.`
              : `Rendering banner ${current} of ${total} at full native pixel resolution...`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="bg-indigo-600 h-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-xs font-mono text-slate-400">
          {percentage}% Complete ({current}/{total})
        </div>

        {isComplete && (
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};
