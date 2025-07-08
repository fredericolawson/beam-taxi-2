'use client';

import { sendTripRequest } from '@/lib/telegram-messages';
import { Button } from '@/components/ui/button';

export default function TestTripPage() {
  const handleSendTripRequest = async () => {
    await sendTripRequest('edfc1868-aa78-48ea-8801-5f0102b97f36');
  };
  return (
    <div>
      <Button onClick={handleSendTripRequest}>Send Trip Request</Button>
    </div>
  );
}
