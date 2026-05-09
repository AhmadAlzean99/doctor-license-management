'use client';

import { Modal } from '@/components/ui/Modal';
import { DoctorForm } from '@/components/doctors/DoctorForm';

interface AddDoctorModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddDoctorModal({ open, onClose }: AddDoctorModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add doctor" size="lg">
      <DoctorForm mode="create" onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
