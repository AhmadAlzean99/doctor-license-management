'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { AddDoctorModal } from '@/components/doctors/AddDoctorModal';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { usePermissions } from '@/components/RoleProvider';
import { Button } from '@/components/ui/Button';
import { useOpenAddDoctorListener } from '@/components/ui/KeyboardShortcuts';
import { LogoMark } from '@/components/ui/LogoMark';

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
            className="flex items-center gap-3 transition-opacity hover:opacity-85"
          >
            <LogoMark className="h-10 w-10 drop-shadow-sm transition-transform hover:rotate-3" />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight text-stone-900">DocLicense</span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-teal-700/80">
                License Management
              </span>
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
