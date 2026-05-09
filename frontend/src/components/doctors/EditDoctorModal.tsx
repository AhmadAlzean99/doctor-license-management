'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DoctorForm } from '@/components/doctors/DoctorForm';
import { DoctorStatusCard } from '@/components/doctors/DoctorStatusCard';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { doctorsApi, HttpError } from '@/lib/api';
import type { DoctorDetails } from '@/lib/types';

interface EditDoctorModalProps {
  open: boolean;
  doctorId: number;
  onClose: () => void;
}

export function EditDoctorModal({ open, doctorId, onClose }: EditDoctorModalProps) {
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setDoctor(null);

    doctorsApi
      .byId(doctorId)
      .then((d) => {
        if (!cancelled) setDoctor(d);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg =
          e instanceof HttpError ? (e.body.detail ?? e.body.title) : 'Failed to load doctor';
        toast.error(msg);
        onClose();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, doctorId, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Edit doctor" size="lg">
      {loading && <FormSkeleton />}

      {!loading && doctor && (
        <div className="flex flex-col gap-6">
          <DoctorForm mode="edit" initial={doctor} onSuccess={onClose} onCancel={onClose} />

          <div className="border-t border-stone-100 pt-5">
            <h3 className="mb-4 text-sm font-semibold text-stone-900">Administrative status</h3>
            <DoctorStatusCard
              doctorId={doctor.id}
              doctorName={doctor.fullName}
              storedStatus={doctor.storedStatus}
              effectiveStatus={doctor.effectiveStatus}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <FieldSkeleton />
      <FieldSkeleton />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
      <FieldSkeleton />
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
