'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cancelTrip } from '@/actions/trip';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CancelTrip({ trip_id }: { trip_id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = async () => {
    setIsLoading(true);
    await cancelTrip({ trip_id });
    toast.success('Trip cancelled');
    setIsLoading(false);
  };
  return (
    <Button variant="outline" className="mt-auto" onClick={handleCancel} disabled={isLoading}>
      {isLoading ? <Loader2 className="animate-spin" /> : 'Cancel'}
    </Button>
  );
}
