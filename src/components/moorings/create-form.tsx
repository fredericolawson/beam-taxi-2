'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import AutoResizeTextarea from '@/components/text-area';
import { createMooring } from '@/lib/tables/moorings-legacy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationSelector } from '@/components/location-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Mooring name is required.' }),
    location_description: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    price_per_month: z.coerce
      .number({ invalid_type_error: 'Please enter a valid number.' })
      .positive({ message: 'Price must be a positive number.' })
      .optional(),
    commitment_term: z.enum(['monthly', 'quarterly', 'annual'], {
      required_error: 'Commitment term is required.',
    }),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      // If location_description is provided, coordinates should also be present
      if (data.location_description && (!data.latitude || !data.longitude)) {
        return false;
      }
      return true;
    },
    {
      message: 'Please select a location on the map to set coordinates.',
      path: ['location_description'], // This will show the error on the location field
    }
  );

type FormData = z.infer<typeof formSchema>;

export function CreateMooringForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location_description: '',
      latitude: undefined,
      longitude: undefined,
      price_per_month: undefined,
      commitment_term: undefined,
      description: '',
    },
  });

  const handleLocationSelect = (locationData: {
    place_id: string;
    name: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
  }) => {
    form.setValue('location_description', locationData.formatted_address);
    form.setValue('latitude', locationData.latitude);
    form.setValue('longitude', locationData.longitude);
  };

  async function onSubmit(values: FormData) {
    try {
      await createMooring(values);
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
              <FormDescription>This is the name of the mooring that will be displayed to potential renters.</FormDescription>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <AutoResizeTextarea
                  placeholder="Add any extra details about the mooring (e.g. size restrictions, amenities nearby)"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.serverError && (
          <p className="text-destructive text-sm">{form.formState.errors.root.serverError.message}</p>
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating...' : 'Create Mooring'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/*
<FormItem>
          <FormLabel>Location</FormLabel>
          <FormDescription>Search and select the mooring location on the map.</FormDescription>
          <LocationSelector onLocationSelect={handleLocationSelect} />
          {form.watch('location_description') && (
            <div className="mt-2 space-y-1">
              <p className="text-muted-foreground text-sm">Selected: {form.watch('location_description')}</p>
              {form.watch('latitude') && form.watch('longitude') && (
                <p className="text-muted-foreground font-mono text-xs">
                  📍 {form.watch('latitude')?.toFixed(6)}, {form.watch('longitude')?.toFixed(6)}
                </p>
              )}
            </div>
          )}
          {form.formState.errors.location_description && (
            <p className="text-destructive text-sm">{form.formState.errors.location_description.message}</p>
          )}
        </FormItem>
        */
