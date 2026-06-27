import { ChevronLeft, ChevronRight, Download, Monitor } from 'lucide-react';
import GlossyCard from '@/components/ui/GlossyCard';
import { cn } from '@/utils/cn';

export default function ScreenshotViewer({ shot, currentIndex, total, onPrev, onNext, onDownload }) {
  if (!shot) return null;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Main image card */}
      <GlossyCard className="overflow-hidden relative">
        <div className="w-full h-[350px] bg-gradient-to-br from-ink to-ink-mid flex items-center justify-center relative overflow-hidden">
          {shot.imageUrl ? (
            <img
              src={shot.imageUrl}
              alt={shot.app}
              className={cn("w-full h-full object-contain max-h-[350px]", shot.blurred && "blur-md scale-105")}
            />
          ) : (
            <div className={cn("w-full h-full flex flex-col items-center justify-center gap-2", shot.blurred && "blur-md scale-105")}>
              <Monitor size={40} stroke="rgba(29,158,117,0.3)" strokeWidth={1.5} />
              <span className="text-[10px] text-white/25 font-medium tracking-wide uppercase">No preview available</span>
            </div>
          )}

          {shot.blurred && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 z-[5]">
              <span className="text-3xl mb-1.5">🔒</span>
              <span className="text-xs font-semibold text-white/85 bg-black/55 py-1 px-2.5 rounded-lg">Blur Enabled</span>
            </div>
          )}

          {/* Nav arrows */}
          <button
            onClick={onPrev}
            disabled={currentIndex <= 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-[72px] flex items-center justify-center bg-white/[0.09] rounded-[10px] cursor-pointer backdrop-blur-[4px] hover:bg-white/[0.18] transition-colors z-10 disabled:opacity-30 disabled:cursor-not-allowed border-none"
          >
            <ChevronLeft size={18} stroke="rgba(255,255,255,0.8)" strokeWidth={2.5} />
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex >= total - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-[72px] flex items-center justify-center bg-white/[0.09] rounded-[10px] cursor-pointer backdrop-blur-[4px] hover:bg-white/[0.18] transition-colors z-10 disabled:opacity-30 disabled:cursor-not-allowed border-none"
          >
            <ChevronRight size={18} stroke="rgba(255,255,255,0.8)" strokeWidth={2.5} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 backdrop-blur-md rounded-[20px] py-1 px-3.5 text-[11px] font-medium text-white z-10">
            {currentIndex + 1} of {total}
          </div>
        </div>
      </GlossyCard>

      {/* Action row */}
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={currentIndex <= 0}
          className="flex-1 h-[34px] rounded-[10px] flex items-center justify-center gap-[5px] text-sm font-medium cursor-pointer bg-white/60 border-[1.5px] border-white/90 text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/80 transition-colors"
        >
          <ChevronLeft size={12} stroke="#666" strokeWidth={2} />
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex >= total - 1}
          className="flex-1 h-[34px] rounded-[10px] flex items-center justify-center gap-[5px] text-sm font-medium cursor-pointer dark-pill text-white disabled:opacity-40 disabled:cursor-not-allowed border-none"
        >
          Next
          <ChevronRight size={12} stroke="#fff" strokeWidth={2} />
        </button>
        <button
          onClick={onDownload}
          className="flex-1 h-[34px] rounded-[10px] flex items-center justify-center gap-[5px] text-sm font-medium cursor-pointer primary-pill text-white hover:opacity-90 transition-opacity border-none"
        >
          <Download size={12} stroke="#fff" strokeWidth={2} />
          Download
        </button>
      </div>
    </div>
  );
}
