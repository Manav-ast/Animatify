"use client";

import type { ChangeEventFC } from '@/types/ui';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ParameterControlsProps {
  duration: number;
  onDurationChange: ChangeEventFC<HTMLInputElement>;
  resolution: string;
  onResolutionChange: (value: string) => void;
  backgroundColor: string;
  onBackgroundColorChange: ChangeEventFC<HTMLInputElement>;
}

export function ParameterControls({
  duration,
  onDurationChange,
  resolution,
  onResolutionChange,
  backgroundColor,
  onBackgroundColorChange,
}: ParameterControlsProps) {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-accent">
        <AlertTriangle className="h-4 w-4 !text-accent" />
        <AlertTitle className="font-headline text-accent">Illustrative Parameters</AlertTitle>
        <AlertDescription>
          These parameters are for demonstration purposes. The current AI model does not use them to generate the animation.
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <Label htmlFor="duration" className="font-medium">Duration (seconds)</Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={onDurationChange}
          min="1"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resolution" className="font-medium">Resolution</Label>
        <Select value={resolution} onValueChange={onResolutionChange}>
          <SelectTrigger id="resolution" className="w-full">
            <SelectValue placeholder="Select resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="720p">720p (1280x720)</SelectItem>
            <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
            <SelectItem value="4k">4K (3840x2160)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="backgroundColor" className="font-medium">Background Color</Label>
        <div className="flex items-center gap-2">
           <Input
            id="backgroundColorInput"
            type="text"
            value={backgroundColor}
            onChange={onBackgroundColorChange}
            placeholder="#RRGGBB"
            className="w-full"
          />
          <Input
            id="backgroundColorPicker"
            type="color"
            value={backgroundColor}
            onChange={onBackgroundColorChange}
            className="w-12 h-10 p-1 shrink-0"
            aria-label="Background color picker"
          />
        </div>
      </div>
    </div>
  );
}
