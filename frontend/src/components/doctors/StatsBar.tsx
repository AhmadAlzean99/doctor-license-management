import { Activity, AlertTriangle, ShieldOff, Users } from 'lucide-react';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { CountUp } from '@/components/ui/CountUp';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus } from '@/lib/types';

interface StatProps {
  label: string;
  hint: string;
  value: number;
  icon: ReactNode;
  iconGradient: string;
  delayClass: string;
}

function Stat({ label, hint, value, icon, iconGradient, delayClass }: StatProps) {
  return (
    <Card
      className={`animate-fade-in-up p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-stone-300/70 ${delayClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-700">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            <CountUp value={value} />
          </p>
          <p className="mt-1 text-xs text-stone-500">{hint}</p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ${iconGradient}`}
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
        hint="Across the platform"
        value={total.totalCount}
        icon={<Users className="h-5 w-5" />}
        iconGradient="from-teal-500 to-emerald-600 shadow-teal-600/20"
        delayClass="[animation-delay:0ms]"
      />
      <Stat
        label="Active"
        hint="Currently practicing"
        value={active.totalCount}
        icon={<Activity className="h-5 w-5" />}
        iconGradient="from-emerald-500 to-emerald-600 shadow-emerald-600/20"
        delayClass="[animation-delay:60ms]"
      />
      <Stat
        label="Expired"
        hint="Need renewal"
        value={expired.totalCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconGradient="from-rose-500 to-rose-600 shadow-rose-600/20"
        delayClass="[animation-delay:120ms]"
      />
      <Stat
        label="Suspended"
        hint="Administratively paused"
        value={suspended.totalCount}
        icon={<ShieldOff className="h-5 w-5" />}
        iconGradient="from-amber-500 to-orange-600 shadow-amber-600/20"
        delayClass="[animation-delay:180ms]"
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
