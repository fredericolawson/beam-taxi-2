import { getUserServer } from '@/lib/utils/get-user-server';
import { LogoutButton } from '@/components/logout-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default async function AccountPage() {
  const user = await getUserServer();
  if (!user) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="heading-1">Profile</h1>

      <Card className="mb-6 w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Email:</span>
            <span className="text-muted-foreground text-sm">{user.email || 'Not provided'}</span>
          </div>
          {user.user_metadata?.name && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-muted-foreground text-sm">{user.user_metadata.name}</span>
            </div>
          )}
          {user.user_metadata?.phone && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Phone:</span>
              <span className="text-muted-foreground text-sm">{user.user_metadata.phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">User ID:</span>
            <span className="text-muted-foreground font-mono text-sm">{user.id}</span>
          </div>
        </CardContent>
        <CardFooter>
          <LogoutButton user={user} />
        </CardFooter>
      </Card>
    </div>
  );
}
