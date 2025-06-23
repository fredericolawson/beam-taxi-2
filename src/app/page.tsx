import { LadderTable } from '@/components/ladder-table';
import { getPlayerByUserId, getPlayers } from '@/lib/tables/players';
import { getUserServer } from '@/lib/utils/get-user-server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const players = await getPlayers();
  const user = await getUserServer();
  const currentPlayer = await getPlayerByUserId(user?.id ?? '');
  if (!currentPlayer) redirect('/auth/login');

  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="heading-1">Club Ladder</h1>
        </div>
        <LadderTable players={players} currentPlayer={currentPlayer} />
      </div>
    </div>
  );
}
