'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { Mooring } from '@/types/mooring';
import { useState, useTransition } from 'react';
import { sendMessage } from '@/actions/messages';
import { toast } from 'sonner';

export function SendMessage({ mooring, user }: { mooring: Mooring; user: User | null }) {
  const [message, setMessage] = useState('');
  if (!user) return null;

  const [isPending, startTransition] = useTransition();

  const onSubmit = async () => {
    if (!message) {
      toast.error('Please enter a message');
      return;
    }
    startTransition(async () => {
      await sendMessage({ mooring, user, message });
      toast.success('Message sent');
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact the owner</CardTitle>
        <CardDescription>Your email will be sent from {user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      </CardContent>
      <CardFooter>
        <Button disabled={isPending} onClick={onSubmit}>
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </CardFooter>
    </Card>
  );
}
