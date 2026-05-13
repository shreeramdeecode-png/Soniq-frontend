import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import ScreenshotViewer from '@/components/cards/screenshots/ScreenshotViewer';
import FilmStrip from '@/components/cards/screenshots/FilmStrip';
import ScreenshotDetailPanel from '@/components/cards/screenshots/ScreenshotDetailPanel';

export default function ScreenshotDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="relative z-[2] pb-6">
      {/* Page header */}
      <div className="flex items-center gap-3.5 px-9 pt-3 pb-2.5">
        <button
          onClick={() => navigate('/screenshots')}
          className="glass-pill flex items-center gap-1.5 py-[7px] px-3.5 rounded-pill text-sm-plus font-medium text-text-secondary cursor-pointer whitespace-nowrap shrink-0"
        >
          <ChevronLeft size={12} stroke="#666" strokeWidth={2} />
          Back to grid
        </button>
        <div className="text-[11px] text-text-light whitespace-nowrap overflow-hidden text-ellipsis">
          Screenshots → <span className="text-text-primary font-medium">Ravi Shankar</span> → <span className="text-text-primary font-medium">2:41 PM · Apr 16, 2026</span>
        </div>
        <button className="ml-auto shrink-0 glass-pill flex items-center gap-[5px] py-[7px] px-4 rounded-pill text-sm text-text-secondary cursor-pointer whitespace-nowrap">
          <Download size={11} stroke="#666" strokeWidth={2} />
          Download
        </button>
      </div>

      {/* Lightbox area */}
      <div className="grid grid-cols-[1fr_286px] gap-3 px-9">
        {/* Left column */}
        <div className="flex flex-col gap-2.5 min-w-0">
          <ScreenshotViewer />
          <FilmStrip />
        </div>

        {/* Right panel */}
        <ScreenshotDetailPanel />
      </div>
    </div>
  );
}
