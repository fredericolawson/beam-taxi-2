import { Clock, MapPin } from 'lucide-react';

export function RouteMetrics({ routeMetrics }: { routeMetrics: { distance: number; duration: number } }) {
  const distance = (routeMetrics.distance / 1000).toFixed(0);
  const duration = routeMetrics.duration;
  return (
    <div className="bg-muted flex items-center gap-4 rounded-lg border p-3 text-sm">
      <div className="flex w-full items-center justify-center gap-2">
        <MapPin className="h-4 w-4" />
        <span>{distance} km</span>
      </div>
      <div className="bg-border h-4 w-1"></div>
      <div className="flex w-full items-center justify-center gap-2">
        <Clock className="h-4 w-4" />
        <span>{duration} min</span>
      </div>
    </div>
  );
}
