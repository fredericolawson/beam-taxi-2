import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex justify-center items-center h-full py-10">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
} 