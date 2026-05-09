import { Card } from '@/components/ui/Card';
import { DoctorTableSkeleton } from '@/components/doctors/DoctorTable';
import { DashboardHeroSkeleton } from '@/components/doctors/DashboardHero';
import { StatsBarSkeleton } from '@/components/doctors/StatsBar';
import { StatusDistributionSkeleton } from '@/components/doctors/StatusDistribution';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeroSkeleton />
      <StatsBarSkeleton />
      <StatusDistributionSkeleton />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Card className="h-10 w-full p-0 sm:max-w-xs">
          <div className="h-full w-full animate-pulse rounded-xl bg-stone-100" />
        </Card>
        <Card className="h-10 w-32 p-0">
          <div className="h-full w-full animate-pulse rounded-xl bg-stone-100" />
        </Card>
      </div>

      <DoctorTableSkeleton />
    </div>
  );
}
