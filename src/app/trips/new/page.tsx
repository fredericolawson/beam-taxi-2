import Script from 'next/script';
import NewTripForm from '../components/trip-form';
import { getUserServer } from '@/lib/utils/get-user-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default async function NewTripPage() {
  const user = await getUserServer();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <NewTripForm />
    </div>
  );
}
