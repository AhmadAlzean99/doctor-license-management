import { AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus } from '@/lib/types';

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatToday() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function DashboardHero() {
  const expired = await doctorsApi.list({ status: DoctorStatus.Expired, pageSize: 1 });
  const expiredCount = expired.totalCount;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50/70 via-white to-white p-6 shadow-sm ring-1 ring-stone-200/70">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-teal-700">
            {formatToday()}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            {timeOfDayGreeting()}, Admin
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Manage doctor licenses, statuses, and renewals across your platform.
          </p>
        </div>

        {expiredCount > 0 && (
          <Link href="/doctors?status=2" className="shrink-0">
            <Button>
              Review {expiredCount} expired
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {expiredCount > 0 && (
        <div className="relative mt-4 flex items-center gap-2 rounded-lg bg-rose-50/70 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200/70">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {expiredCount} {expiredCount === 1 ? 'license has' : 'licenses have'} expired and need renewal.
          </span>
        </div>
      )}
    </div>
  );
}

export function DashboardHeroSkeleton() {
  return (
    <div className="h-32 animate-pulse rounded-xl bg-gradient-to-br from-teal-100/50 via-white to-white shadow-sm ring-1 ring-stone-200/70" />
  );
}
