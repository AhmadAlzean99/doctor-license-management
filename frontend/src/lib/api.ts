import type {
  ApiError,
  CreateDoctorPayload,
  DoctorDetails,
  DoctorListItem,
  ExpiredDoctor,
  GetDoctorsQuery,
  PagedResult,
  UpdateDoctorPayload,
  UpdateStatusPayload,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5050';

export class HttpError extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.title || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let body: ApiError;
    try {
      body = await res.json();
    } catch {
      body = { status: res.status, title: res.statusText };
    }
    throw new HttpError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const doctorsApi = {
  list(query: GetDoctorsQuery = {}) {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.status !== undefined) params.set('status', String(query.status));
    if (query.pageNumber !== undefined) params.set('pageNumber', String(query.pageNumber));
    if (query.pageSize !== undefined) params.set('pageSize', String(query.pageSize));
    const qs = params.toString();
    return request<PagedResult<DoctorListItem>>(`/api/doctors${qs ? `?${qs}` : ''}`);
  },

  expired() {
    return request<ExpiredDoctor[]>('/api/doctors/expired');
  },

  byId(id: number) {
    return request<DoctorDetails>(`/api/doctors/${id}`);
  },

  create(payload: CreateDoctorPayload) {
    return request<DoctorDetails>('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: UpdateDoctorPayload) {
    return request<DoctorDetails>(`/api/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(id: number, payload: UpdateStatusPayload) {
    return request<void>(`/api/doctors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete(id: number) {
    return request<void>(`/api/doctors/${id}`, { method: 'DELETE' });
  },
};
