import { User as SupabaseUser } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from './ui/button';
import { getUserServer } from '@/lib/utils/get-user-server';
import { HomeIcon, PlusCircleIcon, PlusIcon, ShieldIcon, TrophyIcon, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

export async function Header() {
  const user = await getUserServer();

  return (
    <header className="border-accent relative mb-8 flex w-full flex-col items-start justify-between border-b p-8 md:flex-row md:items-center md:justify-center">
      <Logo />
      <div className="absolute inset-y-0 right-4 flex items-center">
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
function Logo() {
  return (
    <Link href="/" className="font-heading flex flex-col gap-1 md:items-center">
      <h1 className="text-6xl">beam</h1>
      <p className="text-accent px-1 text-sm tracking-widest uppercase">bermuda</p>
    </Link>
  );
}

async function ProfileMenu({ user }: { user: SupabaseUser | null }) {
  if (!user) return null;

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row">
      <Button variant="secondary" size="lg" asChild className="border">
        <Link href={`/profile`}>
          <UserIcon />
          Profile
        </Link>
      </Button>
      <Button variant="accent" size="lg" asChild className="border">
        <Link href={`/trips/new`}>
          <PlusCircleIcon />
          New Trip
        </Link>
      </Button>
    </div>
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
