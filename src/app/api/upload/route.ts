import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const s3 = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(request: Request) {
  try {
    const { userId, videoId, filename, contentType } = await request.json();

    if (!userId || !videoId || !filename) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const s3Key = `uploads/${userId}/${videoId}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      ContentType: contentType || 'video/mp4'
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    await supabase.from('videos').update({
      status: 'uploading',
      s3_key: s3Key
    }).eq('id', videoId);

    return NextResponse.json({ presignedUrl, s3Key });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}