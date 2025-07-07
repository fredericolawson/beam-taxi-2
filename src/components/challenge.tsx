'use client';

import { Match, Player } from '@/types';
import { RecordMatchResult } from './record-match-result';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { SiWhatsapp } from 'react-icons/si';
import { CalendarIcon, Loader2, MailIcon, PhoneIcon } from 'lucide-react';
import { checkPlayable } from '@/lib/utils/player-utils';
import { useState } from 'react';
import { challengePlayer, setMatchDate } from '@/actions/match';

import Calendar20 from './calendar-20';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import { Loading } from './loading';
import { sendMatchConfirmation } from '@/actions/email';
import { toast } from 'sonner';

export function Challenge({
  player,
  currentPlayer,
  refreshMatch,
  pendingMatch,
  fetchHistory,
}: {
  player: Player;
  currentPlayer: Player;
  refreshMatch: () => void;
  pendingMatch: Match | null;
  fetchHistory: () => void;
}) {
  return (
    <>
      <ChallengePlayer player={player} currentPlayer={currentPlayer} pendingMatch={!!pendingMatch} refresh={refreshMatch} />
      <ScheduleMatch player={player} pendingMatch={pendingMatch} refreshMatch={refreshMatch} />
      <RecordMatchResult match={pendingMatch} key={pendingMatch?.id} refresh={refreshMatch} fetchHistory={fetchHistory} />
    </>
  );
}

function ChallengePlayer({
  player,
  currentPlayer,
  pendingMatch,
  refresh,
}: {
  player: Player;
  currentPlayer: Player;
  pendingMatch: boolean;
  refresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const isPlayable = checkPlayable({ player, currentPlayer });

  if (!isPlayable || pendingMatch) return null;

  const createMatch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await challengePlayer({ challengerId: currentPlayer.id, defenderId: player.id });
      if (error) setError(error);
      refresh(); // Refresh history after creating challenge
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenge player?</CardTitle>
        <CardDescription>
          Schedule a match against {player.displayName}. If you win, you&apos;ll take their place in the ladder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={createMatch} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Schedule Match'}
        </Button>
      </CardContent>
    </Card>
  );
}

function ScheduleMatch({ player, pendingMatch, refreshMatch }: { player: Player; pendingMatch: Match | null; refreshMatch: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!pendingMatch) return null;
  if (isLoading) return <Loading />;

  const onConfirm = async (date: Date, time: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await setMatchDate({ matchId: pendingMatch.id, matchDate: `${date.toISOString()}T${time}:00` });
      if (error) setError(error);
      refreshMatch();
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const onReschedule = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await setMatchDate({ matchId: pendingMatch.id, matchDate: null });
      if (error) setError(error);
      refreshMatch();
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your Match</CardTitle>
        <CardDescription>
          Use the contact details below to arrange a time with your opponent to play your match, set the time and date and click confirm to
          schedule.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <PlayerPhone player={player} />
          <PlayerEmail player={player} />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Button variant="secondary" className="flex-1 border" asChild>
              <a href={`https://wa.me/${player.phone}`} target="_blank">
                <SiWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button variant="secondary" className="flex-1" asChild>
              <a href={`tel:${player.phone}`} target="_blank">
                <PhoneIcon className="h-4 w-4" />
                Call
              </a>
            </Button>
            <Button variant="secondary" className="flex-1" asChild>
              <a href={`mailto:${player.email}`} target="_blank">
                <MailIcon className="h-4 w-4" />
                Email
              </a>
            </Button>
          </div>
        </div>
        <Separator />
        <Calendar20 onConfirm={onConfirm} matchDate={pendingMatch.matchDate} />
        <MatchDate matchDate={pendingMatch.matchDate} onReschedule={onReschedule} />
      </CardContent>
    </Card>
  );
}

function MatchDate({ matchDate, onReschedule }: { matchDate: string | null; onReschedule: () => void }) {
  if (!matchDate) return null;
  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-xs">Scehduled Match Date</span>
        {format(new Date(matchDate), 'EEEE d MMMM yyyy HH:mm a')}
      </div>
      <Button variant="default" className="" onClick={onReschedule}>
        <CalendarIcon className="h-4 w-4" />
        Reschedule
      </Button>
    </div>
  );
}

function PlayerPhone({ player }: { player: Player }) {
  return (
    <div className="flex w-full flex-col gap-1 text-sm">
      <span className="text-xs">Phone</span>
      <span className="bg-muted rounded-md p-2">{player.phone}</span>
    </div>
  );
}

function PlayerEmail({ player }: { player: Player }) {
  return (
    <div className="flex w-full flex-col gap-1 text-sm">
      <span className="text-xs">Email</span>
      <span className="bg-muted rounded-md p-2">
        <a href={`mailto:${player.email}`}>{player.email}</a>
      </span>
    </div>
  );
}
