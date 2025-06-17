"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      setVideoPath(null);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate video");
      }

      setVideoPath(data.videoPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error generating video:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (videoPath) {
      const link = document.createElement("a");
      link.href = videoPath;
      link.download = "animation.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Generate Animation</h2>

        <div className="space-y-4">
          <Textarea
            placeholder="Enter your animation text..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Animation...
              </>
            ) : (
              "Generate Animation"
            )}
          </Button>

          {error && (
            <div className="text-red-500 mt-2 p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {videoPath && (
            <div className="mt-6 space-y-4">
              <video
                controls
                className="w-full rounded-lg shadow-lg"
                src={videoPath}
                poster="/loading-poster.png"
              />

              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full"
              >
                Download Animation
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
