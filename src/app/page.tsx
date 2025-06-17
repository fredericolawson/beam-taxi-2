import { MooringsList } from '@/components/moorings-list';
import { RequestsList } from '@/components/requests-list';
import { Separator } from '@/components/ui/separator';
import { getOpenRequests } from '@/lib/tables/requests';
import { getAvailableMoorings } from '@/lib/tables/moorings';
import { CreateMooringAction } from '@/components/actions';
import { CreateRequestAction } from '@/components/actions';

export default async function Home() {
  const moorings = await getAvailableMoorings();
  const requests = await getOpenRequests();
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-1">Available Moorings</h1>
          <CreateMooringAction />
        </div>
        <MooringsList moorings={moorings} />
      </div>
      <Separator />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="heading-2">Open Requests</h2>
          <CreateRequestAction />
        </div>
        <RequestsList requests={requests} />
      </div>
    </div>
  );
}
