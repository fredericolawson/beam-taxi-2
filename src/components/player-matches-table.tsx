import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CompletedMatch, Player } from '@/types';
import { Separator } from '@/components/ui/separator';

export function PlayerMatchesTable({ matches, player }: { matches: CompletedMatch[] | null; player: Player }) {
  if (!matches) return null;
  return (
    <div className="w-full">
      <h2 className="heading-3">Match History</h2>
      <Table className="rounded-md border bg-white text-xs md:text-sm">
        <TableHeader>
          <MatchHeader />
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <MatchRow key={match.id} match={match} player={player} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MatchHeader() {
  return (
    <TableRow>
      <TableHead>Opponent</TableHead>
      <TableHead>Winner</TableHead>
      <TableHead>Result</TableHead>
      <TableHead>Date</TableHead>
    </TableRow>
  );
}

function MatchRow({ match, player }: { match: CompletedMatch; player: Player }) {
  let opponent = match.challenger;
  if (match.challenger.id === player.id) opponent = match.defender;
  return (
    <TableRow>
      <TableCell>
        {opponent.firstName} {opponent.lastName}
      </TableCell>
      <TableCell>{match.winner.firstName}</TableCell>
      <TableCell>{match.result}</TableCell>
      <TableCell>{new Date(match.completedOn).toLocaleDateString()}</TableCell>
    </TableRow>
  );
}
