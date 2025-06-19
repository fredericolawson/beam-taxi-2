import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Player } from '@/types';
import { Button } from './ui/button';
import { ChallengePlayer } from './challenge-player';

export function PlayerSheet({ children, player, currentPlayer }: { children: React.ReactNode; player: Player; currentPlayer: Player }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{player.displayName}</SheetTitle>
          <SheetDescription>Placeholder</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-4">
          <ChallengePlayer player={player} currentPlayer={currentPlayer} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
