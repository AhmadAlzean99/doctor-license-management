import Link from 'next/link';
import { Plus, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link
          href="/doctors"
          className="flex items-center gap-2.5 text-stone-900 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm shadow-teal-600/20">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">DocLicense</span>
            <span className="text-xs text-stone-500">License Management</span>
          </span>
        </Link>

        <Link href="/doctors/new">
          <Button size="md">
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </Link>
      </div>
    </header>
  );
}
