import { notFound, redirect } from 'next/navigation';
import { getUserServer } from '@/lib/utils/get-user-server';
import { EditRequest } from '@/components/moorings/edit-request';
import { getRequestById } from '@/lib/tables/requests';

export default async function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserServer();
  const request = await getRequestById(id);

  if (!request) notFound();
  if (!user) redirect(`/auth/login?message=You must be logged in to edit this request.&next=/requests/${id}/edit`);
  if (request.owner_id !== user.id) redirect(`/requests/${id}?error=You are not authorized to edit this request.`);

  return (
    <div className="my-auto flex flex-col gap-6 md:flex-row">
      <div className="card-container flex h-full flex-grow flex-col p-6 md:w-1/2">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Request</h1>
        </div>
        <EditRequest request={request} />
      </div>
    </div>
  );
}
