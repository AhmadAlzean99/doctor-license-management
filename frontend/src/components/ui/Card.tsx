import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={[
        'rounded-xl bg-white shadow-sm ring-1 ring-slate-200',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
