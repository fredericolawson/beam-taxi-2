import Link from 'next/link';
import type { Request } from '@/types/request';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { Anchor, Calendar, MapPin, Shield, Ruler, DollarSign } from 'lucide-react';

export function RequestsList({ requests }: { requests: Request[] }) {
  if (requests.length === 0) return <div>No requests found</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}

function RequestCard({ request }: { request: Request }) {
  return (
    <Link href={`/requests/${request.id}`} key={request.id} className="block h-full">
      <Card className="h-full min-h-[250px] transition-shadow duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle>{request.description}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardItem icon={<MapPin />} label="Preferred Location" value={request.preferred_location} />
          <div className="flex gap-2">
            <CardItem icon={<Anchor />} label="Mooring Type" value={request.request_type} />
            <CardItem icon={<Ruler />} label="Boat LOA (ft)" value={request.boat_length} />
          </div>
          <CardItem icon={<Shield />} label="Hurricane Insured" value={request.hurricane_insured} />
          <div className="flex gap-2">
            <CardItem
              icon={<Calendar />}
              label="Preferred Start"
              value={request.start_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
            <CardItem icon={<DollarSign />} label="Max Budget" value={`$${request.price_to}`} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CardItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted flex w-full items-center gap-2 rounded-md p-2">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex w-full flex-col gap-1">
        <span className="label text-xs">{label}</span>
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
}

function RequestType({ requestType }: { requestType: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs">Request Type</span>
      <Badge>{requestType}</Badge>
    </div>
  );
}

function RequestDescription({ description }: { description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs">Description</span>
      <span className="text-sm">{description}</span>
    </div>
  );
}

function ExpiresOn({ expiresOn }: { expiresOn: Date }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs">Expires On</span>
      <span className="text-sm">{expiresOn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>
  );
}
