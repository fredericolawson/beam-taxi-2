'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { useCallback, useEffect, useState } from 'react';
import { CompletedMatch, Match, Player } from '@/types';
import { cn } from '@/lib/utils';
import { MatchHistorySummary } from './match-history';
import { LadderAction } from './ladder-action';
import { PlayerSheet } from './player-sheet';
import { useRouter } from 'next/navigation';
import { checkPlayable } from '@/lib/utils/player-utils';
import { getBiMatches } from '@/actions/match';
import { format } from 'date-fns';

type History = {
  matches: CompletedMatch[];
  summary: string[];
};

export function LadderRow({ player, currentPlayer, history }: { player: Player; currentPlayer: Player; history: History }) {
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);
  const [pendingMatchLoading, setPendingMatchLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshMatch = useCallback(() => setRefreshTrigger((prev) => prev + 1), []);
  const isPlayable = checkPlayable({ player: player, currentPlayer: currentPlayer });

  useEffect(() => {
    const fetchMatch = async () => {
      setPendingMatchLoading(true);
      const matches = await getBiMatches({ challengerId: currentPlayer.id, defenderId: player.id });
      setPendingMatch(matches.find((m) => m.winnerId === null) || null);
      setPendingMatchLoading(false);
    };
    fetchMatch();
  }, [isSheetOpen, refreshTrigger]);

  return (
    <>
      <TableRow
        className={cn('hover:bg-muted/50 cursor-pointer', player.id === currentPlayer.id && 'border-secondary border-2')}
        onClick={() => setIsSheetOpen(true)}
      >
        <TableCell className="w-16 text-center">{player.ladderRank}</TableCell>
        <TableCell className="w-48">
          <span className="hover:underline">
            {player.firstName} {player.lastName}
          </span>
        </TableCell>
        <TableCell className="flex-1">
          <MatchHistorySummary historySummary={history.summary} />
        </TableCell>
        <TableCell className="w-32">
          {history.matches[0]?.matchDate ? format(new Date(history.matches[0].matchDate), 'EEEE d MMMM yyyy') : '—'}
        </TableCell>
        <TableCell className="w-32">
          <LadderAction isPlayable={isPlayable} pendingMatch={pendingMatch} pendingMatchLoading={pendingMatchLoading} />
        </TableCell>
      </TableRow>
      <PlayerSheet
        player={player}
        currentPlayer={currentPlayer}
        pendingMatch={pendingMatch}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        refreshMatch={refreshMatch}
      ></PlayerSheet>
    </>
  );
}
