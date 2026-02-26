import { NextResponse } from 'next/server';
import { queueVideoProcessing } from '@/lib/sqs';

export async function POST(request: Request) {
  try {
    const { videoId, userId, filename, clips } = await request.json();
    
    await queueVideoProcessing({
      videoId,
      userId,
      filename,
      clips
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Video queued for processing' 
    });
    
  } catch (error) {
    console.error('Queue error:', error);
    return NextResponse.json({ error: 'Failed to queue' }, { status: 500 });
  }
}