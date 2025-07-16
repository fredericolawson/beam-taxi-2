import { getUserServer } from '@/lib/utils/get-user-server';
import { getActiveTrips } from '@/actions/trip';
import { TripCard } from '@/components/trip-card';
import { listTripsByRiderId } from '@/lib/tables/trips';
import { Trip } from '@/types';

export default async function Home() {
  const user = await getUserServer();
  const trips = await listTripsByRiderId({ riderId: user!.id });
  const assignedTrips = trips.filter((trip) => trip.status === 'assigned');
  const pendingTrips = trips.filter((trip) => trip.status === 'pending');

  return (
    <div className="flex w-full flex-col space-y-6">
      <TripList trips={assignedTrips} title="Assigned Trips" />
      <TripList trips={pendingTrips} title="Pending Trips" />
    </div>
  );
}
function TripList({ trips, title }: { trips: Trip[]; title: string }) {
  return (
    <div className="flex w-full flex-col space-y-6">
      <h2 className="heading-2">{title}</h2>

      {trips.length === 0 ? (
        <p className="text-muted-foreground">No active trips</p>
      ) : (
        <div className="flex flex-col gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
