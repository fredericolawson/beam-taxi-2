import { LoadingSpinner } from './loading-spinner';

export function Loading() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
