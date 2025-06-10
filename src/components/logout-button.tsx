'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { revalidate } from '@/actions/revalidate';
import { useTransition } from 'react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await revalidate('/');
    router.push('/');
  };

  return (
    <Button variant="outline" onClick={() => startTransition(logout)} disabled={isPending}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
      Sign Out
    </Button>
  );
}
