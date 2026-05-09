import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 p-6 text-white shadow-lg shadow-teal-700/20 sm:p-8">
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-wider text-teal-100/80">
            {formatToday()}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {timeOfDayGreeting()}, Admin
          </h1>

          {expiredCount > 0 ? (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-teal-50">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm ring-1 ring-white/20">
                <Sparkles className="h-3 w-3" />
                Action needed
              </span>
              <span>
                {expiredCount} {expiredCount === 1 ? 'license has' : 'licenses have'} expired
                and need renewal.
              </span>
            </p>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-sm text-teal-50">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm ring-1 ring-white/20">
                <Sparkles className="h-3 w-3" />
                All clear
              </span>
              <span>Every license is current — great work keeping records up to date.</span>
            </p>
          )}
        </div>

        {expiredCount > 0 && (
          <Link
            href="/doctors?status=2"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm transition-all hover:bg-teal-50 hover:shadow-md"
          >
            Review expired
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function DashboardHeroSkeleton() {
  return (
    <div className="h-40 animate-pulse rounded-2xl bg-gradient-to-br from-teal-200 to-emerald-200" />
  );
}
