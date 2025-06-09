import { getRequestById } from '@/lib/tables/requests';

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequestById(id);
  return <div>RequestPage</div>;
}
