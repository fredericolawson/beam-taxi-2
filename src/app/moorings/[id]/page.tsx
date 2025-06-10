import { getMooringById } from '@/lib/tables/moorings';
import { deleteMooring } from '@/lib/tables/moorings-legacy';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { LocationDisplay } from '@/components/maps';
import { getUserServer } from '@/lib/utils/get-user-server';
import type { CompleteMooring, Mooring } from '@/types/mooring';
import { User } from '@supabase/supabase-js';
import { SendMessage } from '@/components/send-message';

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
        <div className="flex flex-grow flex-col gap-4 md:w-1/2">
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between gap-2 md:flex-row">
                <CardTitle className="text-3xl">{mooring.name}</CardTitle>
                <Badge variant={mooring.is_available ? 'default' : 'destructive'}>
                  {mooring.is_available ? 'Available' : 'Unavailable'}
                </Badge>
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
            </CardContent>
            <CardFooter className="mt-auto w-full">
              <OwnerActions mooring={mooring} user={user} />
            </CardFooter>
          </Card>
          <SendMessage object={mooring} user={user} />
        </div>

        <div className="flex flex-col gap-4 md:w-1/2">
          <LocationDisplay latitude={mooring.latitude!} longitude={mooring.longitude!} />
          <Coordinates lng={mooring.longitude} lat={mooring.latitude} />
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

function Coordinates({ lng, lat }: { lng: number | null; lat: number | null }) {
  if (!lng || !lat) return null;
  return (
    <div className="card-container flex flex-col justify-between gap-4 md:flex-row">
      <div>
        <h3 className="mb-2 font-semibold">Coordinates</h3>
        <div className="flex gap-2">
          <Badge variant="secondary">{lat.toFixed(6)}</Badge>
          <Badge variant="secondary">{lng.toFixed(6)}</Badge>
        </div>
      </div>
      <Button asChild variant="outline">
        <Link href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank">
          <ExternalLink className="h-4 w-4" />
          View on Google Maps
        </Link>
      </Button>
    </div>
  );
}

function OwnerActions({ mooring, user }: { mooring: Mooring; user: User | null }) {
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
