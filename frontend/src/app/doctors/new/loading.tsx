import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <Card className="mx-auto w-full max-w-2xl p-6">
        <div className="flex flex-col gap-4">
          <FieldSkeleton />
          <FieldSkeleton />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </Card>
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
