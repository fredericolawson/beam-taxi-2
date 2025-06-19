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
import Link from 'next/link';
import { LogoutButton } from './logout-button';

export function ProfileSheet({ children, player }: { children: React.ReactNode; player: Player }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Profile</SheetTitle>
          <SheetDescription>Placeholder</SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <Button asChild className="flex-1">
              <Link href="/profile">Your Profile</Link>
            </Button>
            <LogoutButton />
          </div>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
