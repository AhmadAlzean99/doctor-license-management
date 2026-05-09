'use client';

import { Plus, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { AddDoctorModal } from '@/components/doctors/AddDoctorModal';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { usePermissions } from '@/components/RoleProvider';
import { Button } from '@/components/ui/Button';
import { useOpenAddDoctorListener } from '@/components/ui/KeyboardShortcuts';

export function Header() {
  const [addOpen, setAddOpen] = useState(false);
  const permissions = usePermissions();

  const openAdd = useCallback(() => {
    if (permissions.canCreate) setAddOpen(true);
  }, [permissions.canCreate]);

  useOpenAddDoctorListener(openAdd);

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

          <div className="flex items-center gap-3">
            {permissions.canCreate && (
              <kbd className="hidden items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-mono text-[10px] font-medium text-stone-500 lg:inline-flex">
                Press <span className="rounded bg-white px-1 ring-1 ring-stone-200">N</span> to add
              </kbd>
            )}
            <RoleSwitcher />
            {permissions.canCreate && (
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Doctor
              </Button>
            )}
          </div>
        </div>
      </header>

      {permissions.canCreate && (
        <AddDoctorModal open={addOpen} onClose={() => setAddOpen(false)} />
      )}
    </>
  );
}
