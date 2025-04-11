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
import { User as SupabaseUser } from '@supabase/supabase-js'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b flex justify-between items-center p-6">
      <div className="mr-4 flex">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Bermuda Moorings</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end space-x-2">
        <UserMenu user={user} />
      </div>
    </header>
  )
} 


function UserMenu({user}: {user: SupabaseUser | null}) {
  
  if (!user) return (
    <Button asChild size="sm">
      <Link href="/auth/login">Login</Link>
    </Button>
  )
  
  const userInitial = user.email?.charAt(0).toUpperCase() ?? '?'
  return (
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
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
              Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

