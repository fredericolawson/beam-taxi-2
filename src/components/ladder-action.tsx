'use client';

import { Match } from '@/types';
import { Button } from './ui/button';
import { CalendarIcon, CheckCircle, Loader2, PlusCircle } from 'lucide-react';

export function LadderAction({
  isPlayable,
  pendingMatch,
  pendingMatchLoading,
}: {
  isPlayable: boolean;
  pendingMatch: Match | null;
  pendingMatchLoading: boolean;
}) {
  if (pendingMatchLoading) return <Loading />;
  if (isPlayable && !pendingMatch) return <ChallengePlayerButton />;
  if (pendingMatch && !pendingMatch.matchDate) return <ScheduleMatchButton />;
  if (pendingMatch) return <CompleteMatchButton />;

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

function ScheduleMatchButton() {
  return (
    <Button variant="default" size="sm" className="w-38">
      <CalendarIcon className="h-4 w-4" />
      Schedule Match
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
      <Loader2 className="text-secondary h-4 w-4 animate-spin" />
    </div>
  );
}
