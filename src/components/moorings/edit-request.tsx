'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Request } from '@/types/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import { Calendar05 } from '@/components/calendar-05';
import type { DateRange } from 'react-day-picker';
import { useState, useTransition } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateRequest } from '@/actions/requests';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string(),
  start_from: z.date(),
  start_to: z.date(),
  id: z.string(),
  request_type: z.enum(['walk-on', 'swing', 'either']),
  boat_length: z.string(),
});

export function EditRequest({ request }: { request: Request }) {
  const [isPending, startTransition] = useTransition();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(request.start_from) ?? new Date(),
    to: new Date(request.start_to) ?? new Date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: request.name,
      description: request.description ?? '',
      start_from: dateRange?.from,
      start_to: dateRange?.to,
      id: request.id,
      request_type: request.request_type ?? 'either',
      boat_length: request.boat_length ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await updateRequest({ requestId: request.id, data: values });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-grow flex-col gap-8 md:w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Walk on mooring for 44 foot boat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Start Date Range</FormLabel>
              <FormDescription>Select the range of dates you&apos;d be happy to start your mooring on.</FormDescription>
              <FormControl>
                <Calendar05 dateRange={dateRange} setDateRange={setDateRange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <div className="flex flex-col gap-8 md:w-1/2">
            <div className="flex gap-4">
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
                      <Input placeholder="e.g. 44" type="number" {...field} />
                    </FormControl>
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
                  <FormDescription>Describe what you&apos;re looking for in a mooring, the ideal location, etc.</FormDescription>
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
          </div>
        </div>
        <Separator />
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
      </form>
    </Form>
  );
}
