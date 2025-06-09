import Link from 'next/link';
import type { Request } from '@/types/request';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';

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
          <RequestType requestType={request.request_type} />
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <RequestDescription description={request.description} />
          <ExpiresOn expiresOn={request.expires_on} />
        </CardContent>
      </Card>
    </Link>
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
