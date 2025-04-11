'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'

import { createMooring } from '@/lib/supabase/moorings' // Assuming createMooring will be adapted
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Keep Label for structure if needed, or remove if FormLabel is sufficient
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel as ShadFormLabel, // Renaming to avoid conflict if Label is kept
  FormMessage,
} from "@/components/ui/form"

// Define the Zod schema for validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Mooring name is required." }),
  location_description: z.string().optional(),
  // Use coerce for number input as value is initially string
  price_per_month: z.coerce
    .number({ invalid_type_error: "Please enter a valid number." })
    .positive({ message: "Price must be a positive number." })
    .optional(),
  commitment_term: z.enum(["monthly", "quarterly", "annual"], {
    required_error: "Commitment term is required.",
  }),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Removed SubmitButton and initialState

export function CreateMooringForm() {
  // Set up react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location_description: "",
      price_per_month: undefined,
      commitment_term: undefined, // No default selection
      description: "",
    },
  });

  // Define the submit handler
  async function onSubmit(values: FormData) {
    try {
      // Call the server action directly with the validated form values
      await createMooring(values);
      // Success is handled by the server action's redirect, so no client-side success handling needed here
      // Optional: Show a toast notification *before* the redirect happens if desired
      // toast("Mooring listed successfully!"); 
    } catch (error) {
      console.error("Submission error:", error);
      // Set a general form error message
      form.setError("root.serverError", { // Use a specific key like root.serverError
        type: "server",
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
      // Optional: Show an error toast notification
      // toast.error(error instanceof Error ? error.message : "Failed to list mooring.");
    }
  }

  return (
    <Form {...form}> 
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<FormData, 'name'> }) => (
            <FormItem>
              <ShadFormLabel>Mooring Name</ShadFormLabel>
              <FormControl>
                <Input placeholder="e.g., Dockyard Berth 5" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location_description"
          render={({ field }: { field: ControllerRenderProps<FormData, 'location_description'> }) => (
            <FormItem>
              <ShadFormLabel>Location Description</ShadFormLabel>
              <FormControl>
                <Input placeholder="e.g., Next to the ferry terminal" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price_per_month"
            render={({ field }: { field: ControllerRenderProps<FormData, 'price_per_month'> }) => (
              <FormItem>
                <ShadFormLabel>Price per Month ($)</ShadFormLabel>
                <FormControl>
                  {/* Ensure value is handled correctly for optional number */}
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g., 500" 
                    {...field} 
                    value={field.value ?? ''} // Handle undefined for controlled input
                    onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} // Parse to float or pass undefined
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commitment_term"
            render={({ field }: { field: ControllerRenderProps<FormData, 'commitment_term'> }) => (
              <FormItem>
                <ShadFormLabel>Commitment Term</ShadFormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: ControllerRenderProps<FormData, 'description'> }) => (
            <FormItem>
              <ShadFormLabel>Description</ShadFormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any extra details about the mooring (e.g., size restrictions, amenities nearby)"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display general form errors from the server */}
        {form.formState.errors.root?.serverError && (
            <p className="text-sm text-red-500">{form.formState.errors.root.serverError.message}</p>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" asChild>
              <Link href="/">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Listing...' : 'List Mooring'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 