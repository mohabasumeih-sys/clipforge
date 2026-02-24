import { NextResponse } from 'next/server'
import { processVideoWithAI } from '@/lib/ai-processor'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { videoId, transcript } = await request.json()
    
    if (!videoId || !transcript) {
      return NextResponse.json(
        { error: 'Missing videoId or transcript' },
        { status: 400 }
      )
    }
    
    // Process with Gemini
    const result = await processVideoWithAI('video', transcript)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
    
    // Save results to database
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        transcript: transcript,
        clips: result.clips,
        processed_at: new Date().toISOString(),
        status: 'processed'
      })
      .eq('id', videoId)
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      clips: result.clips
    })
    
  } catch (error) {
    console.error('Process API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}