import { cn } from '@/utils/cn';

export default function GlossyCard({ children, className, ...props }) {
  return (
    <div className={cn('glossy-card', className)} {...props}>
      {children}
    </div>
  );
}
