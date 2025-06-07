'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

import { updateMooring, type Mooring } from '@/lib/tables/moorings-legacy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Mooring name is required.' }),
  location_description: z.string().optional(),
  price_per_month: z.coerce
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .positive({ message: 'Price must be a positive number.' })
    .optional(),
  commitment_term: z.enum(['monthly', 'quarterly', 'annual'], {
    required_error: 'Commitment term is required.',
  }),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type EditMooringFormProps = {
  mooring: Mooring;
};

export function EditMooringForm({ mooring }: EditMooringFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: mooring.name,
      location_description: mooring.location_description ?? '',
      price_per_month: mooring.price_per_month ?? undefined,
      commitment_term: mooring.commitment_term ?? undefined,
      description: mooring.description ?? '',
    },
  });

  async function onSubmit(values: FormData) {
    try {
      // Create FormData with the mooring ID
      const formData = new FormData();
      formData.append('id', mooring.id);
      formData.append('name', values.name);
      if (values.location_description) {
        formData.append('location_description', values.location_description);
      }
      if (values.price_per_month !== undefined) {
        formData.append('price_per_month', values.price_per_month.toString());
      }
      formData.append('commitment_term', values.commitment_term);
      if (values.description) {
        formData.append('description', values.description);
      }

      // Call updateMooring with proper parameters (prevState, formData)
      const result = await updateMooring({ message: null, errors: {} }, formData);

      // Check if there are errors returned
      if (result.errors || result.message) {
        // Set field-specific errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof FormData, {
                type: 'server',
                message: messages[0],
              });
            }
          });
        }

        // Set general error message
        if (result.message) {
          form.setError('root.serverError', {
            type: 'server',
            message: result.message,
          });
        }
      }
      // If no errors, the function should have redirected
    } catch (error) {
      console.error('Submission error:', error);
      form.setError('root.serverError', {
        type: 'server',
        message: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mooring Name</FormLabel>
              <FormDescription>The name of the mooring that will be displayed to potential renters.</FormDescription>
              <FormControl>
                <Input placeholder="e.g. Dockyard Berth 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price_per_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Month ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 500"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commitment_term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commitment Term</FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any extra details about the mooring (e.g. size restrictions, amenities nearby)"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h3 className="mb-2 font-semibold">Coordinates</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">{mooring.latitude!.toFixed(6)}</Badge>
            <Badge variant="secondary">{mooring.longitude!.toFixed(6)}</Badge>
          </div>
        </div>

        {form.formState.errors.root?.serverError && (
          <p className="text-destructive text-sm">{form.formState.errors.root.serverError.message}</p>
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" asChild>
            <Link href={`/moorings/${mooring.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
