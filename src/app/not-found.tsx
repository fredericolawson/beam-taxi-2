import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-grow flex-col items-center justify-center gap-4">
      <h1 className="heading-2">Sorry, this page doesn&apos;t exist</h1>
      <Link href="/">
        <Button>Home</Button>
      </Link>
    </div>
  );
}
