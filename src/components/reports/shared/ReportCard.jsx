import { cn } from '@/utils/cn';

export function ReportCard({ title, subtitle, actions, children, className, bodyClassName }) {
  return (
    <div className={cn('bg-white/84 rounded-[20px] border border-white/95 shadow-[0_2px_0_rgba(255,255,255,.95)_inset,0_4px_18px_rgba(0,0,0,.07)] overflow-hidden mb-3', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-black/[0.05]">
          <div>
            {title && <div className="text-[13px] font-bold text-text-primary">{title}</div>}
            {subtitle && <div className="text-[9.5px] text-text-light mt-0.5">{subtitle}</div>}
          </div>
          {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn('p-[18px]', bodyClassName)}>{children}</div>
    </div>
  );
}

export function CardActionButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-[10.5px] font-semibold px-3 py-1.5 rounded-[20px] cursor-pointer transition-colors',
        active ? 'bg-primary text-white shadow-sm' : 'glass-pill text-text-muted hover:bg-white/90',
      )}
    >
      {children}
    </button>
  );
}
