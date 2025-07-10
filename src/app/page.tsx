import { getUserServer } from '@/lib/utils/get-user-server';
import { getActiveTrips } from '@/actions/trip';
import { TripCard } from '@/components/trip-card';

export default async function Home() {
  const user = await getUserServer();
  const activeTrips = await getActiveTrips({ riderId: user!.id });

  return (
    <div className="flex w-full flex-col space-y-6">
      <h2 className="heading-2">Active Requests</h2>

      {activeTrips.length === 0 ? (
        <p className="text-muted-foreground">No active trips</p>
      ) : (
        <div className="space-y-4">
          {activeTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
