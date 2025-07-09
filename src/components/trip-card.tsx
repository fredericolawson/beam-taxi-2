import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import RouteMap from '@/app/trips/components/route-map';
import type { Trip } from '@/types';

function TripLocation({ type, address }: { type: 'pickup' | 'destination'; address: string }) {
  const isPickup = type === 'pickup';

  const label = isPickup ? 'From' : 'To';

  return (
    <div className="flex items-start space-x-2">
      <MapPin className={`mt-1 h-4 w-4`} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground text-sm">{address}</p>
      </div>
    </div>
  );
}

function TripMetadata({ offerAmount, requestedAt }: { offerAmount: number; requestedAt: string | Date }) {
  const date = new Date(requestedAt);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4" />
        <span className="font-medium">${offerAmount}</span>
      </div>

      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-600" />
        <span className="text-muted-foreground text-sm">
          {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function DriverInfo({ driver }: { driver: { name: string; phone: string | null } }) {
  return (
    <div className="bg-muted mt-3 rounded-md p-3">
      <p className="font-medium">Driver: {driver.name}</p>
      <p className="text-muted-foreground text-sm">Phone: {driver.phone}</p>
    </div>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 md:flex-row">
        <div className="w-full">
          <TripLocation type="pickup" address={trip.pickup_address} />
          <TripLocation type="destination" address={trip.destination_address} />
          <TripMetadata offerAmount={trip.offer_amount} requestedAt={trip.requested_at} />
          {trip.driver && <DriverInfo driver={trip.driver} />}
        </div>
        <div className="w-full md:w-2/3">
          <RouteMap
            pickup={{ lat: trip.pickup_lat, lng: trip.pickup_lng }}
            destination={{ lat: trip.destination_lat, lng: trip.destination_lng }}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          />
        </div>
      </CardContent>
    </Card>
  );
}
