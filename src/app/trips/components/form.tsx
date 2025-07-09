'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { TripInsert } from '@/types';
import { createTrip } from '@/actions/trip';
import { AddressAutocomplete } from './address-autocomplete';
import RouteVisualization from './route-map';

const formSchema = z.object({
  pickup_lat: z.number(),
  pickup_lng: z.number(),
  pickup_address: z.string(),
  destination_lat: z.number(),
  destination_lng: z.number(),
  destination_address: z.string(),
  offer_amount: z.coerce.number().min(0),
});

export default function NewTripForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offer_amount: 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //    const trip = await createTrip({ trip: { ...values, rider_id: '1' } });
    console.log(values);
  }

  const handlePickupSelect = (suggestion: any) => {
    form.setValue('pickup_lat', suggestion.lat);
    form.setValue('pickup_lng', suggestion.lng);
    form.setValue('pickup_address', suggestion.address);
  };

  const handleDestinationSelect = (suggestion: any) => {
    form.setValue('destination_lat', suggestion.lat);
    form.setValue('destination_lng', suggestion.lng);
    form.setValue('destination_address', suggestion.address);
  };
  const handleRouteCalculated = (route: any) => {
    console.log('Route calculated:', route);
    // Handle route data - maybe save to state/database
  };

  // Watch form values for reactivity
  const pickupLat = form.watch('pickup_lat');
  const pickupLng = form.watch('pickup_lng');
  const destinationLat = form.watch('destination_lat');
  const destinationLng = form.watch('destination_lng');

  const pickup =
    pickupLat && pickupLng
      ? {
          lat: pickupLat,
          lng: pickupLng,
        }
      : null;

  const destination =
    destinationLat && destinationLng
      ? {
          lat: destinationLat,
          lng: destinationLng,
        }
      : null;

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center border border-red-500">
      <div className="flex gap-4">
        <AddressAutocomplete onSelect={handlePickupSelect} placeholder="Enter pickup address" />
        <AddressAutocomplete onSelect={handleDestinationSelect} placeholder="Enter destination address" />
      </div>
      <RouteVisualization
        pickup={pickup}
        destination={destination}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        className="h-96 w-full rounded-lg border shadow-lg"
        onRouteCalculated={handleRouteCalculated}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="offer_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Offer Amount" {...field} type="number" min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
