import { getMooringById, deleteMooring } from '@/lib/supabase/moorings'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge' // Assuming Badge component exists or will be added

// Define the props expected by the page, including the dynamic route parameter `id`
type MooringDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function MooringDetailPage({ params }: MooringDetailPageProps) {
  const { id } = await params

  // Fetch mooring details and current user concurrently
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const mooring = await getMooringById(id)

  // If mooring doesn't exist, show 404
  if (!mooring) {
    notFound()
  }

  const isOwner = user?.id === mooring.owner_id

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-8 sm:p-12 md:p-16">
      <main className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{mooring.name}</CardTitle>
              <Badge variant={mooring.is_available ? 'default' : 'destructive'}>
                {mooring.is_available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
            <CardDescription>{mooring.location_description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mooring.description && (
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700">{mooring.description}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Details</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {mooring.price_per_month && (
                  <li>Price: ${mooring.price_per_month}/month</li>
                )}
                {mooring.commitment_term && (
                  <li className="capitalize">Commitment: {mooring.commitment_term}</li>
                )}
                {/* Add Latitude/Longitude if available and desired */}
                {/* {mooring.latitude && mooring.longitude && (
                  <li>Location: {mooring.latitude.toFixed(4)}, {mooring.longitude.toFixed(4)}</li>
                )} */}
              </ul>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="mt-6 flex space-x-4 border-t pt-4">
                <Button asChild variant="outline">
                  <Link href={`/moorings/${mooring.id}/edit`}>Edit</Link>
                </Button>
                {/* Delete requires a form to trigger the server action */}
                <form action={async () => {
                    'use server'
                    // Add confirmation dialog in real UI
                    await deleteMooring(mooring.id)
                    // Redirect handled within deleteMooring action
                  }}
                >
                  <Button type="submit" variant="destructive">Delete</Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button asChild variant="link">
            <Link href="/">{'<'} Back to Listings</Link>
          </Button>
        </div>

      </main>
    </div>
  )
} 