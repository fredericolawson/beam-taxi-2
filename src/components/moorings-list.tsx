import Link from 'next/link';
import type { CompleteMooring } from '@/types/mooring';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MiniMap } from './maps';

export function MooringsList({ moorings }: { moorings: CompleteMooring[] }) {
  if (moorings.length === 0) return <div>No moorings found</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {moorings.map((mooring) => (
        <Link href={`/moorings/${mooring.id}`} key={mooring.id} className="flex flex-row">
          <Card className="h-full min-h-[250px] w-2/3 text-sm transition-shadow duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle>{mooring.name}</CardTitle>
              <CardDescription>{mooring.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Location mooring={mooring} />
            </CardContent>
            <CardFooter className="flex-col items-start">
              <p className="text-lg font-semibold">${mooring.price_per_month}/month</p>
              <p className="text-muted-foreground text-sm capitalize">Term: {mooring.commitment_term}</p>
            </CardFooter>
          </Card>
          <div className="w-1/3">
            <MiniMap longitude={mooring.longitude!} latitude={mooring.latitude!} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function Location({ mooring }: { mooring: CompleteMooring }) {
  if (!mooring.location_description) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-muted-foreground text-xs capitalize">Location</div>
      <div className="text-muted-foreground">{mooring.location_description}</div>
    </div>
  );
}
