import { notFound, redirect } from 'next/navigation';
import { getUserServer } from '@/lib/utils/get-user-server';
import { EditRequest } from '@/components/main/edit-request';
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
      <EditRequest request={request} />
    </div>
  );
}
