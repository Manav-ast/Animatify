import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from 'lucide-react';

interface AnimationPreviewProps {
  isLoading: boolean;
  hasGeneratedCode: boolean;
}

export function AnimationPreview({ isLoading, hasGeneratedCode }: AnimationPreviewProps) {
  if (isLoading) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
        <Skeleton className="w-full h-full" />
        <p className="mt-2 text-sm text-muted-foreground">Generating animation...</p>
      </div>
    );
  }

  if (!hasGeneratedCode) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 text-center">
        <Film className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">Animation preview will appear here once generated.</p>
        <p className="text-xs text-muted-foreground/80 mt-1">Enter a prompt and click "Generate Animation".</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video relative bg-black rounded-lg overflow-hidden shadow-lg">
      <Image
        src="https://placehold.co/1280x720.png"
        alt="Animation Preview Placeholder"
        layout="fill"
        objectFit="contain"
        data-ai-hint="animation video"
      />
       <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <p className="text-white text-lg font-semibold p-4 bg-black/70 rounded-md">Mock Animation Preview</p>
      </div>
    </div>
  );
}
