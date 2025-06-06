import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function MooringsListSkeleton() {
  // Show 6 skeleton cards as a placeholder
  const skeletonCount = 6;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Card key={index} className="h-full">
          <CardHeader>
            <Skeleton className="h-5 w-3/5" /> {/* Title */}
            <Skeleton className="h-4 w-4/5" /> {/* Description */}
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-1/2" /> {/* Price */}
            <Skeleton className="h-4 w-1/3" /> {/* Term */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
