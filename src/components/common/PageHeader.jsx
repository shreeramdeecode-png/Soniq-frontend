import { ChevronRight } from 'lucide-react';

export default function PageHeader({ breadcrumbs, title, subtitle, actions }) {
  return (
    <div className="flex items-end justify-between px-8 pt-4.5 pb-4 relative z-content">
      <div>
        {breadcrumbs && (
          <div className="flex items-center gap-1 text-[11px] text-text-light mb-1">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span>→</span>}
                <span>{crumb}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-[32px] font-bold text-text-primary tracking-tight leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm-plus text-text-muted mt-[3px]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
