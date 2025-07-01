'use client';

import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from './ui/input';
import type { Match } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { cancelMatchAction, submitMatchResult } from '@/actions/match';
import { Loading } from './loading-spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

const FormSchema = z.object({
  winnerId: z.string().min(1, 'Please select a winner'),
  result: z.string().min(1, 'Please enter the match result'),
});

export function RecordMatchResult({
  match,
  refresh,
  fetchHistory,
}: {
  match: Match | null;
  refresh: () => void;
  fetchHistory: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingData, setPendingData] = useState<z.infer<typeof FormSchema> | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      winnerId: '',
      result: '',
    },
  });

  if (!match || !match.matchDate) return null;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPendingData(data);
    setShowConfirmation(true);
  }

  function handleConfirmSubmit() {
    if (!pendingData) return;

    const submitMatch = async () => {
      setIsSubmitting(true);
      setShowConfirmation(false);

      const response = await submitMatchResult({
        matchId: match!.id,
        winnerId: pendingData.winnerId,
        result: pendingData.result,
      });
      if (response.error) toast.error(response.error);
      else {
        fetchHistory();
        refresh();
        toast.success('Match result submitted');
      }
      setIsSubmitting(false);
      setPendingData(null);
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
        refresh();
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
        <CardDescription>Record the result of your superset match (first to 8 games)</CardDescription>
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
                          <SelectItem value={match.challenger.id}>{match.challenger.firstName}</SelectItem>
                          <SelectItem value={match.defender.id}>{match.defender.firstName}</SelectItem>
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
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogTrigger asChild>
                  <Button type="submit" variant="secondary" className="flex-1" disabled={isSubmitting}>
                    <PlusCircle />
                    {isSubmitting ? <Loading /> : 'Submit Result'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Match Result</AlertDialogTitle>
                    <div className="flex flex-col gap-2">
                      <span className="text-muted-foreground">Are you sure you want to submit this match result?</span>
                      <span>
                        <strong>Winner:</strong>{' '}
                        {pendingData?.winnerId === match.challenger.id ? match.challenger.firstName : match.defender.firstName}
                      </span>
                      <span>
                        <strong>Result:</strong> {pendingData?.result}
                      </span>
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmSubmit} disabled={isSubmitting}>
                      {isSubmitting ? <Loading /> : 'Submit Result'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" className="flex-1" disabled={isCancelling} onClick={onCancel}>
                {isCancelling ? <Loading /> : 'Cancel Match'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
