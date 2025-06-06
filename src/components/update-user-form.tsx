'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

export function UpdateInfoForm({ user, className, ...props }: React.ComponentPropsWithoutRef<'div'> & { user: User }) {
  const [firstName, setFirstName] = useState(user.user_metadata.first_name);
  const [lastName, setLastName] = useState(user.user_metadata.last_name);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ data: { first_name: firstName, last_name: lastName } });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push('/account');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex w-full flex-col gap-6', className)} {...props}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Update Your Profile</CardTitle>
          <CardDescription>Please enter your new information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save new information'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
