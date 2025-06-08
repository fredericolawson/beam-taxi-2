import type { Mooring } from '@/lib/tables/moorings-legacy';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon } from 'lucide-react';

export default function Moorings({ moorings }: { moorings: Mooring[] }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <header className="mb-8 flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="heading-1">My Moorings</h1>
        <Button asChild variant="outline">
          <Link href="/moorings/new">List a New Mooring</Link>
        </Button>
      </header>

      <main className="w-full max-w-5xl">
        {moorings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moorings.map((mooring) => (
              <MooringCard key={mooring.id} mooring={mooring} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
            <p className="mb-4">You haven&apos;t listed any moorings yet.</p>
            <Button asChild>
              <Link href="/moorings/new">List Your First Mooring</Link>
            </Button>
          </div>
        )}
      </main>

      {/* Link back to main account page */}
      <div className="mt-8">
        <Button variant="link" asChild>
          <Link href="/account">{'<'} Back to Account</Link>
        </Button>
      </div>
    </div>
  );
}

function MooringCard({ mooring }: { mooring: Mooring }) {
  return (
    <Card key={mooring.id} className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{mooring.name}</CardTitle>
          <Badge variant={mooring.is_available ? 'default' : 'secondary'} className="whitespace-nowrap">
            {mooring.is_available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        <CardDescription>{mooring.location_description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {mooring.price_per_month ? (
          <p className="text-lg font-semibold">${mooring.price_per_month}/month</p>
        ) : (
          <p className="text-sm text-gray-500">Price not listed</p>
        )}
        <p className="text-sm text-gray-600 capitalize">Term: {mooring.commitment_term || 'Not specified'}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/moorings/${mooring.id}/edit`}>Edit</Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/moorings/${mooring.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
