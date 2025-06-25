import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Player } from '@/types';
import { PlayerSheet } from './player-sheet';
import { MatchHistorySummary } from './match-history';
import { LadderAction } from './ladder-action';
import { cn } from '@/lib/utils';
import { getMatchHistory } from '@/lib/utils/match-utils';

export function LadderTable({ players, currentPlayer }: { players: Player[]; currentPlayer: Player }) {
  return (
    <Table className="rounded-md border bg-white">
      <TableHeader>
        <LadderHeader />
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <LadderRow key={player.id} player={player} currentPlayer={currentPlayer} />
        ))}
      </TableBody>
    </Table>
  );
}

function LadderHeader() {
  return (
    <TableRow>
      <TableHead className="w-16 text-center">Rank</TableHead>
      <TableHead className="w-48">Name</TableHead>
      <TableHead className="flex-1">Recent Results</TableHead>
      <TableHead className="w-32">Action</TableHead>
    </TableRow>
  );
}

async function LadderRow({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  const { historySummary, historyDetail } = await getMatchHistory({ playerId: player.id });
  return (
    <TableRow className={cn(player.id === currentPlayer.id && 'bg-secondary/20 hover:bg-secondary/20')}>
      <TableCell className="w-16 text-center">{player.ladderRank}</TableCell>
      <TableCell className="w-48">
        <PlayerSheet player={player} currentPlayer={currentPlayer} historyDetail={historyDetail}>
          <span className="cursor-pointer hover:underline">
            {player.firstName} {player.lastName}
          </span>
        </PlayerSheet>
      </TableCell>
      <TableCell className="flex-1">
        <MatchHistorySummary historySummary={historySummary} />
      </TableCell>
      <TableCell className="w-32">
        <LadderAction player={player} currentPlayer={currentPlayer} />
      </TableCell>
    </TableRow>
  );
}
