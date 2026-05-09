'use client';

import { Calendar, Mail, Stethoscope, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/doctors/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { doctorsApi, HttpError } from '@/lib/api';
import type { DoctorDetails } from '@/lib/types';

interface DoctorQuickViewProps {
  open: boolean;
  doctorId: number;
  onClose: () => void;
  onEdit: () => void;
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DoctorQuickView({ open, doctorId, onClose, onEdit }: DoctorQuickViewProps) {
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
    <Modal
      open={open}
      onClose={onClose}
      title="Doctor details"
      size="lg"
      footer={
        doctor && (
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit}>Edit doctor</Button>
          </>
        )
      }
    >
      {loading && <DetailsSkeleton />}

      {!loading && doctor && (
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <Avatar name={doctor.fullName} size="md" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-stone-900">{doctor.fullName}</h3>
              <p className="truncate text-sm text-stone-500">{doctor.email}</p>
              <div className="mt-2">
                <StatusBadge status={doctor.effectiveStatus} />
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field icon={<Stethoscope className="h-4 w-4" />} label="Specialization">
              {doctor.specialization}
            </Field>
            <Field icon={<FileText className="h-4 w-4" />} label="License Number">
              <span className="font-mono">{doctor.licenseNumber}</span>
            </Field>
            <Field icon={<Calendar className="h-4 w-4" />} label="License Expiry">
              {formatDate(doctor.licenseExpiryDate)}
            </Field>
            <Field icon={<Mail className="h-4 w-4" />} label="Email">
              <a href={`mailto:${doctor.email}`} className="text-teal-700 hover:underline">
                {doctor.email}
              </a>
            </Field>
          </dl>

          <div className="border-t border-stone-100 pt-4 text-xs text-stone-500">
            <span>Created {formatDateTime(doctor.createdDate)}</span>
            {doctor.modifiedDate && (
              <>
                <span className="mx-2">·</span>
                <span>Updated {formatDateTime(doctor.modifiedDate)}</span>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function Field({ icon, label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-500">
        <span className="text-stone-400">{icon}</span>
        {label}
      </dt>
      <dd className="text-sm text-stone-900">{children}</dd>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-1 h-5 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
