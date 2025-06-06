import { MooringsList } from '@/components/moorings-list';
import { getAvailableMoorings } from '@/lib/tables/moorings';

export default async function Home() {
  const moorings = await getAvailableMoorings();
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <h1 className="heading-1 mb-8">Available Moorings</h1>
      <MooringsList moorings={moorings} />
    </div>
  );
}
