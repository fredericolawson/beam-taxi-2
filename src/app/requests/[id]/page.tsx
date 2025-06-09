import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequestById } from '@/lib/tables/requests';
import { getUserServer } from '@/lib/utils/get-user-server';
import { Request } from '@/types/request';
import { User } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequestById(id);
  if (!request) notFound();
  const user = await getUserServer();
  return (
    <div className="flex-grow flex-col items-center justify-center">
      <div className="flex min-h-[600px] w-full flex-grow flex-col gap-4 md:flex-row">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <div className="flex flex-col justify-between gap-2 md:flex-row">
              <CardTitle className="text-3xl">{request.name}</CardTitle>
              <Badge variant={request.request_type === 'walk-on' ? 'default' : 'destructive'}>{request.request_type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="">{request.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Details</h3>
            </div>
          </CardContent>
          <CardFooter className="mt-auto w-full">
            <OwnerActions request={request} user={user} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function OwnerActions({ request, user }: { request: Request; user: User | null }) {
  const isOwner = user?.id === request.owner_id;
  if (!isOwner) return null;

  return (
    <div className="flex w-full space-x-4 border-t pt-4">
      <Button asChild variant="outline">
        <Link href={`/requests/${request.id}/edit`}>Edit</Link>
      </Button>
      <form
        action={async () => {
          'use server';
          console.log('deleting request', request.id);
        }}
      >
        <Button type="submit" variant="destructive">
          Delete
        </Button>
      </form>
    </div>
  );
}
