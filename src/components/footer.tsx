import Link from 'next/link';

export function Footer() {
  return (
    <footer className="text-muted-foreground flex items-center justify-center gap-6 border-t p-2 text-xs md:text-sm">
      <Link href="/profile">Profile</Link>
    </footer>
  );
}
