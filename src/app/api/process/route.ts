import { NextResponse } from 'next/server';
import { processVideoWithAI } from '@/lib/ai-processor';
import { supabase } from '@/lib/supabase';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

// Using REGION as requested (not AWS_REGION)
const sqs = new SQSClient({
  region: process.env.REGION || 'ap-southeast-2',
});

export async function POST(request: Request) {
  try {
    const { videoId, transcript } = await request.json();
    
    const { data: video } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const result = await processVideoWithAI(video.filename, transcript);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    await supabase
      .from('videos')
      .update({
        transcript: transcript,
        clips: result.clips,
        status: 'processing'
      })
      .eq('id', videoId);

    await sqs.send(new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL!,
      MessageBody: JSON.stringify({
        videoId,
        userId: video.user_id,
        filename: video.filename,
        clips: result.clips
      })
    }));

    return NextResponse.json({
      success: true,
      clips: result.clips,
      message: 'Video queued for processing'
    });
    
  } catch (error) {
    console.error('Process error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}