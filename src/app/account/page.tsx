import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AccountPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login?message=You must be logged in to view your account.')
  }

  return (
    <div className="container py-8 sm:py-12 md:py-16">
      <h1 className="mb-6 text-3xl font-bold">Account</h1>
      <div className="space-y-4">
        <p>
          Logged in as: <strong>{data.user.email}</strong>
        </p>
        <Button asChild variant="outline">
          <Link href="/account/moorings">Manage My Moorings</Link>
        </Button>
      </div>
    </div>
  )
}
