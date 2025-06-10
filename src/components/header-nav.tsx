'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserClient } from '@/lib/utils/get-user-client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CreateMooring from './main/create-mooring';
import CreateRequest from './main/create-request';
import { Button } from './ui/button';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function HeaderNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    getUserClient().then(setUser);
  }, []);

  return (
    <div className="items-top flex flex-1 flex-col justify-end gap-2 md:flex-row">
      <UserMenu user={user} />
      <GenericMenu user={user} />
    </div>
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
