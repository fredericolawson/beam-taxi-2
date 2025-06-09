import { redirect } from 'next/navigation';

import { getMooringsByOwner } from '@/lib/tables/moorings';
import type { Mooring } from '@/types/mooring';
import { UserInfo } from '@/components/user-info';
import { UpdateInfoForm } from '@/components/update-user';
import { Separator } from '@/components/ui/separator';
import { getUserServer } from '@/lib/utils/get-user-server';
import { MooringsList } from '@/components/moorings-list';
import { RequestsList } from '@/components/requests-list';
import { getRequestsByOwner } from '@/lib/tables/requests';
import type { Request } from '@/types/request';

export default async function AccountPage() {
  const user = await getUserServer();
  if (!user) redirect('/auth/login?message=You must be logged in to view your account.');

  const moorings: Mooring[] = await getMooringsByOwner(user.id);
  const requests: Request[] = await getRequestsByOwner(user.id);

  return (
    <div className="container flex flex-col gap-8 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col gap-8 md:flex-row">
        <UserInfo user={user} />
        <UpdateInfoForm user={user} />
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        <h2 className="heading-2">My Moorings</h2>
        <MooringsList moorings={moorings} />
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        <h2 className="heading-2">My Requests</h2>
        <RequestsList requests={requests} />
      </div>
    </div>
  );
}
