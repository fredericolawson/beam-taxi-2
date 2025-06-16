'use client';

import { useState } from 'react';
import { createMooring } from '@/actions/moorings';
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

export function CreateMooring({ trigger }: { trigger: React.ReactNode }) {
  const [mooringName, setMooringName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!mooringName.trim()) return;
    setIsSubmitting(true);
    await createMooring({ mooringName: mooringName.trim() });
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List a New Mooring</DialogTitle>
          <DialogDescription>Start by giving your mooring a name. You&apos;ll enter more info on the next step.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="name">Mooring Name</Label>
          <Input
            id="name"
            placeholder="e.g. Ely's Harbour Swing Mooring"
            value={mooringName}
            onChange={(e) => setMooringName(e.target.value)}
          />
        </div>
        <DialogFooter className="justify-end">
          <Button type="button" onClick={handleSubmit} disabled={!mooringName.trim() || isSubmitting}>
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
