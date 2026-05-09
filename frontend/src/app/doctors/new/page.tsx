import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DoctorForm } from '@/components/doctors/DoctorForm';
import { Card } from '@/components/ui/Card';

export default function NewDoctorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to doctors
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Add doctor</h1>
        <p className="text-sm text-slate-600">Create a new doctor record on the platform.</p>
      </div>

      <Card className="mx-auto w-full max-w-2xl p-6">
        <DoctorForm mode="create" />
      </Card>
    </div>
  );
}
