'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { TripInsert } from '@/types';
import { createTrip } from '@/actions/trip';
import { AddressAutocomplete } from './address-autocomplete';
import RouteVisualization from './route-map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar24 } from './date-time-picker';
import { calculateOffer } from '@/lib/utils/calculate-offer';

const formSchema = z.object({
  pickup_lat: z.number(),
  pickup_lng: z.number(),
  pickup_address: z.string(),
  destination_lat: z.number(),
  destination_lng: z.number(),
  destination_address: z.string(),
  offer_amount: z.coerce.number().min(0),
  pickup_time: z.date().optional(),
  type: z.enum(['now', 'later']),
});

export default function NewTripForm() {
  const [routeMetrics, setRouteMetrics] = useState<{ distance: number; duration: number }>({ distance: 0, duration: 0 });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offer_amount: 0, // Start with 0, we'll update this when route changes
      type: 'now',
    },
  });

  // Memoize the route calculation callback
  const handleRouteCalculated = useCallback(({ distance, duration }: { distance: number; duration: number }) => {
    // Only update if values actually changed
    setRouteMetrics((prev) => {
      if (prev.distance === distance && prev.duration === duration) {
        return prev;
      }
      return { distance, duration };
    });
  }, []);

  // Update offer amount when route metrics change
  useEffect(() => {
    const offerAmount = calculateOffer({ distance: routeMetrics.distance, duration: routeMetrics.duration });
    form.setValue('offer_amount', offerAmount);
  }, [routeMetrics.distance, routeMetrics.duration, form]);

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

  const handleTimeSelect = (time: Date | undefined) => {
    form.setValue('pickup_time', time);
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
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Pick-up</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <AddressAutocomplete onSelect={handlePickupSelect} placeholder="Enter pickup address" />
          <AddressAutocomplete onSelect={handleDestinationSelect} placeholder="Enter destination address" />
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
                    <FormDescription>
                      This is the recommended offer amount based on the distance and duration of the trip. You can adjust it as you wish.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Tabs defaultValue="now" className="w-[400px]" onValueChange={(value) => form.setValue('type', value as 'now' | 'later')}>
                <TabsList>
                  <TabsTrigger value="now">Now</TabsTrigger>
                  <TabsTrigger value="later">Later</TabsTrigger>
                </TabsList>
                <TabsContent value="now">Request immediate pick-up.</TabsContent>
                <TabsContent value="later">
                  <Calendar24 onTimeSelect={handleTimeSelect} />
                </TabsContent>
              </Tabs>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
