'use client';

import { Button } from '@/components/ui/button';

export default function TestTripPage() {
  const handleSendTripRequest = async () => {
    return null;
  };
  return (
    <div>
      <Button onClick={handleSendTripRequest}>Send Trip Request</Button>
    </div>
  );
}
