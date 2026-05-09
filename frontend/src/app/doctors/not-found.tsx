import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <FileQuestion className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">Doctor not found</h3>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          The doctor you are looking for does not exist or has been deleted.
        </p>
        <Link href="/doctors" className="mt-5">
          <Button variant="secondary">Back to doctors</Button>
        </Link>
      </div>
    </Card>
  );
}
