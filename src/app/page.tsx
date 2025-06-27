import { LadderTable } from '@/components/ladder-table';
import { getPlayerByUserId, getPlayers } from '@/lib/tables/players';
import { getUserServer } from '@/lib/utils/get-user-server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const players = await getPlayers();
  const user = await getUserServer();

  const currentPlayer = await getPlayerByUserId(user?.id ?? '');
  if (!currentPlayer) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="heading-1">Club Ladder</h1>
      <LadderTable players={players} currentPlayer={currentPlayer} />
    </div>
  );
}
