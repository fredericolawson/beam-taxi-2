import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, User, Timer, Route } from 'lucide-react';
import RouteMap from '@/app/trips/components/route-map';
import type { Trip } from '@/types';

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

function TripMetadata({ trip }: { trip: Trip }) {
  const date = new Date(trip.requested_at);

  return (
    <div className="space-y-3 border-t pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="text-accent h-4 w-4" />
          <span className="text-lg font-semibold">${trip.offer_amount}</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span>{trip.duration} min</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2">
          <Route className="h-4 w-4" />
          <span>{trip.distance} km</span>
        </div>
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

function getStatusColor(status: Trip['status']) {
  switch (status) {
    case 'pending':
      return 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30';
    case 'assigned':
      return 'bg-accent/20 text-accent-foreground hover:bg-accent/30';
    case 'cancelled':
      return 'bg-muted text-muted-foreground hover:bg-muted';
    default:
      return 'bg-muted text-muted-foreground hover:bg-muted';
  }
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-3">
              <TripLocation type="pickup" address={trip.pickup_address} />
              <TripLocation type="destination" address={trip.destination_address} />
            </div>

            <TripMetadata trip={trip} />

            {trip.driver && <DriverInfo driver={trip.driver} />}
          </div>

          <div className="lg:pl-4">
            <div className="bg-muted/20 overflow-hidden rounded-lg border">
              <RouteMap
                pickup={{ lat: trip.pickup_lat, lng: trip.pickup_lng }}
                destination={{ lat: trip.destination_lat, lng: trip.destination_lng }}
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
