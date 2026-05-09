import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { DoctorStatus, statusLabel } from '@/lib/types';

const statusTone: Record<DoctorStatus, BadgeTone> = {
  [DoctorStatus.Active]: 'active',
  [DoctorStatus.Expired]: 'expired',
  [DoctorStatus.Suspended]: 'suspended',
};

export function StatusBadge({ status }: { status: DoctorStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}
