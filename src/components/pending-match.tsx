'use client';

import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import type { Match } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { cancelMatchAction, submitMatchResult } from '@/actions/match';
import { useRouter } from 'next/navigation';
import { revalidate } from '@/actions/revalidate';
import { LoadingSpinner } from './loading-spinner';

const FormSchema = z.object({
  winnerId: z.string().min(1, 'Please select a winner'),
  result: z.string().min(1, 'Please enter the match result'),
  completedOn: z.date({
    required_error: 'Please set the date the match was completed',
  }),
});

export function RecordMatchResult({
  match,
  setPendingMatch,
  onMatchUpdate,
}: {
  match: Match | null;
  setPendingMatch: (match: Match | null) => void;
  onMatchUpdate: () => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      winnerId: '',
      result: '',
      completedOn: new Date(),
    },
  });

  if (!match) return null;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitMatch = async () => {
      setIsSubmitting(true);

      const response = await submitMatchResult({
        matchId: match!.id,
        winnerId: data.winnerId,
        result: data.result,
        completedOn: data.completedOn,
      });
      if (response.error) toast.error(response.error);
      else {
        setPendingMatch(null);
        await onMatchUpdate();
        router.refresh();
        toast.success('Match result submitted');
      }
      setIsSubmitting(false);
    };
    submitMatch();
  }

  function onCancel() {
    const cancelMatch = async () => {
      setIsCancelling(true);
      const response = await cancelMatchAction({ matchId: match!.id });
      if (response.error) {
        toast.error(response.error);
      } else {
        await revalidate('/');
        setPendingMatch(null);
        router.refresh();
        toast.success('Match cancelled');
      }
      setIsCancelling(false);
    };
    cancelMatch();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {match.challenger.firstName} {match.challenger.lastName} vs {match.defender.firstName} {match.defender.lastName}
        </CardTitle>
        <CardDescription>Record the result of your match</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <FormField
                control={form.control}
                name="winnerId"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Winner</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a winner" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value={match.challenger.id}>
                            {match.challenger.firstName} {match.challenger.lastName}
                          </SelectItem>
                          <SelectItem value={match.defender.id}>
                            {match.defender.firstName} {match.defender.lastName}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Result</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 8-6" className="w-full" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs">Record the result of your superset (first to 8 games)</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="completedOn"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Match Completed On</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="z-[100] w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01') || isSubmitting}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 md:flex-row">
              <Button type="submit" variant="secondary" className="flex-1" disabled={isSubmitting}>
                <PlusCircle />
                {isSubmitting ? <LoadingSpinner /> : 'Submit Result'}
              </Button>
              <Button variant="outline" className="flex-1" disabled={isCancelling} onClick={onCancel}>
                {isCancelling ? <LoadingSpinner /> : 'Cancel Match'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
