'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditDoctorModal } from '@/components/doctors/EditDoctorModal';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { doctorsApi, HttpError } from '@/lib/api';
import type { DoctorListItem } from '@/lib/types';

interface DoctorRowActionsProps {
  doctor: DoctorListItem;
}

export function DoctorRowActions({ doctor }: DoctorRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await doctorsApi.delete(doctor.id);
      toast.success(`${doctor.fullName} deleted`);
      setShowDeleteModal(false);
      router.refresh();
    } catch (e) {
      const msg = e instanceof HttpError ? (e.body.detail ?? e.body.title) : 'Failed to delete';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => setShowEditModal(true)}
          className="rounded-md p-1.5 text-stone-500 transition-colors hover:bg-teal-50 hover:text-teal-600"
          title="Edit"
          aria-label={`Edit ${doctor.fullName}`}
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="rounded-md p-1.5 text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
          title="Delete"
          aria-label={`Delete ${doctor.fullName}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <EditDoctorModal
        open={showEditModal}
        doctorId={doctor.id}
        onClose={() => setShowEditModal(false)}
      />

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete doctor"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
