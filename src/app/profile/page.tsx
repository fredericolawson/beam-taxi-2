import { redirect } from 'next/navigation';

import { UserInfo } from '@/components/user-info';
import { UpdateInfoForm } from '@/components/update-user';
import { getUserServer } from '@/lib/utils/get-user-server';
import { getPlayerByUserId } from '@/lib/tables/players';

export default async function AccountPage() {
  const user = await getUserServer();
  if (!user) return null;
  const player = await getPlayerByUserId(user.id);
  if (!player) return null;

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <UserInfo user={user} player={player} />
      <UpdateInfoForm user={user} player={player} />
    </div>
  );
}
