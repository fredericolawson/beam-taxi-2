import { User as SupabaseUser } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from './ui/button';
import { getUserServer } from '@/lib/utils/get-user-server';
import { User as UserIcon } from 'lucide-react';
import { ProfileSheet } from './profile-sheet';
import { getPlayerByUserId } from '@/lib/tables/players';
import type { Player } from '@/types';

export async function Header() {
  const user = await getUserServer();
  const player = await getPlayerByUserId(user?.id ?? '');
  return (
    <header className="flex items-center justify-between border-b bg-white p-6">
      <div className="mr-4 flex">
        <Link href="/" className="mr-6 flex flex-col">
          <span className="text-2xl font-bold">CBTC Tennis Ladder</span>
          <span className="label">Tennis Ladder for the Coral Beach & Tennis Club</span>
        </Link>
      </div>
      <div className="items-top flex flex-1 flex-col justify-end gap-2 md:flex-row">
        <ProfileMenu player={player} />
        <GenericMenu user={user} />
      </div>
    </header>
  );
}

function ProfileMenu({ player }: { player: Player | null }) {
  if (!player) return null;

  return (
    <ProfileSheet player={player}>
      <Button variant="secondary">
        <UserIcon />
        {player.firstName} {player.lastName.charAt(0)}
      </Button>
    </ProfileSheet>
  );
}

function GenericMenu({ user }: { user: SupabaseUser | null }) {
  if (user) return null;

  return (
    <div className="flex flex-col items-center gap-2 md:flex-row">
      <Button asChild variant="outline">
        <Link href="/auth/login">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
