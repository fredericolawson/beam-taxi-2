import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateMooringForm } from '@/components/moorings/create-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CreateMooringPage() {
  // Protect the route - redirect if not logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?message=You must be logged in to list a mooring.')
  }

  return (
    <div className="flex w-full flex-col flex-grow items-center p-8 sm:p-12 md:p-16">
      <main className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">List Your Mooring</h1>
            <Button variant="outline" asChild>
                <Link href="/">Cancel</Link>
            </Button>
        </div>
        {/* Render the client component containing the form */}
        <CreateMooringForm />
      </main>
    </div>
  )
} 