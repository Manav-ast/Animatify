import { NextResponse } from 'next/server';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return new NextResponse('Video path is required', { status: 400 });
    }

    // Ensure the path is within our media directory
    const fullPath = join(process.cwd(), '..', path);
    if (!fullPath.startsWith(join(process.cwd(), '..'))) {
      return new NextResponse('Invalid video path', { status: 403 });
    }

    const stat = statSync(fullPath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const stream = createReadStream(fullPath, { start, end });

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }

    const stream = createReadStream(fullPath);
    return new NextResponse(stream as any, {
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4',
      },
    });
  } catch (error) {
    console.error('Video streaming error:', error);
    return new NextResponse('Error streaming video', { status: 500 });
  }
}
