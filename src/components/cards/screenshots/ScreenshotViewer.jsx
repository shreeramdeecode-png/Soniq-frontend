import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import GlossyCard from '@/components/ui/GlossyCard';
import { mockCodeLines, mockEditorFiles, mockTabs } from '@/mock/screenshotDetail';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

const TOKEN_COLORS = {
  keyword: '#569CD6',
  function: '#DCDCAA',
  string: '#CE9178',
  var: '#9CDCFE',
  comment: 'rgba(255,255,255,0.25)',
  plain: '#fff',
};

function MockCodeEditor() {
  return (
    <div className="w-[85%] h-[85%] rounded-lg bg-[#1E1E1E] flex flex-col overflow-hidden">
      {/* Title bar */}
      <div className="h-[26px] bg-[#1A1A1A] flex items-center gap-1.5 px-2.5 shrink-0">
        <div className="w-[9px] h-[9px] rounded-full bg-[#FF5F57]" />
        <div className="w-[9px] h-[9px] rounded-full bg-[#FEBC2E]" />
        <div className="w-[9px] h-[9px] rounded-full bg-[#28C840]" />
        <div className="ml-1.5 flex gap-0.5">
          {mockTabs.map((tab) => (
            <div
              key={tab.name}
              className={cn(
                'h-5 px-3 rounded-t flex items-center text-[8px]',
                tab.active ? 'bg-primary/[0.12] text-primary-light' : 'bg-white/[0.07] text-white/40'
              )}
            >
              {tab.name}
            </div>
          ))}
        </div>
      </div>

      {/* Editor body */}
      <div className="flex-1 p-2.5 grid grid-cols-[90px_1fr] gap-0 overflow-hidden">
        {/* Sidebar */}
        <div className="border-r border-white/5 pr-1.5">
          {mockEditorFiles.map((file) => (
            <div
              key={file.name}
              className={cn(
                'text-[7px] py-0.5 px-1 rounded-[3px] mb-0.5',
                file.active ? 'bg-primary/10 text-primary-light/60' : 'text-white/20'
              )}
            >
              {file.name}
            </div>
          ))}
        </div>

        {/* Code */}
        <div className="pl-2.5 flex flex-col gap-[3px]">
          {mockCodeLines.map((line) => (
            <div
              key={line.num}
              className={cn(
                'flex gap-1.5 text-[7px] font-mono',
                line.highlight && 'bg-primary/[0.06] border-l-2 border-primary/40'
              )}
            >
              <span className="text-white/15 min-w-[10px]">{line.num}</span>
              {line.type === 'comment' && <span style={{ color: TOKEN_COLORS.comment }}>{line.content}</span>}
              {line.type === 'empty' && <span>&nbsp;</span>}
              {line.tokens && line.tokens.map((token, i) => (
                <span key={i} style={{ color: TOKEN_COLORS[token.type] || '#fff' }}>{token.text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScreenshotViewer() {
  const [currentIndex, setCurrentIndex] = useState(41);
  const total = 148;
  const toast = useToast();

  function handlePrev() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  }

  function handleDownload() {
    toast.success('Screenshot download started', 'Download');
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Main image card */}
      <GlossyCard className="overflow-hidden relative">
        <div className="w-full h-[350px] bg-gradient-to-br from-ink to-ink-mid flex items-center justify-center relative overflow-hidden">
          <MockCodeEditor />

          {/* Nav arrows */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-[72px] flex items-center justify-center bg-white/[0.09] rounded-[10px] cursor-pointer backdrop-blur-[4px] hover:bg-white/[0.18] transition-colors z-10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} stroke="rgba(255,255,255,0.8)" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === total - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-[72px] flex items-center justify-center bg-white/[0.09] rounded-[10px] cursor-pointer backdrop-blur-[4px] hover:bg-white/[0.18] transition-colors z-10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} stroke="rgba(255,255,255,0.8)" strokeWidth={2.5} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 backdrop-blur-md rounded-[20px] py-1 px-3.5 text-[11px] font-medium text-white">
            {currentIndex + 1} of {total}
          </div>
        </div>
      </GlossyCard>

      {/* Action row */}
      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 h-[34px] rounded-[10px] flex items-center justify-center gap-[5px] text-sm font-medium cursor-pointer bg-white/60 border-[1.5px] border-white/90 text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/80 transition-colors"
        >
          <ChevronLeft size={12} stroke="#666" strokeWidth={2} />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="flex-1 h-[34px] rounded-[10px] flex items-center justify-center gap-[5px] text-sm font-medium cursor-pointer dark-pill text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={12} stroke="#fff" strokeWidth={2} />
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 h-[34px] rounded-[10px] flex items-center justify-center gap-[5px] text-sm font-medium cursor-pointer primary-pill text-white hover:opacity-90 transition-opacity"
        >
          <Download size={12} stroke="#fff" strokeWidth={2} />
          Download
        </button>
      </div>
    </div>
  );
}
