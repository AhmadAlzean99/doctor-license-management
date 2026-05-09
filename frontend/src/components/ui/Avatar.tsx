interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

const palette = [
  'bg-teal-100 text-teal-700 ring-teal-200',
  'bg-emerald-100 text-emerald-700 ring-emerald-200',
  'bg-sky-100 text-sky-700 ring-sky-200',
  'bg-violet-100 text-violet-700 ring-violet-200',
  'bg-rose-100 text-rose-700 ring-rose-200',
  'bg-amber-100 text-amber-700 ring-amber-200',
  'bg-blue-100 text-blue-700 ring-blue-200',
  'bg-indigo-100 text-indigo-700 ring-indigo-200',
];

const sizeClasses = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function getColorClasses(name: string): string {
  const hash = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

export function Avatar({ name, size = 'sm' }: AvatarProps) {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-inset',
        sizeClasses[size],
        getColorClasses(name),
      ].join(' ')}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
