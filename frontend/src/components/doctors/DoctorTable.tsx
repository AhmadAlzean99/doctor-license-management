import { AlertTriangle } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DoctorRowActions } from '@/components/doctors/DoctorRowActions';
import { EmptyStateIllustration } from '@/components/doctors/EmptyStateIllustration';
import { Pagination } from '@/components/doctors/Pagination';
import { StatusBadge } from '@/components/doctors/StatusBadge';
import { doctorsApi } from '@/lib/api';
import { DoctorStatus, type GetDoctorsQuery } from '@/lib/types';

const EXPIRY_WARNING_DAYS = 30;

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

function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export async function DoctorTable({ query }: DoctorTableProps) {
  const result = await doctorsApi.list(query);

  if (result.totalCount === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <EmptyStateIllustration />
          <h3 className="mt-2 text-base font-semibold text-stone-900">No doctors found</h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
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
          <thead className="border-b border-stone-200 bg-stone-50/60">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                Doctor
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                Specialization
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                License
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                Expiry
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {result.items.map((d) => {
              const isExpired = d.status === DoctorStatus.Expired;
              const days = daysUntil(d.licenseExpiryDate);
              const expiringSoon =
                d.status === DoctorStatus.Active && days >= 0 && days <= EXPIRY_WARNING_DAYS;

              return (
                <tr
                  key={d.id}
                  className={`transition-colors hover:bg-stone-50 ${isExpired ? 'bg-rose-50/30' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={d.fullName} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-stone-900">{d.fullName}</div>
                        <div className="truncate text-xs text-stone-500">{d.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-stone-700">{d.specialization}</td>
                  <td className="px-5 py-4 font-mono text-sm text-stone-700">{d.licenseNumber}</td>
                  <td className="px-5 py-4 text-sm text-stone-700">
                    <div className="flex flex-col gap-1">
                      <span>{formatDate(d.licenseExpiryDate)}</span>
                      {expiringSoon && (
                        <Badge tone="warning" className="w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          Expires in {days} {days === 1 ? 'day' : 'days'}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <DoctorRowActions doctor={d} />
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
            <div className="h-12 flex-1 animate-pulse rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </Card>
  );
}
