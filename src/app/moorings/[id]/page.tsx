import { getMooringById } from '@/lib/tables/moorings';
import { deleteMooring } from '@/lib/tables/moorings-legacy';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationDisplay } from '@/components/maps';
import { getUserServer } from '@/lib/utils/get-user-server';
import type { CompleteMooring } from '@/types/mooring';
import { User } from '@supabase/supabase-js';

type MooringDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MooringDetailPage({ params }: MooringDetailPageProps) {
  const { id } = await params;
  const mooring = await getMooringById(id);
  if (!mooring) notFound();
  const user = await getUserServer();

  return (
    <div className="my-auto flex flex-col items-center justify-center">
      <div className="flex min-h-[600px] w-full flex-grow flex-col gap-4 md:flex-row">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <div className="flex flex-col justify-between gap-2 md:flex-row">
              <CardTitle className="text-3xl">{mooring.name}</CardTitle>
              <Badge variant={mooring.is_available ? 'default' : 'destructive'}>{mooring.is_available ? 'Available' : 'Unavailable'}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="">{mooring.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Details</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Price: ${mooring.price_per_month}/month</li>
                <li className="capitalize">Commitment: {mooring.commitment_term}</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Coordinates</h3>
              <div className="flex gap-2">
                <Badge variant="secondary">{mooring.latitude!.toFixed(6)}</Badge>
                <Badge variant="secondary">{mooring.longitude!.toFixed(6)}</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto w-full">
            <OwnerActions mooring={mooring} user={user} />
          </CardFooter>
        </Card>

        <div className="md:w-1/2">
          <LocationDisplay latitude={mooring.latitude!} longitude={mooring.longitude!} />
        </div>
      </div>

      <div className="mt-6">
        <Button asChild variant="link">
          <Link href="/">{'<'} Back to Listings</Link>
        </Button>
      </div>
    </div>
  );
}

async function OwnerActions({ mooring, user }: { mooring: CompleteMooring; user: User | null }) {
  const isOwner = user?.id === mooring.owner_id;
  if (!isOwner) return null;

  return (
    <div className="flex w-full space-x-4 border-t pt-4">
      <Button asChild variant="outline">
        <Link href={`/moorings/${mooring.id}/edit`}>Edit</Link>
      </Button>
      <form
        action={async () => {
          'use server';
          await deleteMooring(mooring.id);
        }}
      >
        <Button type="submit" variant="destructive">
          Delete
        </Button>
      </form>
    </div>
  );
}
