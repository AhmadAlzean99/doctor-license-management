import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DoctorForm } from '@/components/doctors/DoctorForm';
import { DoctorStatusCard } from '@/components/doctors/DoctorStatusCard';
import { Card } from '@/components/ui/Card';
import { doctorsApi, HttpError } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDoctorPage({ params }: PageProps) {
  const { id } = await params;
  const doctorId = Number(id);

  if (Number.isNaN(doctorId)) notFound();

  let doctor;
  try {
    doctor = await doctorsApi.byId(doctorId);
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to doctors
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">Edit doctor</h1>
        <p className="text-sm text-stone-600">Update {doctor.fullName}&apos;s information.</p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card className="p-6">
          <DoctorForm mode="edit" initial={doctor} />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-base font-semibold text-stone-900">Status</h2>
          <DoctorStatusCard
            doctorId={doctor.id}
            doctorName={doctor.fullName}
            storedStatus={doctor.storedStatus}
            effectiveStatus={doctor.effectiveStatus}
          />
        </Card>
      </div>
    </div>
  );
}
