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

    // Create the quality-specific directory
    const qualityDir = config?.resolution === '720p' ? '720p30' : '1080p60';
    const finalOutputDir = path.join(outputDir, qualityDir);
    await mkdir(finalOutputDir, { recursive: true });

    // Properly escape the prompt for Python string
    const escapedPrompt = prompt
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');

    // Create a temporary Python script for this animation
    const pythonCode = `
import sys
import os
import shutil

# Add the project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from animation_generator import create_animation
from manim import *

# Create the scene
scene_class = create_animation("""${escapedPrompt}""")
scene = scene_class()

# Configure the scene
config.output_file = "AnimationScene"
config.media_dir = "${path.join(process.cwd(), '..', 'media').replace(/\\/g, '/')}"
config.quality = "medium_quality"
config.frame_rate = 30
config.pixel_height = ${config?.resolution === '720p' ? 720 : 1080}
config.pixel_width = ${config?.resolution === '720p' ? 1280 : 1920}

# Render the scene
scene.render()

# Move the video file to the correct location
quality_dir = "${qualityDir}"
output_video_dir = os.path.join("${outputDir.replace(/\\/g, '/')}", quality_dir)
os.makedirs(output_video_dir, exist_ok=True)

# Find and move the generated video file
media_dir = os.path.join("${path.join(process.cwd(), '..', 'media', 'videos', '1080p60').replace(/\\/g, '/')}")
if os.path.exists(media_dir):
    for file in os.listdir(media_dir):
        if file.endswith(".mp4"):
            src_path = os.path.join(media_dir, file)
            dst_path = os.path.join(output_video_dir, "AnimationScene.mp4")
            if os.path.exists(dst_path):
                os.remove(dst_path)
            shutil.move(src_path, dst_path)
            break

# Clean up the temporary directories
temp_dirs = [
    os.path.join("${path.join(process.cwd(), '..', 'media', 'videos', '1080p60').replace(/\\/g, '/')}", "partial_movie_files"),
    os.path.join("${path.join(process.cwd(), '..', 'media', 'images').replace(/\\/g, '/')}"),
    os.path.join("${path.join(process.cwd(), '..', 'media', 'texts').replace(/\\/g, '/')}")
]
for temp_dir in temp_dirs:
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
`;

    const pythonFilePath = path.join(process.cwd(), '..', 'temp_animation.py');
    await writeFile(pythonFilePath, pythonCode);

    // Run manim command
    return new Promise((resolve) => {
      const venvPython = path.join(process.cwd(), '..', 'venv', 'bin', 'python3');
      const projectDir = path.join(process.cwd(), '..');
      const manim = spawn(venvPython, [pythonFilePath], {
        cwd: process.cwd() + '/..',
        env: {
          ...process.env,
          PYTHONPATH: projectDir
        }
      });

      let error = '';

      manim.stderr.on('data', (data) => {
        error += data.toString();
      });

      manim.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'ENOENT') {
          resolve(NextResponse.json({
            success: false,
            error: `Python executable not found in virtual environment. Please make sure the virtual environment is set up correctly.`
          }, { status: 500 }));
          return;
        }
        resolve(NextResponse.json({
          success: false,
          error: `Animation generation failed: ${err.message}`
        }, { status: 500 }));
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
        const videoPath = `media/videos/${timestamp}/${qualityDir}/AnimationScene.mp4`;
        
        // Verify the file exists
        const fullPath = path.join(process.cwd(), '..', videoPath);
        if (!require('fs').existsSync(fullPath)) {
          resolve(NextResponse.json({
            success: false,
            error: `Video file was not generated at the expected location: ${videoPath}. Please check the media directory for the generated files.`
          }, { status: 500 }));
          return;
        }
        
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