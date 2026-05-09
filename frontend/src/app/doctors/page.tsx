import { Suspense } from 'react';
import { StatsBar, StatsBarSkeleton } from '@/components/doctors/StatsBar';

export default function DoctorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Doctors</h1>
        <p className="text-sm text-slate-600">
          Manage doctor licenses, statuses, and renewals across the platform.
        </p>
      </header>

      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBar />
      </Suspense>
    </div>
  );
}
