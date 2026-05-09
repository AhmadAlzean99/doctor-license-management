import { Activity, AlertTriangle, ShieldOff, Users } from 'lucide-react';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus } from '@/lib/types';

interface StatProps {
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

function Stat({ label, value, icon, iconBg, iconColor }: StatProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
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
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <Stat
        label="Active"
        value={active.totalCount}
        icon={<Activity className="h-5 w-5" />}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <Stat
        label="Expired"
        value={expired.totalCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconBg="bg-rose-50"
        iconColor="text-rose-600"
      />
      <Stat
        label="Suspended"
        value={suspended.totalCount}
        icon={<ShieldOff className="h-5 w-5" />}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
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
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-12 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </Card>
      ))}
    </div>
  );
}
