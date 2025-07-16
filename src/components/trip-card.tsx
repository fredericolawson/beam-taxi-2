import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, User, Timer, Route } from 'lucide-react';
import RouteMap from '@/app/trips/components/route-map';
import type { Trip } from '@/types';
import { useRouteMetrics } from '@/hooks/route-metrics';
import { RouteMetrics } from './route-metrics';

function TripLocation({ type, address }: { type: 'pickup' | 'destination'; address: string }) {
  const isPickup = type === 'pickup';
  const label = isPickup ? 'From' : 'To';

  return (
    <div className="flex items-start gap-3">
      <MapPin className="text-accent mt-0.5 h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
        <p className="text-sm leading-5 font-medium">{address}</p>
      </div>
    </div>
  );
}

function OfferAmount({ offerAmount }: { offerAmount: number }) {
  return (
    <div className="flex items-start gap-3">
      <DollarSign className="text-accent mt-0.5 h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Offer Amount</p>
        <p className="text-sm leading-5 font-medium">${offerAmount}</p>
      </div>
    </div>
  );
}

function DriverInfo({ driver }: { driver: { name: string; phone: string | null } }) {
  return (
    <div className="bg-muted/50 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <User className="text-accent h-4 w-4" />
        <div>
          <p className="text-sm font-medium">{driver.name}</p>
          {driver.phone && <p className="text-muted-foreground text-xs">{driver.phone}</p>}
        </div>
      </div>
    </div>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="space-y-6 pr-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 py-6">
            <div className="space-y-3">
              <TripLocation type="pickup" address={trip.pickup_address} />
              <TripLocation type="destination" address={trip.destination_address} />
              <OfferAmount offerAmount={trip.offer_amount} />
            </div>
            <RouteMetrics routeMetrics={{ distance: trip.distance * 1000, duration: trip.duration }} />
            {trip.driver && <DriverInfo driver={trip.driver} />}
          </div>
          <div className="bg-muted/20 overflow-hidden rounded-r-lg border">
            <RouteMap
              pickup={{ lat: trip.pickup_lat, lng: trip.pickup_lng }}
              destination={{ lat: trip.destination_lat, lng: trip.destination_lng }}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
