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
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setIsSubmitting(true);
    await createRequest({ description: description.trim() });
    setIsSubmitting(false);
    setOpen(false);
  };
  // add ---> "when do you want to leave this request open til?"

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
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g. Ely's Harbour Swing Mooring"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <DialogFooter className="justify-end">
          <Button type="button" onClick={handleSubmit} disabled={!description.trim() || isSubmitting}>
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
