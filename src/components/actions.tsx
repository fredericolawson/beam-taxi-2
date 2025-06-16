import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { CreateMooring } from './main/create-mooring';
import { CreateRequest } from './main/create-request';

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
