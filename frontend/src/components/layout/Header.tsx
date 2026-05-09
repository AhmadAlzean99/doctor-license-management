'use client';

import { Plus, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AddDoctorModal } from '@/components/doctors/AddDoctorModal';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-8">
          <Link
            href="/doctors"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm shadow-teal-600/20">
              <Stethoscope className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-stone-900">DocLicense</span>
              <span className="text-xs text-stone-500">License Management</span>
            </span>
          </Link>

          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </header>

      <AddDoctorModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
