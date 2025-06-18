'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { useState, useTransition } from 'react';
import { sendMessage } from '@/actions/messages';
import { toast } from 'sonner';
import { CheckCircleIcon } from 'lucide-react';
import { Mooring } from '@/types/mooring';
import { Request } from '@/types/request';

export function SendMessage({ object, user, label }: { object: Mooring | Request; user: User | null; label: string }) {
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!user) return <UnauthenticatedSendMessage label={label} />;
  if (user.id === object.owner_id) return null;

  const onSubmit = async () => {
    startTransition(async () => {
      await sendMessage({ object, user, message });
      toast.success('Message sent');
      setIsSent(true);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact the {label}</CardTitle>
        <CardDescription>They will reply to you at {user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        {isSent && (
          <div className="text-muted-foreground bg-muted mb-4 flex w-full items-center justify-center gap-2 rounded-md p-2 text-sm">
            <CheckCircleIcon className="text-green-500" />
            Message sent
          </div>
        )}

        <Textarea placeholder="Message" disabled={isPending || isSent} value={message} onChange={(e) => setMessage(e.target.value)} />
      </CardContent>
      <CardFooter>
        <Button disabled={isPending || !message} onClick={onSubmit}>
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function UnauthenticatedSendMessage({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact the {label}</CardTitle>
        <CardDescription>Please login or sign up to send a message to the {label}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
