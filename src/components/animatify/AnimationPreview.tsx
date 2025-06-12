
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { Film, ImageOff } from 'lucide-react';

interface AnimationPreviewProps {
  isLoadingOverall: boolean;
  imagePreviewUrl: string | null;
}

export function AnimationPreview({ isLoadingOverall, imagePreviewUrl }: AnimationPreviewProps) {
  // Case 1: Actively generating code or image, and image not yet available
  if (isLoadingOverall && !imagePreviewUrl) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
        <Skeleton className="w-full h-full" />
        <p className="mt-2 text-sm text-muted-foreground">Generating animation and preview...</p>
      </div>
    );
  }

  // Case 2: Image preview is ready
  if (imagePreviewUrl) {
    return (
      <div className="w-full aspect-video relative bg-black rounded-lg overflow-hidden shadow-lg">
        <Image
          src={imagePreviewUrl}
          alt="Conceptual Animation Preview"
          layout="fill"
          objectFit="contain"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-lg font-semibold p-4 bg-black/70 rounded-md text-center">Conceptual Image Preview</p>
        </div>
      </div>
    );
  }
  
  // Case 3: Initial state or image generation failed (isLoadingOverall is false, or became false after an error)
  // Check if we were loading but now imagePreviewUrl is still null (implies error)
  if (isLoadingOverall && imagePreviewUrl === null) {
     return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 text-center">
        <ImageOff className="w-16 h-16 text-destructive/70 mb-4" />
        <p className="text-muted-foreground">Image preview generation failed.</p>
        <p className="text-xs text-muted-foreground/80 mt-1">The Manim code might still be available.</p>
      </div>
    );
  }

  // Default initial state
  return (
    <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 text-center">
      <Film className="w-16 h-16 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground">Conceptual image preview will appear here.</p>
      <p className="text-xs text-muted-foreground/80 mt-1">Enter a prompt and click "Generate Animation".</p>
    </div>
  );
}
