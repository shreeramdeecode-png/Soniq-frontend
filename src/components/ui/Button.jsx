import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: 'nav-active-pill text-white font-semibold',
  secondary: 'glass-pill text-text-secondary font-medium',
};

export default function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn(
        'flex items-center gap-[7px] py-2.5 px-5 rounded-pill text-base cursor-pointer transition-all',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
