import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Loader2 className="text-secondary h-8 w-8 animate-spin" />
    </div>
  );
}
