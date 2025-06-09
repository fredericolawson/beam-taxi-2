import { MooringsList } from '@/components/moorings-list';
import { RequestsList } from '@/components/requests-list';
import { Separator } from '@/components/ui/separator';
import { getOpenRequests } from '@/lib/tables/requests';
import { getAvailableMoorings } from '@/lib/tables/moorings';

export default async function Home() {
  const moorings = await getAvailableMoorings();
  const requests = await getOpenRequests();
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12 md:py-16">
      <h1 className="heading-1">Available Moorings</h1>
      <MooringsList moorings={moorings} />
      <Separator />
      <h2 className="heading-2">Open Requests</h2>
      <RequestsList requests={requests} />
    </div>
  );
}
