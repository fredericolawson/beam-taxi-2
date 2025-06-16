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
    try {
      setIsSubmitting(true);
      setOpen(false);
      await createRequest({ description: description.trim() });
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Request a Mooring</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Mooring</DialogTitle>
          <DialogDescription>
            Give a brief description of what you&apos;re looking for. You&apos;ll enter more info on the next step.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g. Walk-on mooring in Hamilton Sound"
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
