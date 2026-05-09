export enum DoctorStatus {
  Active = 1,
  Expired = 2,
  Suspended = 3,
}

export const statusLabel: Record<DoctorStatus, string> = {
  [DoctorStatus.Active]: 'Active',
  [DoctorStatus.Expired]: 'Expired',
  [DoctorStatus.Suspended]: 'Suspended',
};

export interface DoctorListItem {
  id: number;
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: DoctorStatus;
  createdDate: string;
  modifiedDate: string | null;
  totalCount: number;
}

export interface DoctorDetails {
  id: number;
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  storedStatus: DoctorStatus;
  effectiveStatus: DoctorStatus;
  createdDate: string;
  modifiedDate: string | null;
}

export interface ExpiredDoctor {
  id: number;
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: DoctorStatus;
  createdDate: string;
  modifiedDate: string | null;
  daysExpired: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateDoctorPayload {
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: DoctorStatus;
}

export interface UpdateDoctorPayload {
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
}

export interface UpdateStatusPayload {
  status: DoctorStatus;
}

export interface ApiError {
  status: number;
  title: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface GetDoctorsQuery {
  search?: string;
  status?: DoctorStatus;
  pageNumber?: number;
  pageSize?: number;
}
