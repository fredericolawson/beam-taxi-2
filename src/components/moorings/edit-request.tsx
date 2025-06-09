'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Request } from '@/types/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import { useState, useTransition } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateRequest } from '@/actions/requests';
import Link from 'next/link';
import Calendar10 from '../calendar-10';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const formSchema = z
  .object({
    id: z.string(),
    description: z.string(),
    start_date: z.date(),
    expires_on: z.date(),
    request_type: z.enum(['walk-on', 'swing', 'either']),
    boat_length: z.string(),
    price_from: z.coerce.number().min(1, 'Price must be positive'),
    price_to: z.coerce.number().min(1, 'Price must be positive'),
  })
  .refine((data) => data.price_to > data.price_from, {
    message: 'Must be higher than price from',
    path: ['price_to'],
  });

export function EditRequest({ request }: { request: Request }) {
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState<Date>(request.start_date ? new Date(request.start_date) : new Date());
  const [expiresOn, setExpiresOn] = useState<Date>(
    request.expires_on ? new Date(request.expires_on) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: request.description ?? '',
      start_date: startDate,
      expires_on: expiresOn,
      id: request.id,
      request_type: request.request_type ?? 'either',
      boat_length: request.boat_length ?? '',
      price_from: request.price_from ?? 250,
      price_to: request.price_to ?? 400,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await updateRequest({ requestId: request.id, data: values });
    });
  };

  return (
    <div className="card-container flex h-full flex-grow flex-col bg-transparent p-4 md:w-1/2 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex justify-between">
            <h1 className="heading-2 mb-6">Edit Request</h1>
            <div className="flex gap-4">
              <Button className="w-fit" type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button className="w-fit" asChild disabled={isPending} variant="outline">
                <Link href={`/requests/${request.id}`}>Cancel</Link>
              </Button>
              <Button className="w-fit" asChild disabled={isPending} variant="destructive">
                <Link href={`/requests/${request.id}`}>Delete</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-grow flex-col gap-8 md:w-1/2">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                  <CardDescription>Describe what you&apos;re looking for in a mooring, the ideal location, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="min-h-24"
                            placeholder="e.g. I'm looking for a walk on mooring for my 44 foot boat, ideally located in Hamilton Sound"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mooring Details</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="request_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Type of mooring</FormLabel>
                        <FormControl>
                          <Tabs value={field.value} onValueChange={field.onChange}>
                            <TabsList>
                              <TabsTrigger value="walk-on">Walk on</TabsTrigger>
                              <TabsTrigger value="swing">Swing</TabsTrigger>
                              <TabsTrigger value="either">Either</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="boat_length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boat Length (feet)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 44" type="number" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Price Range</CardTitle>
                  <CardDescription>Enter the price range you&apos;re looking for.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="price_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From (per month)</FormLabel>
                        <FormControl>
                          <Input placeholder="$250" type="number" min={0} required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To (per month)</FormLabel>
                        <FormControl>
                          <Input placeholder="$400" type="number" min={0} required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Preferred Mooring Start Date</CardTitle>
                  <CardDescription>Select the date you&apos;d like to start your mooring on.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Calendar10 date={startDate} setDate={setStartDate} label="Preferred Start Date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Listing Expiry Date</CardTitle>
                  <CardDescription>The date this listing will expire.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="expires_on"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Calendar10 date={expiresOn} setDate={setExpiresOn} label="Expiry Date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
