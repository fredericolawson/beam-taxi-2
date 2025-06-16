'use client';

import { Plus, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { CreateMooring } from './main/create-mooring';
import { CreateRequest } from './main/create-request';
import { deleteRequest } from '@/actions/requests';
import { ConfirmationModal } from './ui/confirmation-modal';
import { useState } from 'react';

export function CreateMooringAction() {
  return (
    <CreateMooring
      trigger={
        <Button>
          <Plus /> List a Mooring
        </Button>
      }
    />
  );
}

export function CreateRequestAction() {
  return (
    <CreateRequest
      trigger={
        <Button>
          <Plus /> Request a Mooring
        </Button>
      }
    />
  );
}

export function DeleteRequestAction({ requestId }: { requestId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteRequest({ requestId });
    setIsDeleting(false);
  };

  return (
    <ConfirmationModal
      trigger={
        <Button className="w-fit" disabled={isDeleting} variant="destructive">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
      title="Delete Request"
      description="Are you sure you want to delete this request?"
      confirmText="Delete"
      onConfirm={handleDelete}
    />
  );
}
