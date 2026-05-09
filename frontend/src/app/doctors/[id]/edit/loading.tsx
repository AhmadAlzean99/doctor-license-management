import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <FieldSkeleton />
            <FieldSkeleton />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
            <FieldSkeleton />
            <div className="flex justify-end gap-2 pt-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Skeleton className="h-5 w-16" />
          <div className="mt-4 flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <FieldSkeleton />
            <Skeleton className="h-9 w-32" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
