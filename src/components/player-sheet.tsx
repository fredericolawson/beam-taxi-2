'use client';

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { CompletedMatch, Match, Player } from '@/types';
import { PlayerMatchesTable } from './player-matches-table';
import { MatchHistorySummary } from './match-history';
import { Challenge } from './challenge';
import { useEffect, useState, useCallback } from 'react';
import { revalidate } from '@/actions/revalidate';
import { getMatchesByPlayerId } from '@/lib/tables/matches';
import { Button } from './ui/button';

type History = {
  matches: CompletedMatch[];
  summary: string[];
};

export function PlayerSheet({
  player,
  currentPlayer,
  pendingMatch,
  open,
  onOpenChange,
  refreshMatch,
}: {
  player: Player;
  currentPlayer: Player;
  pendingMatch: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshMatch: () => void;
}) {
  const { history, fetchHistory } = useMatchHistory({ playerId: player.id });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="bg-muted flex !max-w-xl flex-col md:p-4">
        <SheetHeader className="border-b">
          <SheetTitle className="text-2xl font-bold">{player.displayName}</SheetTitle>
          <MatchHistorySummary historySummary={history.summary} />
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <Challenge
            player={player}
            currentPlayer={currentPlayer}
            refreshMatch={refreshMatch}
            pendingMatch={pendingMatch}
            fetchHistory={fetchHistory}
          />
          <PlayerMatchesTable matches={history.matches} player={player} />
        </div>
        <SheetFooter className="border-t">
          <Button variant="secondary" className="border" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function useMatchHistory({ playerId }: { playerId: string }) {
  const [history, setHistory] = useState<History>({ matches: [], summary: [] });

  const fetchHistory = useCallback(async () => {
    const matches = await getMatchesByPlayerId({ playerId });
    const completedMatches = matches.filter((match) => match.winnerId !== null);
    const historySummary = completedMatches.map((match) => (match.winnerId === playerId ? 'W' : 'L'));
    const history = { matches: completedMatches as CompletedMatch[], summary: historySummary };
    setHistory(history);
  }, [playerId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, fetchHistory };
}
