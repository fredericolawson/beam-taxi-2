import { User } from '@supabase/supabase-js';
import * as React from 'react';

export function EmailTemplate({ sender, message }: { sender: User; message: string }) {
  return (
    <div>
      <h1>Hi {sender.user_metadata.first_name}!</h1>
      <p>You have a new message from {sender.email}!</p>
      <p>{message}</p>
    </div>
  );
}
