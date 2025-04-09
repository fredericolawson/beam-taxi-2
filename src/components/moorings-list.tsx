import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getAllAvailableMoorings, type Mooring } from '@/lib/supabase/moorings'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Anchor } from 'lucide-react' // Use Anchor icon
import { createClient } from '@/lib/supabase/server' // Needed for user check
import { Button } from '@/components/ui/button' // Needed for the button

export default async function MooringsList() {
  // Fetch moorings
  const moorings: Mooring[] = await getAllAvailableMoorings()

  // Fetch user state for the empty state button
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (moorings.length === 0) {
    // Return the enhanced empty state
    return (
      <Alert>
        <Anchor className="h-4 w-4" /> {/* Use Anchor icon */}
        <AlertTitle>No Moorings Found</AlertTitle>
        <AlertDescription className="mb-4"> {/* Add margin-bottom */}
          There are currently no moorings available. Check back later or list your own!
        </AlertDescription>
        {user && ( // Conditionally show button
          <Button asChild>
            <Link href="/moorings/new">List Your Mooring</Link>
          </Button>
        )}
      </Alert>
    )
  }

  // Render the list if moorings exist
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {moorings.map((mooring) => (
        <Link href={`/moorings/${mooring.id}`} key={mooring.id}>
          <Card className="h-full transition-shadow duration-200 hover:shadow-lg">
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
                <p className="text-sm text-muted-foreground">Price not listed</p>
              )}
              <p className="text-sm capitalize text-muted-foreground">
                Term: {mooring.commitment_term || 'Not specified'}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 