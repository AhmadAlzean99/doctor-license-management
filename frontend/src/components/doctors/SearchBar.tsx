'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState, useTransition } from 'react';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('search') ?? '');
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function applySearch(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set('search', value);
    else next.delete('search');
    next.delete('pageNumber');
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applySearch(value), 300);
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input
        type="text"
        placeholder="Search by name or license..."
        value={query}
        onChange={handleChange}
        className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-9 text-sm placeholder:text-stone-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-stone-300 border-t-teal-600" />
      )}
    </div>
  );
}
