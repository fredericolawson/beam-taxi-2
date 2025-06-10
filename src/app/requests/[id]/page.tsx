import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequestById } from '@/lib/tables/requests';
import { getUserServer } from '@/lib/utils/get-user-server';
import { Request } from '@/types/request';
import { User } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Anchor, Clock } from 'lucide-react';

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequestById(id);
  if (!request) notFound();
  const user = await getUserServer();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <RequestHeader request={request} />
          <RequestDescription request={request} />
          <RequestDetails request={request} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PricingCard request={request} />
          <TimelineCard request={request} />
          <OwnerActions request={request} user={user} />
        </div>
      </div>
    </div>
  );
}

function RequestHeader({ request }: { request: Request }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">Mooring Request</CardTitle>
          </div>
          <RequestTypeBadge requestType={request.request_type} />
        </div>
      </CardHeader>
    </Card>
  );
}

function RequestTypeBadge({ requestType }: { requestType: string }) {
  const variants = {
    'walk-on': 'default' as const,
    swing: 'secondary' as const,
    either: 'outline' as const,
  };

  return (
    <Badge variant={variants[requestType as keyof typeof variants] || 'outline'}>
      <Anchor className="mr-1 h-3 w-3" />
      {requestType}
    </Badge>
  );
}

function RequestDescription({ request }: { request: Request }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{request.description}</p>
      </CardContent>
    </Card>
  );
}

function RequestDetails({ request }: { request: Request }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mooring Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Anchor className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">Boat Length:</span>
          <span>{request.boat_length} feet</span>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({ request }: { request: Request }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-4 w-4" />
          Price Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">From:</span>
            <span className="font-medium">${request.price_from}/month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">To:</span>
            <span className="font-medium">${request.price_to}/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCard({ request }: { request: Request }) {
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-4 w-4" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Preferred Start</span>
          <span className="font-medium">{formatDate(request.start_date)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Request Expires</span>
          <span className="font-medium">{formatDate(request.expires_on)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Posted</span>
          <span className="font-medium">{formatDate(request.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function OwnerActions({ request, user }: { request: Request; user: User | null }) {
  const isOwner = user?.id === request.owner_id;
  if (!isOwner) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-4 w-4" />
          Manage Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/requests/${request.id}/edit`}>Edit Request</Link>
        </Button>
        <form
          action={async () => {
            'use server';
            console.log('deleting request', request.id);
          }}
        >
          <Button type="submit" variant="destructive" className="w-full">
            Delete Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
