'use client';

import { LayoutDashboard, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  isActive: (pathname: string, search: URLSearchParams) => boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/doctors',
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    isActive: (pathname, search) =>
      pathname === '/doctors' && search.get('status') !== '2',
  },
  {
    label: 'Expired Licenses',
    href: '/doctors?status=2',
    icon: <AlertTriangle className="h-[18px] w-[18px]" />,
    isActive: (pathname, search) =>
      pathname === '/doctors' && search.get('status') === '2',
  },
  {
    label: 'Add Doctor',
    href: '/doctors/new',
    icon: <FileText className="h-[18px] w-[18px]" />,
    isActive: (pathname) => pathname === '/doctors/new',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-stone-200/70 bg-white/40 backdrop-blur-sm lg:block">
      <div className="sticky top-[64px] flex flex-col gap-6 px-3 py-6">
        <div className="px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Workspace
          </p>
        </div>

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = item.isActive(pathname, searchParams);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  active
                    ? 'bg-teal-50 text-teal-700 shadow-sm shadow-teal-600/5'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
                ].join(' ')}
              >
                <span
                  className={
                    active
                      ? 'text-teal-600'
                      : 'text-stone-400 transition-colors group-hover:text-stone-500'
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-3 h-px bg-stone-200/70" />

        <div className="px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            About
          </p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            Track and renew medical license records across your platform.
          </p>
        </div>
      </div>
    </aside>
  );
}
