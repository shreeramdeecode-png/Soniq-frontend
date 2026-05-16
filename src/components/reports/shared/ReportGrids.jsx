import { cn } from '@/utils/cn';

export function ReportGrid2({ children, className }) {
  return <div className={cn('grid grid-cols-2 gap-3', className)}>{children}</div>;
}

export function ReportGrid3({ children, className }) {
  return <div className={cn('grid grid-cols-3 gap-3', className)}>{children}</div>;
}
