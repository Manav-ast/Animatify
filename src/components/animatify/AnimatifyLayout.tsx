"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ParameterControls } from "./ParameterControls";
import { CodeDisplay } from "./CodeDisplay";
import {
  generateManimCode,
  type GenerateManimCodeInput,
} from "@/ai/flows/generate-manim-code";
import {
  addComments,
  type AddCommentsInput,
} from "@/ai/flows/add-comments-to-code";
import { useToast } from "@/hooks/use-toast";
import { Download, Sparkles, Loader2, AlertCircle } from "lucide-react";
import type { ChangeEventFC } from "@/types/ui";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimationPreview } from "./AnimationPreview";

export function AnimatifyLayout() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [commentedCode, setCommentedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoPath, setVideoPath] = useState<string | null>(null);

  const [duration, setDuration] = useState<number>(5);
  const [resolution, setResolution] = useState<string>("1080p");
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000");

  const { toast } = useToast();

  const handleGenerateAnimation = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt is empty",
        description: "Please enter a description for your animation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);
    setCommentedCode(null);
    setVideoPath(null);

    try {
      // Generate Video
      toast({
        title: "Generating Animation...",
        description: "Running Manim and rendering animation.",
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          config: {
            duration,
            resolution,
            backgroundColor,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate video");
      }

      setVideoPath(data.videoPath);
      setGeneratedCode(data.code || null);

      toast({
        title: "Animation Generated!",
        description: "Your animation video is ready.",
      });
    } catch (e: any) {
      console.error("Error generating animation:", e);
      const errorMessage =
        e.message ||
        "An unexpected error occurred while generating the animation.";
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = () => {
    if (videoPath) {
      const link = document.createElement("a");
      link.href = videoPath;
      link.download = "animation.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Download Started",
        description: `animation.mp4 is downloading.`,
      });
    }
  };

  const downloadFile = (filename: string, text: string | null) => {
    if (!text) {
      toast({
        title: "Nothing to download",
        description: "No code has been generated yet.",
        variant: "destructive",
      });
      return;
    }
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Download Started",
      description: `${filename} is downloading.`,
    });
  };

  const handleDurationChange: ChangeEventFC<HTMLInputElement> = (e) =>
    setDuration(Number(e.target.value));
  const handleResolutionChange = (value: string) => setResolution(value);
  const handleBackgroundColorChange: ChangeEventFC<HTMLInputElement> = (e) =>
    setBackgroundColor(e.target.value);

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6 flex-1 min-h-[calc(100vh-var(--header-height,80px))]">
        {/* Left Panel */}
        <div className="lg:w-2/5 flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Configure Your Animation
              </CardTitle>
              <CardDescription>
                Describe your animation and set parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ParameterControls
                duration={duration}
                onDurationChange={handleDurationChange}
                resolution={resolution}
                onResolutionChange={handleResolutionChange}
                backgroundColor={backgroundColor}
                onBackgroundColorChange={handleBackgroundColorChange}
              />
              <div className="space-y-2">
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-foreground"
                >
                  Animation Prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A circle transforming into a square, with Pi symbol animation"
                  value={prompt}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setPrompt(e.target.value)
                  }
                  rows={4}
                  className="focus:ring-primary focus:border-primary"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleGenerateAnimation}
                disabled={isLoading}
                className="w-full transition-all duration-150 ease-in-out hover:shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Animation
              </Button>
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1 whitespace-pre-line">
                  <AlertCircle size={16} /> {error}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Generated Manim Code
              </CardTitle>
              <CardDescription>
                Review the Python code for your animation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <CodeDisplay code={commentedCode || generatedCode} />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() =>
                  downloadFile(
                    "animation_code.py",
                    commentedCode || generatedCode
                  )
                }
                disabled={(!commentedCode && !generatedCode) || isLoading}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Code
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:w-3/5 flex flex-col">
          <Card className="shadow-lg flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Animation Video
              </CardTitle>
              <CardDescription>
                Your generated animation video will appear below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-2 md:p-6 bg-card">
              <AnimationPreview
                isLoadingOverall={isLoading}
                imagePreviewUrl={null}
                videoPath={videoPath}
              />
            </CardContent>
            {videoPath && (
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                <Button
                  variant="default"
                  onClick={() => {
                    const videoUrl = `/api/video?path=${encodeURIComponent(
                      videoPath
                    )}`;
                    const link = document.createElement("a");
                    link.href = videoUrl;
                    link.download = "animation.mp4";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Video (MP4)
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
