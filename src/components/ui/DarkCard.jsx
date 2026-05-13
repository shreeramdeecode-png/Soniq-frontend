import { cn } from '@/utils/cn';

export default function DarkCard({ children, className, variant = 'default', ...props }) {
  const variants = {
    default: 'dark-card',
    task: 'task-dark-card',
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
