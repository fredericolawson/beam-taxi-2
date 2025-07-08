import { getUserServer } from '@/lib/utils/get-user-server';

export default async function Home() {
  const user = await getUserServer();

  return (
    <div className="flex w-full flex-col">
      <h1 className="heading-1">Beam Taxi</h1>
    </div>
  );
}
