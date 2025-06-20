import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Player } from '@/types';
import { PlayerSheet } from './player-sheet';

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
    </TableRow>
  );
}

function LadderRow({ player, currentPlayer }: { player: Player; currentPlayer: Player }) {
  return (
    <TableRow>
      <TableCell>{player.ladderRank}</TableCell>
      <TableCell>
        <PlayerSheet player={player} currentPlayer={currentPlayer}>
          <span className="cursor-pointer hover:underline">
            {player.firstName} {player.lastName}
          </span>
        </PlayerSheet>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <ResultIcon result="W" />
          <ResultIcon result="L" />
        </div>
      </TableCell>
    </TableRow>
  );
}

function ResultIcon({ result }: { result: 'W' | 'L' }) {
  if (result === 'W') {
    return <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-700 p-3 text-white">{result}</div>;
  }
  return <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 p-3">{result}</div>;
}
