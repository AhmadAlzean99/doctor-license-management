import { Suspense } from 'react';
import { ActiveFilters } from '@/components/doctors/ActiveFilters';
import { DashboardHero, DashboardHeroSkeleton } from '@/components/doctors/DashboardHero';
import { DoctorTable, DoctorTableSkeleton } from '@/components/doctors/DoctorTable';
import { SearchBar } from '@/components/doctors/SearchBar';
import { StatsBar, StatsBarSkeleton } from '@/components/doctors/StatsBar';
import { StatusDistribution, StatusDistributionSkeleton } from '@/components/doctors/StatusDistribution';
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
      <Suspense fallback={<DashboardHeroSkeleton />}>
        <DashboardHero />
      </Suspense>

      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBar />
      </Suspense>

      <Suspense fallback={<StatusDistributionSkeleton />}>
        <StatusDistribution />
      </Suspense>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:max-w-xs sm:flex-1">
            <SearchBar />
          </div>
          <StatusFilter />
        </div>
        <Suspense fallback={null}>
          <ActiveFilters />
        </Suspense>
      </div>

      <Suspense key={tableKey} fallback={<DoctorTableSkeleton />}>
        <DoctorTable query={query} />
      </Suspense>
    </div>
  );
}
