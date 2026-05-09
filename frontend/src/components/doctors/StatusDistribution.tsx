import { Activity, AlertTriangle, BarChart3, ShieldOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus } from '@/lib/types';

interface SegmentCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  pct: number;
  iconBg: string;
  iconColor: string;
  pctColor: string;
}

function SegmentCard({ icon: Icon, label, count, pct, iconBg, iconColor, pctColor }: SegmentCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-stone-200/70 bg-stone-50/50 p-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium text-stone-600">{label}</span>
          <span className={`text-sm font-semibold tabular-nums ${pctColor}`}>{pct.toFixed(0)}%</span>
        </div>
        <div className="text-xs text-stone-500 tabular-nums">
          {count} {count === 1 ? 'doctor' : 'doctors'}
        </div>
      </div>
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
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <BarChart3 className="h-4 w-4 text-teal-600" />
            License distribution
          </h3>
          <p className="mt-0.5 text-xs text-stone-500">
            Breakdown of license states across the platform
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 tabular-nums">
          {total} total
        </span>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200/70">
        {active.totalCount > 0 && (
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
            style={{ width: `${pct(active.totalCount)}%` }}
            title={`Active: ${active.totalCount} (${pct(active.totalCount).toFixed(0)}%)`}
          />
        )}
        {expired.totalCount > 0 && (
          <div
            className="bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500"
            style={{ width: `${pct(expired.totalCount)}%` }}
            title={`Expired: ${expired.totalCount} (${pct(expired.totalCount).toFixed(0)}%)`}
          />
        )}
        {suspended.totalCount > 0 && (
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            style={{ width: `${pct(suspended.totalCount)}%` }}
            title={`Suspended: ${suspended.totalCount} (${pct(suspended.totalCount).toFixed(0)}%)`}
          />
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SegmentCard
          icon={Activity}
          label="Active"
          count={active.totalCount}
          pct={pct(active.totalCount)}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          pctColor="text-emerald-700"
        />
        <SegmentCard
          icon={AlertTriangle}
          label="Expired"
          count={expired.totalCount}
          pct={pct(expired.totalCount)}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          pctColor="text-rose-700"
        />
        <SegmentCard
          icon={ShieldOff}
          label="Suspended"
          count={suspended.totalCount}
          pct={pct(suspended.totalCount)}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          pctColor="text-amber-700"
        />
      </div>
    </Card>
  );
}

export function StatusDistributionSkeleton() {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-40 animate-pulse rounded bg-stone-200" />
          <div className="h-3 w-56 animate-pulse rounded bg-stone-200" />
        </div>
        <div className="h-6 w-16 animate-pulse rounded-full bg-stone-200" />
      </div>
      <div className="h-3 w-full animate-pulse rounded-full bg-stone-200" />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-stone-100" />
        ))}
      </div>
    </Card>
  );
}
