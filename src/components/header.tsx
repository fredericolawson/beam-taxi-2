import { User as SupabaseUser } from '@supabase/supabase-js';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import CreateMooring from './main/create-mooring';
import CreateRequest from './main/create-request';
import { Button } from './ui/button';
import { getUserServer } from '@/lib/utils/get-user-server';

export async function Header() {
  const user = await getUserServer();
  return (
    <header className="flex items-center justify-between border-b bg-white p-6">
      <div className="mr-4 flex">
        <Link href="/" className="mr-6 flex flex-col">
          <span className="text-2xl font-bold">Hey Buoy</span>
          <span className="label">The home of Bermuda Moorings</span>
        </Link>
      </div>
      <div className="items-top flex flex-1 flex-col justify-end gap-2 md:flex-row">
        <UserMenu user={user} />
        <GenericMenu user={user} />
      </div>
    </header>
  );
}

function UserMenu({ user }: { user: SupabaseUser | null }) {
  if (!user) return null;

  const userInitial = user.email?.charAt(0).toUpperCase() ?? '?';
  return (
    <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
      <CreateRequest />
      <CreateMooring />
      <Link href="/account">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}

function GenericMenu({ user }: { user: SupabaseUser | null }) {
  if (user) return null;

  return (
    <div className="flex flex-col items-center items-end gap-2 md:flex-row">
      <Button asChild variant="outline">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
