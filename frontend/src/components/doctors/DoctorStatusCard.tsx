'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/doctors/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { doctorsApi, HttpError } from '@/lib/api';
import { DoctorStatus, statusLabel } from '@/lib/types';

interface DoctorStatusCardProps {
  doctorId: number;
  doctorName: string;
  storedStatus: DoctorStatus;
  effectiveStatus: DoctorStatus;
}

export function DoctorStatusCard({
  doctorId,
  doctorName,
  storedStatus,
  effectiveStatus,
}: DoctorStatusCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<DoctorStatus>(storedStatus);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanged = status !== storedStatus;
  const showsDifferentEffective = storedStatus !== effectiveStatus;

  async function handleSave() {
    if (!hasChanged) return;
    setIsSaving(true);
    try {
      await doctorsApi.updateStatus(doctorId, { status });
      toast.success(`${doctorName} marked as ${statusLabel[status]}`);
      router.refresh();
    } catch (e) {
      const msg = e instanceof HttpError ? (e.body.detail ?? e.body.title) : 'Failed to update status';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-stone-600">Currently shown as</span>
        <StatusBadge status={effectiveStatus} />
        {showsDifferentEffective && (
          <span className="text-xs text-stone-500">
            (stored as {statusLabel[storedStatus]} — auto-computed from license expiry)
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:max-w-xs sm:flex-1">
          <Select
            label="Administrative status"
            options={[
              { value: String(DoctorStatus.Active), label: 'Active' },
              { value: String(DoctorStatus.Suspended), label: 'Suspended' },
            ]}
            value={status}
            onChange={(e) => setStatus(Number(e.target.value) as DoctorStatus)}
            hint="Expired is computed automatically and cannot be set here."
          />
        </div>
        <Button onClick={handleSave} loading={isSaving} disabled={!hasChanged}>
          Update status
        </Button>
      </div>
    </div>
  );
}
