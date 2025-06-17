import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, ImageOff } from "lucide-react";

interface AnimationPreviewProps {
  isLoadingOverall: boolean;
  imagePreviewUrl: string | null;
  videoPath: string | null;
}

export function AnimationPreview({
  isLoadingOverall,
  imagePreviewUrl,
  videoPath,
}: AnimationPreviewProps) {
  // Case 1: Actively generating content
  if (isLoadingOverall) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
        <Skeleton className="w-full h-full" />
        <p className="mt-2 text-sm text-muted-foreground">
          Generating animation...
        </p>
      </div>
    );
  }

  // Case 2: Video is ready
  if (videoPath) {
    return (
      <div className="w-full aspect-video relative bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          className="w-full h-full"
          controls
          autoPlay
          loop
          src={`/api/video?path=${encodeURIComponent(videoPath)}`}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Case 3: Image preview is ready
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
          <p className="text-white text-lg font-semibold p-4 bg-black/70 rounded-md text-center">
            Conceptual Image Preview
          </p>
        </div>
      </div>
    );
  }

  // Case 4: Initial state or generation failed
  return (
    <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 text-center">
      <Film className="w-16 h-16 text-muted-foreground/70 mb-4" />
      <p className="text-muted-foreground">
        Enter a prompt to generate an animation.
      </p>
    </div>
  );
}
