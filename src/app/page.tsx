import { Suspense } from 'react'
import MooringsList from '@/components/moorings-list'
import { MooringsListSkeleton } from '@/components/moorings-list-skeleton'

export default function Home() {
  return (
    <div className="container py-8 sm:py-12 md:py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
        Available Moorings
      </h1>

      <main className="w-full">
        <Suspense fallback={<MooringsListSkeleton />}>
          <MooringsList />
        </Suspense>
      </main>
    </div>
  )
}
