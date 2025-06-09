'use client';

import { useState } from 'react';
import { createRequest } from '@/actions/requests';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';

export default function CreateRequest() {
  const [requestName, setRequestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!requestName.trim()) return;
    setIsSubmitting(true);
    await createRequest({ requestName: requestName.trim() });
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Request a Mooring</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Mooring</DialogTitle>
          <DialogDescription>Start by giving your mooring a name. You&apos;ll enter more info on the next step.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Ely's Harbour Swing Mooring"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
          />
        </div>
        <DialogFooter className="justify-end">
          <Button type="button" onClick={handleSubmit} disabled={!requestName.trim() || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
