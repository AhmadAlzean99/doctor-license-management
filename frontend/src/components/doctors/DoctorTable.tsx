import { Card } from '@/components/ui/Card';
import { DoctorRow } from '@/components/doctors/DoctorRow';
import { EmptyStateIllustration } from '@/components/doctors/EmptyStateIllustration';
import { Pagination } from '@/components/doctors/Pagination';
import { doctorsApi } from '@/lib/api';
import type { GetDoctorsQuery } from '@/lib/types';

interface DoctorTableProps {
  query: GetDoctorsQuery;
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
    <Card className="animate-fade-in-up overflow-hidden [animation-delay:300ms]">
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
            {result.items.map((d) => (
              <DoctorRow key={d.id} doctor={d} />
            ))}
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
