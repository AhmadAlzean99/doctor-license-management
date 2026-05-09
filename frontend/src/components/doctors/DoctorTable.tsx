import Link from 'next/link';
import { Edit2, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/doctors/Pagination';
import { StatusBadge } from '@/components/doctors/StatusBadge';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus, type GetDoctorsQuery } from '@/lib/types';

interface DoctorTableProps {
  query: GetDoctorsQuery;
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export async function DoctorTable({ query }: DoctorTableProps) {
  const result = await doctorsApi.list(query);

  if (result.totalCount === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">No doctors found</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Try adjusting your search or filters, or add a new doctor to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Doctor
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Specialization
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                License
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Expiry
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.items.map((d) => {
              const isExpired = d.status === DoctorStatus.Expired;
              return (
                <tr
                  key={d.id}
                  className={`transition-colors hover:bg-slate-50 ${isExpired ? 'bg-rose-50/30' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{d.fullName}</div>
                    <div className="text-xs text-slate-500">{d.email}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">{d.specialization}</td>
                  <td className="px-5 py-4 font-mono text-sm text-slate-700">{d.licenseNumber}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{formatDate(d.licenseExpiryDate)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/doctors/${d.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={query.pageNumber ?? 1}
        totalPages={result.totalPages}
        totalCount={result.totalCount}
        pageSize={query.pageSize ?? 10}
      />
    </Card>
  );
}

export function DoctorTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="space-y-3 p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 flex-1 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </Card>
  );
}
