'use client';

import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

export function PendingMatch({ match }: { match: Match | null }) {
  if (!match) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {match.opponent.firstName} {match.opponent.lastName} vs {match.challenger.firstName} {match.challenger.lastName}
        </CardTitle>
        <CardDescription>Record the result of your match</CardDescription>
      </CardHeader>
      <CardContent>
        <MatchResultForm match={match} />
      </CardContent>
    </Card>
  );
}

const FormSchema = z.object({
  winnerId: z.string({
    required_error: 'A winner is required.',
  }),
  score: z.string({
    required_error: 'A score is required.',
  }),
  completedOn: z.date({
    required_error: 'A date is required.',
  }),
});

export function MatchResultForm({ match }: { match: Match }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      winnerId: match.challenger.id,
      score: '',
      completedOn: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitMatch = async () => {
      setIsSubmitting(true);
      console.log('data: ', data);
      const response = await submitMatchResult({
        matchId: match.id,
        winnerId: data.winnerId,
        score: data.score,
        completedOn: data.completedOn,
      });
      if (response.error) {
        toast.error(response.error);
      }
      setIsSubmitting(false);
      router.refresh();
      toast.success('Match result submitted');
    };
    submitMatch();
  }

  function onCancel() {
    const cancelMatch = async () => {
      const response = await cancelMatchAction({ matchId: match.id });
      if (response.error) {
        toast.error(response.error);
      }
      router.refresh();
      revalidate('/');
      toast.success('Match cancelled');
    };
    cancelMatch();
  }

  return (
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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a winner" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value={match.challenger.id}>
                        {match.challenger.firstName} {match.challenger.lastName}
                      </SelectItem>
                      <SelectItem value={match.opponent.id}>
                        {match.opponent.firstName} {match.opponent.lastName}
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
            name="score"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Score</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 8-7 (7-5)" className="w-full" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
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
            {isSubmitting ? 'Submitting...' : 'Submit Result'}
          </Button>
          <Button variant="outline" className="flex-1" disabled={isSubmitting} onClick={onCancel}>
            Cancel Match
          </Button>
        </div>
      </form>
    </Form>
  );
}
