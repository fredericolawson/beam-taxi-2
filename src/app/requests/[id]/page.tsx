import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getRequestById } from '@/lib/tables/requests';
import { getUserServer } from '@/lib/utils/get-user-server';
import { Request } from '@/types/request';
import { User } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Anchor, Clock } from 'lucide-react';
import { SendMessage } from '@/components/send-message';

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequestById(id);
  if (!request) notFound();
  const user = await getUserServer();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-8">
        <RequestHeader request={request} />

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-grow flex-col gap-4 md:w-1/2">
            <RequestDescription request={request} />
            <RequestDetails request={request} />
            <SendMessage object={request} user={user} />
          </div>

          <div className="flex flex-col gap-4">
            <TimelineCard request={request} />
            <PricingCard request={request} />
            <OwnerActions request={request} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestHeader({ request }: { request: Request }) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Mooring Request</h1>
      </div>
      <RequestTypeBadge requestType={request.request_type} />
    </div>
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
        <CardTitle>Description</CardTitle>
        <CardDescription>What the requester is looking for in a mooring</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{request.description}</p>
      </CardContent>
    </Card>
  );
}

function RequestDetails({ request }: { request: Request }) {
  const formatRequestType = (type: string) => {
    switch (type) {
      case 'walk-on':
        return 'Walk on';
      case 'swing':
        return 'Swing';
      case 'either':
        return 'Either';
      default:
        return type;
    }
  };

  const formatHurricaneInsured = (insured: string) => {
    switch (insured) {
      case 'yes':
        return 'Yes';
      case 'no':
        return 'No';
      case 'either':
        return 'Either';
      default:
        return insured;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mooring Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Preferred Type:</span>
          <span className="font-medium">{formatRequestType(request.request_type)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Boat Length:</span>
          <span className="font-medium">{request.boat_length} feet</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Hurricane Insured:</span>
          <span className="font-medium">{formatHurricaneInsured(request.hurricane_insured)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({ request }: { request: Request }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Price Range
        </CardTitle>
        <CardDescription>Monthly pricing range for the mooring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">From:</span>
          <span className="font-medium">${request.price_from}/month</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">To:</span>
          <span className="font-medium">${request.price_to}/month</span>
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
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Timeline
        </CardTitle>
        <CardDescription>Important dates for this request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Preferred Start:</span>
          <span className="font-medium">{formatDate(request.start_date)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Request Expires:</span>
          <span className="font-medium">{formatDate(request.expires_on)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Posted:</span>
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
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Manage Request
        </CardTitle>
        <CardDescription>Edit or delete your mooring request</CardDescription>
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
