import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'bg-primary/[0.12] border-primary/30 text-[#0F6E56]',
  error: 'bg-status-danger/[0.12] border-status-danger/30 text-[#991B1B]',
  warning: 'bg-status-warning/[0.12] border-status-warning/30 text-[#92400E]',
  info: 'bg-status-info/[0.12] border-status-info/30 text-[#1E40AF]',
};

const ICON_COLORS = {
  success: '#0F6E56',
  error: '#991B1B',
  warning: '#92400E',
  info: '#1E40AF',
};

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const Icon = ICONS[toast.type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[14px] border backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 min-w-[300px] max-w-[420px]',
        STYLES[toast.type],
        exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      )}
    >
      <Icon size={16} color={ICON_COLORS[toast.type]} strokeWidth={2} className="shrink-0" />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        )}
        <p className={cn('text-xs leading-snug', toast.title ? 'mt-0.5 opacity-80' : 'font-medium')}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => { setExiting(true); setTimeout(() => onDismiss(toast.id), 300); }}
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 cursor-pointer transition-colors"
      >
        <X size={11} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-5 right-5 z-toast flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const addToast = useContext(ToastContext);
  if (!addToast) throw new Error('useToast must be used within ToastProvider');

  return {
    success: (message, title) => addToast({ type: 'success', message, title }),
    error: (message, title) => addToast({ type: 'error', message, title }),
    warning: (message, title) => addToast({ type: 'warning', message, title }),
    info: (message, title) => addToast({ type: 'info', message, title }),
  };
}
