'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { revalidate } from '@/actions/revalidate';
import PhoneInput from 'react-phone-number-input/input';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
    repeatPassword: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });

type FormData = z.infer<typeof formSchema>;

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  async function onSubmit(values: FormData) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone,
          },
        },
      });

      if (error) throw error;

      // Insert player info into players table
      // Note: All user data (email, phone, first_name, last_name) is automatically synced from auth.users via database triggers
      if (data.user) {
        const { error: playerError } = await supabase.schema('ladder').from('players').insert({
          user_id: data.user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
        });

        if (playerError) {
          console.error('Player insert error:', playerError.message);
          form.setError('root.serverError', {
            type: 'server',
            message: `Player creation failed: ${playerError.message}`,
          });
          return;
        }
      }
      await revalidate('/');
      router.push('/');
      toast.success('Account created successfully. You are now logged in.');
    } catch (error: unknown) {
      console.error(error);
      form.setError('root.serverError', {
        type: 'server',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="px-6 md:px-8">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Register to join the Coral Beach Tennis Ladder</CardDescription>
        </CardHeader>
        <CardContent className="px-6 md:px-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input type="text" autoComplete="given-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input type="text" autoComplete="family-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="+1 (441)"
                          defaultCountry="US"
                          autoComplete="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Ideally enter a number that can be reached via WhatsApp for scheduling matches.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type={showPassword ? 'text' : 'password'} autoComplete="new-password" {...field} />
                          <Button type="button" variant="outline" size="sm" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Create a password for your ladder profile. Must be at least 6 characters long.</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root?.serverError && (
                  <p className="text-sm text-red-500">{form.formState.errors.root.serverError.message}</p>
                )}

                <Button type="submit" variant="secondary" className="w-full border" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating an account...' : 'Sign up'}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have a tennis ladder account?{' '}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
