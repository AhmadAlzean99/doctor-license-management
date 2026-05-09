import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { DoctorStatus, statusLabel } from '@/lib/types';

const statusTone: Record<DoctorStatus, BadgeTone> = {
  [DoctorStatus.Active]: 'active',
  [DoctorStatus.Expired]: 'expired',
  [DoctorStatus.Suspended]: 'suspended',
};

const statusDot: Record<DoctorStatus, string> = {
  [DoctorStatus.Active]: 'bg-emerald-500',
  [DoctorStatus.Expired]: 'bg-rose-500',
  [DoctorStatus.Suspended]: 'bg-amber-500',
};

export function StatusBadge({ status }: { status: DoctorStatus }) {
  return (
    <Badge tone={statusTone[status]}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
      {statusLabel[status]}
    </Badge>
  );
}
