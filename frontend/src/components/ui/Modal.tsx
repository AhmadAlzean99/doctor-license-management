'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

type ModalSize = 'md' | 'lg' | 'xl';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
};

export function Modal({ open, onClose, title, size = 'md', children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full animate-modal-in rounded-xl bg-white shadow-2xl ring-1 ring-stone-200 ${sizeClasses[size]}`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
            <h2 className="text-base font-semibold text-stone-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="px-5 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-stone-100 px-5 py-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
