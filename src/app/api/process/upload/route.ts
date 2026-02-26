import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import { queueVideoProcessing } from '@/lib/sqs';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const videoId = formData.get('videoId') as string;
    
    if (!file || !userId || !videoId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    
    // Upload to S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const s3Key = `uploads/${userId}/${videoId}/${file.name}`;
    
    await uploadToS3(buffer, s3Key);
    
    // Update database
    await supabase.from('videos').update({
      status: 'uploaded',
      s3_key: s3Key
    }).eq('id', videoId);
    
    // Queue for processing (after AI generates clips)
    // This happens after your Groq API call
    
    return NextResponse.json({ success: true, s3Key });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}