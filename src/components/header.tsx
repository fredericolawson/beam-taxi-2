import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* Add logo/icon here if desired */}
            <span className="font-bold">Bermuda Moorings</span>
          </Link>
          {/* <nav className="flex items-center space-x-6 text-sm font-medium">
             Potential place for main nav links if needed later
            <Link href="/moorings" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Moorings
            </Link>
          </nav> */}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href="/moorings/new">List Your Mooring</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                       {/* Placeholder for actual avatar image if available */}
                      {/* <AvatarImage src={user.avatar_url || undefined} alt={user.email} /> */}
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                   {/* Logout needs to be a form to trigger server action */}
                  <form action="/auth/logout" method="post">
                    <button type="submit" className="w-full">
                       <DropdownMenuItem className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              {/* Optionally add a Sign Up button */}
              {/* <Button asChild variant="secondary" size="sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button> */}
            </>
          )}
        </div>
      </div>
    </header>
  )
} 