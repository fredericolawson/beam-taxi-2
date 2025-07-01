'use client';

import { Button } from './ui/button';
import { CheckCircle, PlusCircle } from 'lucide-react';

import { LoadingSpinner } from './loading-spinner';

export function LadderAction({
  isPlayable,
  isPendingMatch,
  pendingMatchLoading,
}: {
  isPlayable: boolean;
  isPendingMatch: boolean;
  pendingMatchLoading: boolean;
}) {
  if (pendingMatchLoading) return <Loading />;
  if (isPendingMatch) return <CompleteMatchButton />;
  if (isPlayable && !isPendingMatch) return <ChallengePlayerButton />;

  return null;
}

function ChallengePlayerButton() {
  return (
    <Button variant="default" size="sm" className="w-38">
      <PlusCircle className="h-4 w-4" />
      Challenge Player
    </Button>
  );
}

function CompleteMatchButton() {
  return (
    <Button variant="secondary" size="sm" className="w-38">
      <CheckCircle className="h-4 w-4" />
      Submit Result
    </Button>
  );
}

function Loading() {
  return (
    <div className="flex w-38 items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
