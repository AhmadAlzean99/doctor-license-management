'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';
import { DoctorStatus } from '@/lib/types';

export function StatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get('status') ?? '';
  const [isPending, startTransition] = useTransition();

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString());
    if (e.target.value) next.set('status', e.target.value);
    else next.delete('status');
    next.delete('pageNumber');
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60"
    >
      <option value="">All statuses</option>
      <option value={DoctorStatus.Active}>Active</option>
      <option value={DoctorStatus.Expired}>Expired</option>
      <option value={DoctorStatus.Suspended}>Suspended</option>
    </select>
  );
}
