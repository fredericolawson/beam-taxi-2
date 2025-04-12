import { Suspense } from 'react'
import MooringsList from '@/components/moorings-list'
import { MooringsListSkeleton } from '@/components/moorings-list-skeleton'

export default function Home() {
  return (
    <div className=" py-8 sm:py-12 md:py-16">
      <h1 className="mb-8 heading-1">
        Available Moorings
      </h1>
      <Suspense fallback={<MooringsListSkeleton />}>
        <MooringsList />
      </Suspense>
    </div>
  )
}
