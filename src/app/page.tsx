import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAllAvailableMoorings, type Mooring } from '@/lib/supabase/moorings'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const moorings: Mooring[] = await getAllAvailableMoorings()

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-8 sm:p-12 md:p-16">
      <header className="mb-8 flex w-full max-w-5xl items-center justify-between">
        <h1 className="text-4xl font-bold">Available Moorings</h1>
        {user && (
          <Button asChild>
            <Link href="/moorings/new">List Your Mooring</Link>
          </Button>
        )}
        {!user && (
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        )}
      </header>

      <main className="w-full max-w-5xl">
        {moorings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moorings.map((mooring) => (
              <Link href={`/moorings/${mooring.id}`} key={mooring.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle>{mooring.name}</CardTitle>
                    <CardDescription>{mooring.location_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No moorings currently available.</p>
        )}
      </main>

      {/* Footer can be added back if needed */}
      {/* <footer className="mt-auto pt-8 text-center text-sm text-gray-500">
        Bermuda Moorings
      </footer> */}
    </div>
  )
}
