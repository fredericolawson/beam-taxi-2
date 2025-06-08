import { getMooringById } from '@/lib/tables/moorings-legacy';
import { notFound, redirect } from 'next/navigation';
import { EditMooringForm } from '@/components/moorings/edit-mooring';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Master } from '@/components/moorings/google-maps-picker';
import { getUserServer } from '@/lib/utils/get-user-server';

export default async function EditMooringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getUserServer();
  const mooring = await getMooringById(id);

  if (!mooring) notFound();
  if (!user) redirect(`/auth/login?message=You must be logged in to edit this mooring.&next=/moorings/${id}/edit`);
  if (mooring.owner_id !== user.id) redirect(`/moorings/${id}?error=You are not authorized to edit this mooring.`);

  return (
    <div className="my-auto flex flex-col gap-6 md:flex-row">
      <div className="card-container flex h-full flex-grow flex-col p-6 md:w-1/2">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Mooring</h1>
        </div>
        <EditMooringForm mooring={mooring} />
      </div>
      <div className="md:w-1/2">
        <Master mooring={mooring} />
      </div>
    </div>
  );
}
