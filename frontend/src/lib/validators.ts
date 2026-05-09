import { z } from 'zod';
import { DoctorStatus } from './types';

const todayIso = () => new Date().toISOString().slice(0, 10);

const baseFields = {
  fullName: z
    .string()
    .min(1, 'Full name is required.')
    .max(150, 'Full name cannot exceed 150 characters.'),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Email must be a valid email address.')
    .max(150, 'Email cannot exceed 150 characters.'),
  specialization: z
    .string()
    .min(1, 'Specialization is required.')
    .max(100, 'Specialization cannot exceed 100 characters.'),
  licenseNumber: z
    .string()
    .min(1, 'License number is required.')
    .max(50, 'License number cannot exceed 50 characters.'),
  licenseExpiryDate: z
    .string()
    .min(1, 'License expiry date is required.')
    .refine((s) => !Number.isNaN(Date.parse(s)), { message: 'Invalid date.' }),
};

const settableStatus = z
  .nativeEnum(DoctorStatus)
  .refine((s) => s === DoctorStatus.Active || s === DoctorStatus.Suspended, {
    message: 'Status must be Active or Suspended.',
  });

export const createDoctorSchema = z
  .object({ ...baseFields, status: settableStatus })
  .refine((d) => d.licenseExpiryDate >= todayIso(), {
    path: ['licenseExpiryDate'],
    message: 'License expiry date cannot be in the past for a new doctor.',
  });

export const updateDoctorSchema = z.object({ ...baseFields });

export const updateStatusSchema = z.object({ status: settableStatus });

export type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorFormValues = z.infer<typeof updateDoctorSchema>;
export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;
