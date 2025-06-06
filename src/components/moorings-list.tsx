import Link from 'next/link';
import type { CompleteMooring } from '@/types/mooring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MooringsList({ moorings }: { moorings: CompleteMooring[] }) {
  if (moorings.length === 0) return <div>No moorings found</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {moorings.map((mooring) => (
        <Link href={`/moorings/${mooring.id}`} key={mooring.id}>
          <Card className="h-full transition-shadow duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle>{mooring.name}</CardTitle>
              <CardDescription>{mooring.location_description}</CardDescription>
            </CardHeader>
            <CardContent>
              {mooring.price_per_month ? (
                <p className="text-lg font-semibold">${mooring.price_per_month}/month</p>
              ) : (
                <p className="text-muted-foreground text-sm">Price not listed</p>
              )}
              <p className="text-muted-foreground text-sm capitalize">Term: {mooring.commitment_term || 'Not specified'}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
