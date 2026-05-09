'use client';

import { ChevronDown, Eye, Pencil, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRole } from '@/components/RoleProvider';
import { roleDescription, roleLabel, type Role } from '@/lib/role';

const roleIcons: Record<Role, LucideIcon> = {
  admin: ShieldCheck,
  editor: Pencil,
  viewer: Eye,
};

const ROLES: Role[] = ['admin', 'editor', 'viewer'];

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const Icon = roleIcons[role];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
      >
        <Icon className="h-4 w-4 text-teal-600" />
        <span className="hidden sm:inline">{roleLabel[role]}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-60 animate-fade-in rounded-lg border border-stone-200 bg-white p-1 shadow-lg ring-1 ring-stone-900/5"
        >
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            View as
          </p>
          {ROLES.map((r) => {
            const RoleIcon = roleIcons[r];
            const isActive = r === role;
            return (
              <button
                key={r}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setRole(r);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  isActive ? 'bg-teal-50' : 'hover:bg-stone-50'
                }`}
              >
                <RoleIcon
                  className={`mt-0.5 h-4 w-4 ${isActive ? 'text-teal-600' : 'text-stone-400'}`}
                />
                <span className="flex flex-col gap-0.5">
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-teal-700' : 'text-stone-900'
                    }`}
                  >
                    {roleLabel[r]}
                  </span>
                  <span className="text-xs text-stone-500">{roleDescription[r]}</span>
                </span>
              </button>
            );
          })}
          <p className="border-t border-stone-100 px-3 py-2 text-[11px] text-stone-500">
            Mock role switch — production would use a JWT claim.
          </p>
        </div>
      )}
    </div>
  );
}
