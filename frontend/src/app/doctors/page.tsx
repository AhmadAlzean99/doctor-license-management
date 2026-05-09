import { Suspense } from 'react';
import { DoctorTable, DoctorTableSkeleton } from '@/components/doctors/DoctorTable';
import { SearchBar } from '@/components/doctors/SearchBar';
import { StatsBar, StatsBarSkeleton } from '@/components/doctors/StatsBar';
import { StatusFilter } from '@/components/doctors/StatusFilter';
import { DoctorStatus, type GetDoctorsQuery } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; pageNumber?: string }>;
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const query: GetDoctorsQuery = {
    search: sp.search,
    status: sp.status ? (Number(sp.status) as DoctorStatus) : undefined,
    pageNumber: sp.pageNumber ? Number(sp.pageNumber) : 1,
    pageSize: 10,
  };

  const tableKey = `${query.search ?? ''}-${query.status ?? ''}-${query.pageNumber ?? 1}`;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Doctors</h1>
        <p className="text-sm text-stone-600">
          Manage doctor licenses, statuses, and renewals across the platform.
        </p>
      </header>

      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBar />
      </Suspense>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:max-w-xs sm:flex-1">
          <SearchBar />
        </div>
        <StatusFilter />
      </div>

      <Suspense key={tableKey} fallback={<DoctorTableSkeleton />}>
        <DoctorTable query={query} />
      </Suspense>
    </div>
  );
}
