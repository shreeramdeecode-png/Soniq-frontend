import { cn } from '@/utils/cn';

export default function ReportPagination({
  info = 'Showing 5 of 128',
  pages = [1, 2, 3],
  activePage = 1,
  totalPages: totalPagesProp,
  onPageChange,
}) {
  const numericPages = pages.filter((p) => typeof p === 'number');
  const totalPages = totalPagesProp ?? (numericPages.length ? Math.max(...numericPages) : 1);
  const canPrev = activePage > 1;
  const canNext = activePage < totalPages;

  const go = (page) => {
    if (typeof page !== 'number' || page < 1 || page > totalPages || page === activePage) return;
    onPageChange?.(page);
  };

  return (
    <div className="flex items-center justify-between px-[18px] py-3 border-t border-black/[0.05]">
      <span className="text-[10px] text-text-light">{info}</span>
      <div className="flex items-center gap-1">
        <PagBtn disabled={!canPrev} onClick={() => go(activePage - 1)} aria-label="Previous page">
          ‹
        </PagBtn>
        {pages.map((p, i) => (
          <PagBtn
            key={`${p}-${i}`}
            active={p === activePage}
            disabled={p === '…'}
            onClick={() => go(p)}
          >
            {p}
          </PagBtn>
        ))}
        <PagBtn disabled={!canNext} onClick={() => go(activePage + 1)} aria-label="Next page">
          ›
        </PagBtn>
      </div>
    </div>
  );
}

function PagBtn({ children, active, disabled, onClick, ...rest }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-w-[26px] h-[26px] px-1.5 rounded-lg text-[10px] font-semibold transition-colors',
        disabled && children !== '…' && 'opacity-40 cursor-not-allowed',
        disabled && children === '…' && 'cursor-default opacity-60',
        !disabled && 'cursor-pointer',
        active
          ? 'bg-gradient-to-br from-[#0F6E56] to-[#1D9E75] text-white shadow-sm'
          : !disabled && 'bg-black/[0.03] text-text-muted hover:bg-primary/[0.08] hover:text-primary',
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
