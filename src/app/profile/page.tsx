import { getUserServer } from '@/lib/utils/get-user-server';

export default async function AccountPage() {
  const user = await getUserServer();
  if (!user) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="heading-1">Profile</h1>
    </div>
  );
}
