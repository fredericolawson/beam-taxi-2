import { getAllPlayers } from '@/lib/tables/players';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminAction } from '@/components/admin-action';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CompletedMatch, Player } from '@/types';
import { getCompletedMatches } from '@/lib/tables/matches';
import { Separator } from '@/components/ui/separator';

export default async function AdminPage() {
  const players = await getAllPlayers();
  const pendingPlayers = players.filter((player) => !player.isApproved);
  const approvedPlayers = players.filter((player) => player.isApproved);
  const matches = await getCompletedMatches();

  return (
    <div className="flex w-full flex-col gap-8">
      <PlayerAdminTable players={approvedPlayers} />
      <Separator />
      <PendingPlayersTable players={pendingPlayers} />
      <Separator />
      <AllMatchesTable matches={matches} />
    </div>
  );
}

function PlayerAdminTable({ players }: { players: Player[] }) {
  return (
    <div className="w-full">
      <h1 className="heading-1">Player Management</h1>
      <Table className="rounded-md border bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Name</TableHead>
            <TableHead className="w-32">Rank</TableHead>
            <TableHead className="w-32 text-center">Status</TableHead>
            <TableHead className="w-48">Actions</TableHead>
            <TableHead className="w-40 text-center">Joined</TableHead>
            <TableHead className="w-64">Email</TableHead>
            <TableHead className="w-32">Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id} className="hover:bg-muted/50">
              <TableCell className="w-48">
                <div className="font-medium">
                  {player.firstName} {player.lastName}
                </div>
              </TableCell>
              <TableCell className="w-32">{player.ladderRank}</TableCell>
              <TableCell className="w-32 text-center">
                <Badge variant={player.isApproved ? 'secondary' : 'default'}>{player.isApproved ? 'Approved' : 'Pending'}</Badge>
              </TableCell>
              <TableCell className="w-48">
                <AdminAction playerId={player.id} isApproved={player.isApproved} currentRank={player.ladderRank} />
              </TableCell>
              <TableCell className="w-40 text-center">{new Date(player.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="w-64">
                <Link href={`mailto:${player.email}`}>{player.email}</Link>
              </TableCell>
              <TableCell className="w-32">
                <Link href={`tel:${player.phone}`}>{player.phone}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AllMatchesTable({ matches }: { matches: CompletedMatch[] }) {
  return (
    <div className="w-full">
      <h1 className="heading-1">All Matches</h1>
      <Table className="rounded-md border bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>Challenger</TableHead>
            <TableHead>Defender</TableHead>
            <TableHead>Winner</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                {match.challenger.firstName} {match.challenger.lastName}
              </TableCell>
              <TableCell>
                {match.defender.firstName} {match.defender.lastName}
              </TableCell>
              <TableCell>
                {match.winner.firstName} {match.winner.lastName}
              </TableCell>
              <TableCell>{new Date(match.completedOn + 'T00:00:00').toLocaleDateString()}</TableCell>
              <TableCell>{match.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PendingPlayersTable({ players }: { players: Player[] }) {
  return (
    <div className="w-full">
      <h1 className="heading-1">Awaiting Approval</h1>
      <Table className="rounded-md border bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Name</TableHead>
            <TableHead className="w-32">Rank</TableHead>
            <TableHead className="w-32 text-center">Status</TableHead>
            <TableHead className="w-48">Actions</TableHead>
            <TableHead className="w-40 text-center">Joined</TableHead>
            <TableHead className="w-64">Email</TableHead>
            <TableHead className="w-32">Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id} className="hover:bg-muted/50">
              <TableCell className="w-48">
                <div className="font-medium">
                  {player.firstName} {player.lastName}
                </div>
              </TableCell>
              <TableCell className="w-32">{player.ladderRank}</TableCell>
              <TableCell className="w-32 text-center">
                <Badge variant={player.isApproved ? 'secondary' : 'default'}>{player.isApproved ? 'Approved' : 'Pending'}</Badge>
              </TableCell>
              <TableCell className="w-48">
                <AdminAction playerId={player.id} isApproved={player.isApproved} currentRank={player.ladderRank} />
              </TableCell>
              <TableCell className="w-40 text-center">{new Date(player.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="w-64">
                <Link href={`mailto:${player.email}`}>{player.email}</Link>
              </TableCell>
              <TableCell className="w-32">
                <Link href={`tel:${player.phone}`}>{player.phone}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
