'use client';

import { X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { DoctorStatus, statusLabel } from '@/lib/types';

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const search = params.get('search');
  const statusValue = params.get('status');
  const statusNumber = statusValue ? Number(statusValue) : undefined;

  if (!search && !statusValue) return null;

  function clearParam(key: string) {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    next.delete('pageNumber');
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  function clearAll() {
    startTransition(() => router.push(pathname));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-stone-500">Active filters:</span>

      {search && (
        <Chip label={`Search: "${search}"`} onRemove={() => clearParam('search')} />
      )}

      {statusNumber && (
        <Chip
          label={`Status: ${statusLabel[statusNumber as DoctorStatus] ?? statusValue}`}
          onRemove={() => clearParam('status')}
        />
      )}

      <button
        type="button"
        onClick={clearAll}
        className="text-xs font-medium text-stone-500 underline-offset-2 transition-colors hover:text-stone-900 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

interface ChipProps {
  label: string;
  onRemove: () => void;
}

function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 py-1 pl-3 pr-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-200">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-teal-100"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
