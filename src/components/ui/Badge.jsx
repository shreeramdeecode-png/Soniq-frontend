import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: 'primary-badge text-white',
  productive: 'bg-surface-muted text-text-primary',
  unproductive: 'bg-ink-dark text-primary-light',
  neutral: 'bg-surface-subtle text-text-muted',
};

export default function Badge({ children, variant = 'primary', className }) {
  return (
    <span
      className={cn(
        'text-[8.5px] py-0.5 px-1.5 rounded-md font-semibold inline-flex items-center',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
