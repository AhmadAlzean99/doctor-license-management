'use client';

import { AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DoctorQuickView } from '@/components/doctors/DoctorQuickView';
import { EditDoctorModal } from '@/components/doctors/EditDoctorModal';
import { StatusBadge } from '@/components/doctors/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { doctorsApi, HttpError } from '@/lib/api';
import { DoctorStatus, type DoctorListItem } from '@/lib/types';

const EXPIRY_WARNING_DAYS = 30;

interface DoctorRowProps {
  doctor: DoctorListItem;
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function DoctorRow({ doctor }: DoctorRowProps) {
  const router = useRouter();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isExpired = doctor.status === DoctorStatus.Expired;
  const days = daysUntil(doctor.licenseExpiryDate);
  const expiringSoon =
    doctor.status === DoctorStatus.Active && days >= 0 && days <= EXPIRY_WARNING_DAYS;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await doctorsApi.delete(doctor.id);
      toast.success(`${doctor.fullName} deleted`);
      setDeleteOpen(false);
      router.refresh();
    } catch (e) {
      const msg = e instanceof HttpError ? (e.body.detail ?? e.body.title) : 'Failed to delete';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleQuickViewEdit() {
    setQuickViewOpen(false);
    setEditOpen(true);
  }

  return (
    <>
      <tr className={`transition-colors hover:bg-stone-50 ${isExpired ? 'bg-rose-50/30' : ''}`}>
        <td className="px-5 py-4">
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80"
            title={`View ${doctor.fullName}`}
          >
            <Avatar name={doctor.fullName} />
            <div className="min-w-0">
              <div className="truncate font-medium text-stone-900">{doctor.fullName}</div>
              <div className="truncate text-xs text-stone-500">{doctor.email}</div>
            </div>
          </button>
        </td>
        <td className="px-5 py-4 text-sm text-stone-700">{doctor.specialization}</td>
        <td className="px-5 py-4 font-mono text-sm text-stone-700">{doctor.licenseNumber}</td>
        <td className="px-5 py-4 text-sm text-stone-700">
          <div className="flex flex-col gap-1">
            <span>{formatDate(doctor.licenseExpiryDate)}</span>
            {expiringSoon && (
              <Badge tone="warning" className="w-fit">
                <AlertTriangle className="h-3 w-3" />
                Expires in {days} {days === 1 ? 'day' : 'days'}
              </Badge>
            )}
          </div>
        </td>
        <td className="px-5 py-4">
          <StatusBadge status={doctor.status} />
        </td>
        <td className="px-5 py-4 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="rounded-md p-1.5 text-stone-500 transition-colors hover:bg-teal-50 hover:text-teal-600"
              title="Edit"
              aria-label={`Edit ${doctor.fullName}`}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-md p-1.5 text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title="Delete"
              aria-label={`Delete ${doctor.fullName}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      <DoctorQuickView
        open={quickViewOpen}
        doctorId={doctor.id}
        onClose={() => setQuickViewOpen(false)}
        onEdit={handleQuickViewEdit}
      />

      <EditDoctorModal
        open={editOpen}
        doctorId={doctor.id}
        onClose={() => setEditOpen(false)}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete doctor"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-stone-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-stone-900">{doctor.fullName}</span>? The record
          will be soft-deleted and can be restored later from the database.
        </p>
      </Modal>
    </>
  );
}
