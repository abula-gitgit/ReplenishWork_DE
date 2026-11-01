import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
  action?: ToastAction;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-semibold transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-slate-900/95 text-white border-slate-800 backdrop-blur-md'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-white border-rose-800 backdrop-blur-md'
                : 'bg-white/95 text-slate-900 border-slate-200/80 backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.4]" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 stroke-[2.4]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0 stroke-[2.4]" />}
              <span className="truncate leading-relaxed">{toast.text}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss(toast.id);
                  }}
                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{toast.action.label}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="p-1 hover:opacity-75 transition-opacity cursor-pointer shrink-0 text-slate-400 hover:text-white"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
