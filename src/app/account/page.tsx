import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Moorings from '@/components/moorings/moorings'
import { getMooringsByOwner, type Mooring } from '@/lib/supabase/moorings'
import { UserInfo } from '@/components/user-info'
import { UpdateInfoForm } from '@/components/update-user-form'
import { Separator } from '@/components/ui/separator'


export default async function AccountPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login?message=You must be logged in to view your account.')
  }

  const myMoorings: Mooring[] = await getMooringsByOwner(data.user.id)

  return (
    <div className="container py-8 sm:py-12 md:py-16 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserInfo user={data.user} />
        <UpdateInfoForm user={data.user} />
      </div>
      <Separator />
      <Moorings moorings={myMoorings} />
    </div>
  )
}


