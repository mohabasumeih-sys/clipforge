import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { supabase } from '@/lib/supabase';

const s3 = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const videoId = formData.get('videoId') as string;
    
    if (!file || !userId || !videoId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const s3Key = `uploads/${userId}/${videoId}/${file.name}`;
    
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type
    }));
    
    await supabase.from('videos').update({
      status: 'uploaded',
      s3_key: s3Key
    }).eq('id', videoId);
    
    return NextResponse.json({ success: true, s3Key });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}