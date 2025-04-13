import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateMooringForm } from '@/components/moorings/create-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CreateMooringPage() {
  // Protect the route - redirect if not logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?message=You must be logged in to list a mooring.')
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>List A Mooring</CardTitle>
        <CardDescription>Compelete this form to add a new mooring.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateMooringForm />
      </CardContent>
    </Card>
  )
} 