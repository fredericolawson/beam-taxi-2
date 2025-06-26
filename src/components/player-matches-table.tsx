import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Match, CompletedMatch } from '@/types';

export function PlayerMatchesTable({ matches }: { matches: CompletedMatch[] | null }) {
  if (!matches) return null;
  return (
    <Table className="rounded-md border bg-white">
      <TableHeader>
        <MatchHeader />
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </TableBody>
    </Table>
  );
}

function MatchHeader() {
  return (
    <TableRow>
      <TableHead>Opponent</TableHead>
      <TableHead>Winner</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Result</TableHead>
    </TableRow>
  );
}

function MatchRow({ match }: { match: CompletedMatch }) {
  return (
    <TableRow className="text-sm">
      <TableCell>
        {match.opponent.firstName} {match.opponent.lastName}
      </TableCell>
      <TableCell>
        {match.winner.firstName} {match.winner.lastName}
      </TableCell>
      <TableCell>{new Date(match.completedOn).toLocaleDateString()}</TableCell>
      <TableCell>{match.result}</TableCell>
    </TableRow>
  );
}
