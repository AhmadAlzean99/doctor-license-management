'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DoctorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-6 w-6 text-rose-600" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-stone-900">Something went wrong</h3>
        <p className="mt-1 max-w-md text-sm text-stone-500">
          {error.message || 'We could not load the doctors right now.'} Make sure the API is running on{' '}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">
            {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5050'}
          </code>{' '}
          and try again.
        </p>
        <Button onClick={reset} className="mt-5">
          Try again
        </Button>
      </div>
    </Card>
  );
}
