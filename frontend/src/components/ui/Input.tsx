'use client';

import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[
          'rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400',
          'transition-colors focus:outline-none focus:ring-2',
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-stone-300 focus:border-teal-500 focus:ring-teal-500/20',
          className ?? '',
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {!error && hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
});
