import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Match } from '@/types';

export function MatchesTable({ matches }: { matches: Match[] }) {
  return (
    <Table>
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
      <TableHead>Challenger</TableHead>
      <TableHead>Opponent</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Result</TableHead>
      <TableHead>Winner</TableHead>
      <TableHead>Completed On</TableHead>
    </TableRow>
  );
}

function MatchRow({ match }: { match: Match }) {
  return (
    <TableRow>
      <TableCell>
        {match.challenger.firstName} {match.challenger.lastName}
      </TableCell>
      <TableCell>
        {match.opponent.firstName} {match.opponent.lastName}
      </TableCell>
      <TableCell>{match.status}</TableCell>
      <TableCell>{match.score}</TableCell>
      <TableCell>
        {match.winner?.firstName} {match.winner?.lastName}
      </TableCell>
      <TableCell>{match.completedOn ? new Date(match.completedOn).toLocaleDateString() : ''}</TableCell>
    </TableRow>
  );
}
