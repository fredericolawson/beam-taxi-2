import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Player } from '@/types';
import { PlayerSheet } from './player-sheet';
import { MatchHistory } from './match-history';
import { LadderAction } from './ladder-action';

export function LadderTable({ players, currentPlayer }: { players: Player[]; currentPlayer: Player }) {
  return (
    <Table>
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
      <TableHead>Rank</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Recent Results</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  );
}

function LadderRow({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  return (
    <TableRow>
      <TableCell>{player.ladderRank}</TableCell>
      <TableCell>
        <PlayerSheet player={player} currentPlayer={currentPlayer} matchHistory={<MatchHistory playerId={player.id} />}>
          <span className="cursor-pointer hover:underline">
            {player.firstName} {player.lastName}
          </span>
        </PlayerSheet>
      </TableCell>
      <TableCell>
        <MatchHistory playerId={player.id} />
      </TableCell>
      <TableCell>
        <LadderAction player={player} currentPlayer={currentPlayer} />
      </TableCell>
    </TableRow>
  );
}
