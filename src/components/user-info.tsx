import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail } from 'lucide-react';
import { UserIcon } from 'lucide-react';
import { LogoutButton } from './logout-button';
import type { Player } from '@/types';

export function UserInfo({ user, player }: { user: User | null; player: Player }) {
  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {player.firstName} {player.lastName}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> {user.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <p className="label">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="label">Phone</p>
              <p className="text-sm font-medium">{player.phone}</p>
            </div>

            <div className="space-y-1">
              <p className="label">Created At</p>
              <p className="text-sm font-medium">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="label">Last Sign In</p>
              <p className="text-sm font-medium">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <LogoutButton user={user} />
      </CardFooter>
    </Card>
  );
}
