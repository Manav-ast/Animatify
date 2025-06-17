import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { prompt, config } = await req.json();

    // Create a unique directory for this generation
    const timestamp = Date.now();
    const outputDir = path.join(process.cwd(), '..', 'media', 'videos', timestamp.toString());
    await mkdir(outputDir, { recursive: true });

    // Properly escape the prompt for Python string
    const escapedPrompt = prompt
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');

    // Create a temporary Python script for this animation
    const pythonCode = `
from animation_generator import create_animation
from manim import *

# Create the scene
scene_class = create_animation("""${escapedPrompt}""")
scene = scene_class()

# Configure the scene
config.output_file = "animation"
config.media_dir = "${outputDir.replace(/\\/g, '/')}"
config.quality = "medium_quality"
config.frame_rate = 30
config.pixel_height = ${config?.resolution === '720p' ? 720 : 1080}
config.pixel_width = ${config?.resolution === '720p' ? 1280 : 1920}

# Render the scene
scene.render()
`;

    const pythonFilePath = path.join(process.cwd(), '..', 'temp_animation.py');
    await writeFile(pythonFilePath, pythonCode);

    // Run manim command
    return new Promise((resolve) => {
      const manim = spawn('python', [pythonFilePath], {
        cwd: process.cwd() + '/..'
      });

      let error = '';

      manim.stderr.on('data', (data) => {
        error += data.toString();
      });

      manim.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json({
            success: false,
            error: `Animation generation failed: ${error}`
          }, { status: 500 }));
          return;
        }

        // Find the generated video file
        const videoPath = `media/videos/${timestamp}/1080p60/AnimationScene.mp4`;
        
        resolve(NextResponse.json({
          success: true,
          videoPath,
          code: pythonCode
        }));
      });
    });

  } catch (error: any) {
    console.error('Error generating animation:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}