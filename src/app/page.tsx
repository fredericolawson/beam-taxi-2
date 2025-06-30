import { LadderTable } from '@/components/ladder-table';
import { getPlayerByUserId, getPlayers } from '@/lib/tables/players';
import { isUserAdmin } from '@/lib/utils/admin-utils';
import { getUserServer } from '@/lib/utils/get-user-server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const players = await getPlayers();
  const user = await getUserServer();
  const isAdmin = await isUserAdmin(user?.id ?? '');

  const currentPlayer = await getPlayerByUserId(user?.id ?? '');
  if (!currentPlayer) return null;
  if (!currentPlayer.isApproved && !isAdmin) redirect('/profile');

  return (
    <div className="flex w-full flex-col">
      <h1 className="heading-1">Club Ladder</h1>
      <LadderTable players={players} currentPlayer={currentPlayer} />
    </div>
  );
}
