'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createMooring, type FormState } from '@/lib/supabase/moorings'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialState: FormState = {
  message: null,
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Listing...' : 'List Mooring'}
    </Button>
  )
}

export function CreateMooringForm() {
  const [state, formAction] = useActionState(createMooring, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {
        /* Form Fields */
      }
      <div>
        <Label htmlFor="name">Mooring Name</Label>
        <Input id="name" name="name" type="text" required placeholder="e.g., Dockyard Berth 5" aria-describedby="name-error" />
        {/* Display validation error for name */}
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-500 mt-1">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="location_description">Location Description</Label>
        <Input id="location_description" name="location_description" type="text" placeholder="e.g., Next to the ferry terminal" aria-describedby="location-error" />
         {state?.errors?.location_description && (
          <p id="location-error" className="text-sm text-red-500 mt-1">
            {state.errors.location_description[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="price_per_month">Price per Month ($)</Label>
          <Input id="price_per_month" name="price_per_month" type="number" step="0.01" placeholder="e.g., 500" aria-describedby="price-error" />
           {state?.errors?.price_per_month && (
            <p id="price-error" className="text-sm text-red-500 mt-1">
              {state.errors.price_per_month[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="commitment_term">Commitment Term</Label>
          <Select name="commitment_term">
            <SelectTrigger id="commitment_term" aria-describedby="term-error">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
          {state?.errors?.commitment_term && (
            <p id="term-error" className="text-sm text-red-500 mt-1">
              {state.errors.commitment_term[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add any extra details about the mooring (e.g., size restrictions, amenities nearby)"
          aria-describedby="description-error"
        />
         {state?.errors?.description && (
          <p id="description-error" className="text-sm text-red-500 mt-1">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Display general form message/error */}
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" asChild>
            <Link href="/">Cancel</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  )
} 