'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { UploadIcon } from 'lucide-react';
import type { Player } from '@/types';
import { revalidate } from '@/actions/revalidate';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type FormData = z.infer<typeof formSchema>;

export function UpdateInfoForm({
  user,
  player,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { user: User; player: Player }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: player.firstName || '',
      lastName: player.lastName || '',
      phone: player.phone || '',
      email: user.email || '',
    },
  });

  async function onSubmit(values: FormData) {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
        },
      });

      if (error) throw error;

      // Note: All user data is now automatically synced from auth.users via database triggers
      // No need to manually update the players table

      revalidate('/profile');
    } catch (error: unknown) {
      console.error('Update error:', error);
      form.setError('root.serverError', {
        type: 'server',
        message: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-6', className)} {...props}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Update Your Profile</CardTitle>
          <CardDescription>Please enter your new information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex w-full flex-col gap-6 md:flex-row">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-col gap-6 md:flex-row">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors.root?.serverError && (
                <p className="text-sm text-red-500">{form.formState.errors.root.serverError.message}</p>
              )}
              <Button type="submit" variant="secondary" className="w-fit border" disabled={form.formState.isSubmitting}>
                <UploadIcon className="h-4 w-4" />
                {form.formState.isSubmitting ? 'Saving...' : 'Update Info'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
