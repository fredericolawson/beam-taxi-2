import { Ladder } from '@/components/ladder';
import { getPlayers } from '@/lib/tables/players';

export default async function Home() {
  const players = await getPlayers();
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-1">Latest Ladder</h1>
        </div>
        <Ladder players={players} />
      </div>
    </div>
  );
}
