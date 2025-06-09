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
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getRequestTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'walk-on':
        return 'default';
      case 'swing':
        return 'secondary';
      case 'either':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Link href={`/requests/${request.id}`} key={request.id} className="block h-full">
      <Card className="h-full min-h-[250px] transition-shadow duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">{request.name}</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">{request.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div>
            <Badge variant={getRequestTypeBadgeVariant(request.request_type)}>{request.request_type}</Badge>
          </div>

          <div className="text-sm">
            <div className="text-muted-foreground font-medium">Start Date Range</div>
            <div>
              {formatDate(request.start_from)} - {formatDate(request.start_to)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
