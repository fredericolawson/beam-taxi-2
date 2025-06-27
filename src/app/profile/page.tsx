import { UserInfo } from '@/components/user-info';
import { UpdateInfoForm } from '@/components/update-user';
import { getUserServer } from '@/lib/utils/get-user-server';
import { getPlayerByUserId } from '@/lib/tables/players';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/types';

export default async function AccountPage() {
  const user = await getUserServer();
  if (!user) return null;
  const player = await getPlayerByUserId(user.id);
  if (!player) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <PendingApproval player={player} />
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <UserInfo user={user} player={player} />
        <UpdateInfoForm user={user} player={player} />
      </div>
    </div>
  );
}

function PendingApproval({ player }: { player: Player }) {
  if (player.isApproved) return null;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="heading-1">Pending Approval</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Pending Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Thank you for registering! Your account is currently pending approval. You will receive an email notification at{' '}
            <span className="font-extrabold">{player.email}</span> once an admin has reviewed and approved your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
