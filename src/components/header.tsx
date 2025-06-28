import { User as SupabaseUser } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from './ui/button';
import { getUserServer } from '@/lib/utils/get-user-server';
import { HomeIcon, ShieldIcon, TrophyIcon, User as UserIcon } from 'lucide-react';
import { getPlayerByUserId } from '@/lib/tables/players';
import Image from 'next/image';
import { isUserAdmin } from '@/lib/utils/admin-utils';

export async function Header() {
  const user = await getUserServer();

  return (
    <header className="bg-secondary flex flex-col items-center justify-between border-b px-6 pb-4 md:flex-row md:pb-0">
      <Link href="/" className="text-secondary-foreground mr-6 flex flex-col">
        <Image src="/logo.png" alt="CBTC Ladder" width={300} height={200} />
      </Link>

      <div className="items-top flex flex-1 flex-row flex-wrap justify-end gap-2">
        <AdminMenu user={user} />
        <ProfileMenu user={user} />
        <GenericMenu user={user} />
      </div>
    </header>
  );
}

async function AdminMenu({ user }: { user: SupabaseUser | null }) {
  if (!user) return null;
  const adminUser = await isUserAdmin(user.id);
  if (!adminUser) return null;

  return (
    <Button variant="secondary" asChild className="border">
      <Link href="/admin">
        <ShieldIcon />
        Admin
      </Link>
    </Button>
  );
}

async function ProfileMenu({ user }: { user: SupabaseUser | null }) {
  if (!user) return null;
  const player = await getPlayerByUserId(user.id);
  if (!player) return null;

  return (
    <>
      <Button variant="secondary" asChild className="border">
        <Link href={`/`}>
          <TrophyIcon />
          Ladder
        </Link>
      </Button>
      <Button variant="secondary" asChild className="border">
        <Link href={`/profile`}>
          <UserIcon />
          Profile
        </Link>
      </Button>
    </>
  );
}

function GenericMenu({ user }: { user: SupabaseUser | null }) {
  if (user) return null;

  return (
    <div className="flex flex-row items-center gap-2">
      <Button asChild variant="secondary" className="border">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild variant="outline" className="border">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
