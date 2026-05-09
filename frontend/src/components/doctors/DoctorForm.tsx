'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { doctorsApi, HttpError } from '@/lib/api';
import { DoctorStatus, type DoctorDetails } from '@/lib/types';
import {
  createDoctorSchema,
  updateDoctorSchema,
  type CreateDoctorFormValues,
  type UpdateDoctorFormValues,
} from '@/lib/validators';

interface DoctorFormProps {
  mode: 'create' | 'edit';
  initial?: DoctorDetails;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DoctorForm({ mode, initial, onSuccess, onCancel }: DoctorFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = mode === 'edit';

  const form = useForm<CreateDoctorFormValues | UpdateDoctorFormValues>({
    resolver: zodResolver(isEdit ? updateDoctorSchema : createDoctorSchema),
    defaultValues: isEdit && initial
      ? {
          fullName: initial.fullName,
          email: initial.email,
          specialization: initial.specialization,
          licenseNumber: initial.licenseNumber,
          licenseExpiryDate: initial.licenseExpiryDate.slice(0, 10),
        }
      : {
          fullName: '',
          email: '',
          specialization: '',
          licenseNumber: '',
          licenseExpiryDate: '',
          status: DoctorStatus.Active,
        },
  });

  const { register, handleSubmit, formState } = form;
  const errors = formState.errors as Record<string, { message?: string } | undefined>;
  const isSubmitting = formState.isSubmitting;

  async function onSubmit(values: CreateDoctorFormValues | UpdateDoctorFormValues) {
    setServerError(null);
    try {
      if (isEdit && initial) {
        await doctorsApi.update(initial.id, values as UpdateDoctorFormValues);
        toast.success(`${values.fullName} updated`);
      } else {
        await doctorsApi.create(values as CreateDoctorFormValues);
        toast.success(`${values.fullName} added`);
      }
      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/doctors');
      }
    } catch (e) {
      if (e instanceof HttpError) {
        if (e.body.errors) {
          const messages = Object.values(e.body.errors).flat().join(' ');
          setServerError(messages);
        } else {
          setServerError(e.body.detail ?? e.body.title);
        }
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  }

  function handleCancel() {
    if (onCancel) onCancel();
    else router.back();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {serverError}
        </div>
      )}

      <Input
        label="Full Name"
        placeholder="Dr. Sarah Ahmed"
        {...register('fullName')}
        error={errors.fullName?.message}
      />

      <Input
        label="Email"
        type="email"
        placeholder="sarah@clinic.ae"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Specialization"
          placeholder="Cardiology"
          {...register('specialization')}
          error={errors.specialization?.message}
        />
        <Input
          label="License Number"
          placeholder="MED-DXB-001"
          {...register('licenseNumber')}
          error={errors.licenseNumber?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="License Expiry Date"
          type="date"
          {...register('licenseExpiryDate')}
          error={errors.licenseExpiryDate?.message}
        />

        {!isEdit && (
          <Select
            label="Status"
            options={[
              { value: String(DoctorStatus.Active), label: 'Active' },
              { value: String(DoctorStatus.Suspended), label: 'Suspended' },
            ]}
            {...register('status', { valueAsNumber: true })}
            error={errors.status?.message}
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Save changes' : 'Create doctor'}
        </Button>
      </div>
    </form>
  );
}
