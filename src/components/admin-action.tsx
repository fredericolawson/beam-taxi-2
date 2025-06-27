'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowUp } from 'lucide-react';
import { updatePlayerApproval, increasePlayerRank } from '@/lib/tables/players';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminActionProps {
  playerId: string;
  isApproved: boolean;
  currentRank: number;
}

export function AdminAction({ playerId, isApproved, currentRank }: AdminActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprovalToggle = async () => {
    setLoading(true);
    const success = await updatePlayerApproval(playerId, !isApproved);
    if (success) {
      router.refresh();
    }
    setLoading(false);
  };

  const handleRankIncrease = async () => {
    setLoading(true);
    const success = await increasePlayerRank(playerId);
    if (success) {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <Button variant={isApproved ? 'outline' : 'default'} size="sm" className="w-28" onClick={handleApprovalToggle} disabled={loading}>
        {isApproved ? (
          <>
            <XCircle className="h-4 w-4" />
            Unapprove
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            Approve
          </>
        )}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="w-20"
        onClick={handleRankIncrease}
        disabled={loading || currentRank <= 1}
        title={currentRank <= 1 ? 'Already at top rank' : 'Increase rank'}
      >
        <ArrowUp className="h-4 w-4" />
        Rank
      </Button>
    </div>
  );
}
