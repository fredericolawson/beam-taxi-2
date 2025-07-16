'use client';

import { useCallback, useState } from 'react';

export function useRouteMetrics() {
  const [isLoading, setIsLoading] = useState(false);
  const [routeMetrics, setRouteMetrics] = useState<{ distance: number; duration: number }>({ distance: 0, duration: 0 });

  const handleRouteCalculated = useCallback(({ distance, duration }: { distance: number; duration: number }) => {
    // Only update if values actually changed
    setRouteMetrics((prev) => {
      if (prev.distance === distance && prev.duration === duration) {
        return prev;
      }
      setIsLoading(true);
      return { distance, duration };
    });
    setIsLoading(false);
  }, []);

  return { routeMetrics, handleRouteCalculated, isLoading };
}
