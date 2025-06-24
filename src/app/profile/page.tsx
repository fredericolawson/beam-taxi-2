import { redirect } from 'next/navigation';

import { UserInfo } from '@/components/user-info';
import { UpdateInfoForm } from '@/components/update-user';
import { getUserServer } from '@/lib/utils/get-user-server';
import { getPlayerByUserId } from '@/lib/tables/players';

export default async function AccountPage() {
  const user = await getUserServer();
  if (!user) redirect('/auth/login?message=You must be logged in to view your account.');
  const player = await getPlayerByUserId(user.id);
  if (!player) redirect('/auth/login?message=You must be logged in to view your account.');

  return (
    <div className="container flex flex-col gap-8 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col gap-8 md:flex-row">
        <UserInfo user={user} player={player} />
        <UpdateInfoForm user={user} player={player} />
      </div>
    </div>
  );
}
