import { getAllPlayers } from '@/lib/tables/players';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminAction } from '@/components/admin-action';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function AdminPage() {
  const players = await getAllPlayers();

  return (
    <div className="mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Player Management</h1>

      <Table className="rounded-md border bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Name</TableHead>
            <TableHead className="w-64">Email</TableHead>
            <TableHead className="w-32">Phone</TableHead>
            <TableHead className="w-32">Rank</TableHead>
            <TableHead className="w-32 text-center">Status</TableHead>
            <TableHead className="w-40 text-center">Joined</TableHead>
            <TableHead className="w-48">Actions</TableHead>
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
              <TableCell className="w-64">
                <Link href={`mailto:${player.email}`}>{player.email}</Link>
              </TableCell>
              <TableCell className="w-32">
                <Link href={`tel:${player.phone}`}>{player.phone}</Link>
              </TableCell>
              <TableCell className="w-32">{player.ladderRank}</TableCell>
              <TableCell className="w-32 text-center">
                <Badge variant={player.isApproved ? 'secondary' : 'default'}>{player.isApproved ? 'Approved' : 'Pending'}</Badge>
              </TableCell>
              <TableCell className="w-40 text-center">{new Date(player.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="w-48">
                <AdminAction playerId={player.id} isApproved={player.isApproved} currentRank={player.ladderRank} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
