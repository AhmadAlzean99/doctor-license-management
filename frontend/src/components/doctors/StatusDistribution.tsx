import { Card } from '@/components/ui/Card';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus } from '@/lib/types';

interface LegendProps {
  dotClass: string;
  label: string;
  count: number;
  pct: number;
}

function Legend({ dotClass, label, count, pct }: LegendProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span className="font-medium text-stone-700">{label}</span>
      <span className="text-stone-500">{count}</span>
      <span className="text-stone-400">({pct.toFixed(0)}%)</span>
    </div>
  );
}

export async function StatusDistribution() {
  const [active, expired, suspended] = await Promise.all([
    doctorsApi.list({ status: DoctorStatus.Active, pageSize: 1 }),
    doctorsApi.list({ status: DoctorStatus.Expired, pageSize: 1 }),
    doctorsApi.list({ status: DoctorStatus.Suspended, pageSize: 1 }),
  ]);

  const total = active.totalCount + expired.totalCount + suspended.totalCount;

  if (total === 0) return null;

  const pct = (n: number) => (n / total) * 100;

  return (
    <Card className="animate-fade-in-up p-5 [animation-delay:240ms]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-900">License distribution</h3>
        <span className="text-xs text-stone-500">{total} total</span>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
        {active.totalCount > 0 && (
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${pct(active.totalCount)}%` }}
          />
        )}
        {expired.totalCount > 0 && (
          <div
            className="bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-500"
            style={{ width: `${pct(expired.totalCount)}%` }}
          />
        )}
        {suspended.totalCount > 0 && (
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${pct(suspended.totalCount)}%` }}
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        <Legend
          dotClass="bg-emerald-500"
          label="Active"
          count={active.totalCount}
          pct={pct(active.totalCount)}
        />
        <Legend
          dotClass="bg-rose-500"
          label="Expired"
          count={expired.totalCount}
          pct={pct(expired.totalCount)}
        />
        <Legend
          dotClass="bg-amber-500"
          label="Suspended"
          count={suspended.totalCount}
          pct={pct(suspended.totalCount)}
        />
      </div>
    </Card>
  );
}

export function StatusDistributionSkeleton() {
  return (
    <Card className="p-5">
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-stone-200" />
      <div className="h-2.5 w-full animate-pulse rounded-full bg-stone-200" />
      <div className="mt-3 flex gap-4">
        <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
      </div>
    </Card>
  );
}
