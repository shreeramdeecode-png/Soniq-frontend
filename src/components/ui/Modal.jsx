import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Modal({ open, onClose, title, subtitle, children, size = 'md' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-[400px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[680px]',
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/30 backdrop-blur-[3px] animate-[fadeIn_0.15s_ease]"
    >
      <div className={cn(
        'w-full mx-4 bg-white/95 backdrop-blur-xl rounded-[22px] border border-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-[scaleIn_0.2s_ease]',
        sizes[size]
      )}>
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            {subtitle && <p className="text-xs-plus text-text-light mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer transition-colors shrink-0"
          >
            <X size={16} strokeWidth={2} className="text-text-muted" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
