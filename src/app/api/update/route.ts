import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { videoId, clips } = await request.json();
    
    await supabase
      .from('videos')
      .update({
        clips: clips,
        status: 'completed'
      })
      .eq('id', videoId);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}