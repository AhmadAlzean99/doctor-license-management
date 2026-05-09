import { Activity, AlertTriangle, ShieldOff, Users } from 'lucide-react';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus } from '@/lib/types';

interface StatProps {
  label: string;
  value: number;
  icon: ReactNode;
  iconGradient: string;
}

function Stat({ label, value, icon, iconGradient }: StatProps) {
  return (
    <Card className="p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ${iconGradient}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export async function StatsBar() {
  const [total, active, expired, suspended] = await Promise.all([
    doctorsApi.list({ pageSize: 1 }),
    doctorsApi.list({ status: DoctorStatus.Active, pageSize: 1 }),
    doctorsApi.list({ status: DoctorStatus.Expired, pageSize: 1 }),
    doctorsApi.list({ status: DoctorStatus.Suspended, pageSize: 1 }),
  ]);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat
        label="Total Doctors"
        value={total.totalCount}
        icon={<Users className="h-5 w-5" />}
        iconGradient="from-teal-500 to-emerald-600 shadow-teal-600/20"
      />
      <Stat
        label="Active"
        value={active.totalCount}
        icon={<Activity className="h-5 w-5" />}
        iconGradient="from-emerald-500 to-emerald-600 shadow-emerald-600/20"
      />
      <Stat
        label="Expired"
        value={expired.totalCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconGradient="from-rose-500 to-rose-600 shadow-rose-600/20"
      />
      <Stat
        label="Suspended"
        value={suspended.totalCount}
        icon={<ShieldOff className="h-5 w-5" />}
        iconGradient="from-amber-500 to-orange-600 shadow-amber-600/20"
      />
    </div>
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
              <div className="h-8 w-12 animate-pulse rounded bg-stone-200" />
            </div>
            <div className="h-11 w-11 animate-pulse rounded-lg bg-stone-200" />
          </div>
        </Card>
      ))}
    </div>
  );
}
