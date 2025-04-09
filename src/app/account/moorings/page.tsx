import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMooringsByOwner, type Mooring } from '@/lib/supabase/moorings'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function MyMooringsPage() {
  // Protect the route
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?message=You must be logged in to view your moorings.')
  }

  // Fetch moorings owned by the current user
  const myMoorings: Mooring[] = await getMooringsByOwner(user.id)

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-8 sm:p-12 md:p-16">
      <header className="mb-8 flex w-full max-w-5xl items-center justify-between">
        <h1 className="text-4xl font-bold">My Moorings</h1>
        <Button asChild>
          <Link href="/moorings/new">List a New Mooring</Link>
        </Button>
      </header>

      <main className="w-full max-w-5xl">
        {myMoorings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myMoorings.map((mooring) => (
              <Card key={mooring.id} className="flex h-full flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{mooring.name}</CardTitle>
                    <Badge variant={mooring.is_available ? 'default' : 'secondary'} className="whitespace-nowrap">
                      {mooring.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <CardDescription>{mooring.location_description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {mooring.price_per_month ? (
                    <p className="text-lg font-semibold">
                      ${mooring.price_per_month}/month
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Price not listed</p>
                  )}
                  <p className="text-sm capitalize text-gray-600">
                    Term: {mooring.commitment_term || 'Not specified'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                   <Button variant="outline" size="sm" asChild>
                      <Link href={`/moorings/${mooring.id}`}>View</Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/moorings/${mooring.id}/edit`}>Edit</Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 border border-dashed rounded-lg p-8">
            <p className="mb-4">You haven&apos;t listed any moorings yet.</p>
             <Button asChild>
                <Link href="/moorings/new">List Your First Mooring</Link>
            </Button>
          </div>
        )}
      </main>

       {/* Link back to main account page */} 
       <div className="mt-8">
         <Button variant="link" asChild>
            <Link href="/account">{'<'} Back to Account</Link>
          </Button>
       </div>
    </div>
  )
} 