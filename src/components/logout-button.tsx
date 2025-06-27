'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { revalidate } from '@/actions/revalidate';
import { useTransition } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function LogoutButton({ user }: { user: SupabaseUser | null }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await revalidate('/');
    router.push('/');
  };

  if (!user) return null;

  return (
    <Button variant="secondary" onClick={() => startTransition(logout)} disabled={isPending} className="border">
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Logout
    </Button>
  );
}
