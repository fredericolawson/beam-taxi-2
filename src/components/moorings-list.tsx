import Link from 'next/link';
import type { Mooring } from '@/types/mooring';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MiniMap } from './maps';
import { Badge } from './ui/badge';

export function MooringsList({ moorings }: { moorings: Mooring[] }) {
  if (moorings.length === 0) return <div>No moorings found</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {moorings.map((mooring) => (
        <MooringCard key={mooring.id} mooring={mooring} />
      ))}
    </div>
  );
}

function MooringCard({ mooring }: { mooring: Mooring }) {
  return (
    <Link
      href={`/moorings/${mooring.id}`}
      key={mooring.id}
      className="flex h-full min-h-[250px] flex-row rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="flex w-2/3 flex-col gap-6 py-6 text-sm">
        <CardHeader>
          <CardTitle>{mooring.name}</CardTitle>
          <CardDescription>{mooring.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <Location mooring={mooring} />
        </CardContent>
        <CardFooter className="flex-col items-start">
          <Finance mooring={mooring} />
        </CardFooter>
      </div>
      <div className="w-1/3">
        <MiniMap longitude={mooring.longitude!} latitude={mooring.latitude!} />
      </div>
    </Link>
  );
}

function Location({ mooring }: { mooring: Mooring }) {
  if (!mooring.location_description) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-muted-foreground text-xs capitalize">Location</div>
      <div className="text-muted-foreground">{mooring.location_description}</div>
    </div>
  );
}

function Finance({ mooring }: { mooring: Mooring }) {
  if (!mooring.price_per_month || !mooring.commitment_term) return null;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-lg font-semibold">${mooring.price_per_month}/month</p>
      <Badge variant="outline">Term: {mooring.commitment_term}</Badge>
    </div>
  );
}
