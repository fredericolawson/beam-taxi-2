import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <Loader2 className="text-secondary h-8 w-8 animate-spin" />
    </div>
  );
}
