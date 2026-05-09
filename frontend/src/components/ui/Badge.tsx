import type { ReactNode } from 'react';

export type BadgeTone = 'active' | 'expired' | 'suspended' | 'warning' | 'neutral';

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  expired: 'bg-rose-50 text-rose-700 ring-rose-200',
  suspended: 'bg-amber-50 text-amber-700 ring-amber-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  neutral: 'bg-stone-50 text-stone-700 ring-stone-200',
};

export function Badge({ tone, children, className }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneClasses[tone],
        className ?? '',
      ].join(' ')}
    >
      {children}
    </span>
  );
}
