'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateMooring, type Mooring, type FormState } from '@/lib/supabase/moorings'
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

// Define initial state for the form
const initialState: FormState = {
  message: null,
  errors: {},
}

// Separate Submit button component to use useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

// Props for the EditMooringForm component
type EditMooringFormProps = {
  mooring: Mooring // Pass the existing mooring data
}

export function EditMooringForm({ mooring }: EditMooringFormProps) {
  // Updated hook usage
  const [state, formAction] = useActionState(updateMooring, initialState)

  return (
    // The form action now correctly points to the wrapped server action
    <form action={formAction} className="space-y-6">
      {/* Hidden input to pass the mooring ID */}
      <input type="hidden" name="id" value={mooring.id} />

      {/* Form Fields with defaultValues from the mooring prop */}
      <div>
        <Label htmlFor="name">Mooring Name</Label>
        <Input 
          id="name" 
          name="name" 
          type="text" 
          required 
          placeholder="e.g., Dockyard Berth 5" 
          defaultValue={mooring.name}
          aria-describedby="name-error"
        />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="location_description">Location Description</Label>
        <Input 
          id="location_description" 
          name="location_description" 
          type="text" 
          placeholder="e.g., Next to the ferry terminal" 
          defaultValue={mooring.location_description ?? ''} 
          aria-describedby="location-error"
        />
         {state?.errors?.location_description && (
          <p id="location-error" className="text-sm text-red-500 mt-1">{state.errors.location_description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="price_per_month">Price per Month ($)</Label>
          <Input 
            id="price_per_month" 
            name="price_per_month" 
            type="number" 
            step="0.01" 
            placeholder="e.g., 500" 
            defaultValue={mooring.price_per_month ?? ''} 
            aria-describedby="price-error"
          />
           {state?.errors?.price_per_month && (
            <p id="price-error" className="text-sm text-red-500 mt-1">{state.errors.price_per_month[0]}</p>
          )}
        </div>
        <div>
          <Label htmlFor="commitment_term">Commitment Term</Label>
          <Select name="commitment_term" defaultValue={mooring.commitment_term ?? ''}>
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
            <p id="term-error" className="text-sm text-red-500 mt-1">{state.errors.commitment_term[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add any extra details..."
          defaultValue={mooring.description ?? ''}
          aria-describedby="description-error"
        />
         {state?.errors?.description && (
          <p id="description-error" className="text-sm text-red-500 mt-1">{state.errors.description[0]}</p>
        )}
      </div>
      
      {/* TODO: Add a control for 'is_available' (e.g., Checkbox or Switch) if needed */}

      {/* Display general form message/error */}
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" asChild>
          {/* Link back to the mooring detail page */}
          <Link href={`/moorings/${mooring.id}`}>Cancel</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  )
} 