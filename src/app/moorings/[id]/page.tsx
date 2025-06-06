import { getMooringById, deleteMooring } from '@/lib/tables/moorings-legacy';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationDisplay } from '@/components/location-display';

type MooringDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MooringDetailPage({ params }: MooringDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const mooring = await getMooringById(id);

  if (!mooring) notFound();
  const isOwner = user?.id === mooring.owner_id;

  // Check if location coordinates are available
  const hasLocation = mooring.latitude && mooring.longitude;

  return (
    <div className="my-auto flex flex-col items-center justify-center px-4">
      <div className="flex min-h-[600px] w-full flex-grow flex-row gap-4">
        <Card className="w-1/2 flex-grow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{mooring.name}</CardTitle>
              <Badge variant={mooring.is_available ? 'default' : 'destructive'}>{mooring.is_available ? 'Available' : 'Unavailable'}</Badge>
            </div>
            <CardDescription>{mooring.location_description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Map */}
            {hasLocation && (
              <div>
                <h3 className="mb-3 font-semibold">Location</h3>
              </div>
            )}

            {mooring.description && (
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700">{mooring.description}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Details</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {mooring.price_per_month && <li>Price: ${mooring.price_per_month}/month</li>}
                {mooring.commitment_term && <li className="capitalize">Commitment: {mooring.commitment_term}</li>}
                {hasLocation && (
                  <li>
                    Coordinates: {mooring.latitude!.toFixed(6)}, {mooring.longitude!.toFixed(6)}
                  </li>
                )}
              </ul>
            </div>
            {/* Owner Actions */}
            {isOwner && (
              <div className="mt-6 flex space-x-4 border-t pt-4">
                <Button asChild variant="outline">
                  <Link href={`/moorings/${mooring.id}/edit`}>Edit</Link>
                </Button>
                {/* Delete requires a form to trigger the server action */}
                <form
                  action={async () => {
                    'use server';
                    // Add confirmation dialog in real UI
                    await deleteMooring(mooring.id);
                    // Redirect handled within deleteMooring action
                  }}
                >
                  <Button type="submit" variant="destructive">
                    Delete
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="w-1/2">
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
