import NewTripForm from '../components/trip-form';
import { getUserServer } from '@/lib/utils/get-user-server';

export default async function NewTripPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <NewTripForm />
    </div>
  );
}
