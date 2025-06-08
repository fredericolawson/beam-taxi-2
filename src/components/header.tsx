import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { User as SupabaseUser } from '@supabase/supabase-js';
import { LogoutButton } from './logout-button';
import { UserIcon } from 'lucide-react';

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between border-b bg-white p-6">
      <div className="mr-4 flex">
        <Link href="/" className="mr-6 flex flex-col">
          <span className="text-2xl font-bold">Hey Buoy</span>
          <span className="text-muted-foreground text-sm">The home of Bermuda Moorings</span>
        </Link>
      </div>
      <div className="items-top flex flex-1 flex-col justify-end gap-2 md:flex-row">
        <UserMenu user={user} />
        <Button asChild variant="secondary" size="sm">
          <Link href="/moorings/request">Request a Mooring</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/moorings/new">List a Mooring</Link>
        </Button>
      </div>
    </header>
  );
}

function UserMenu({ user }: { user: SupabaseUser | null }) {
  if (!user)
    return (
      <Button asChild size="sm">
        <Link href="/auth/login">Login</Link>
      </Button>
    );

  const userInitial = user.email?.charAt(0).toUpperCase() ?? '?';
  return (
    <div className="flex flex-col items-center items-end gap-2 md:flex-row">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">
              <UserIcon className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
