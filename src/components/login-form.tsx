'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { revalidate } from '@/actions/revalidate';
import { useState } from 'react';
export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Check if player record exists, create if not
      if (data.user) {
        const { data: existingPlayer } = await supabase.schema('ladder').from('players').select('id').eq('user_id', data.user.id).single();

        if (!existingPlayer) {
          // Create player record for users from shared authentication
          const { error: playerError } = await supabase.schema('ladder').from('players').insert({
            user_id: data.user.id,
            email: data.user.email,
            first_name: data.user.user_metadata.first_name,
            last_name: data.user.user_metadata.last_name,
            phone: data.user.user_metadata.phone,
          });

          if (playerError) {
            console.error('Player creation error:', playerError);
            // Don't throw error - user can still use the app
          }
        }
      }

      revalidate('/');
      router.push('/');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <Card>
        <CardHeader className="px-6">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your tennis ladder email & password to login to your account</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" variant="secondary" className="w-full border" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Joining the ladder for the first time?{' '}
              <Link href="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
