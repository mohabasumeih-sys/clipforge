import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
})

export async function processVideoWithAI(filename: string, transcript: string) {
  try {
    const prompt = `
    Analyze this video transcript and find 5-10 viral clip moments.
    For each moment, provide:
    1. Start timestamp (in seconds)
    2. End timestamp (in seconds) 
    3. A catchy hook/title for the clip
    4. Why this moment is engaging
    
    Transcript:
    ${transcript.substring(0, 30000)}
    
    Return ONLY a JSON array like this:
    [
      {
        "start": 120,
        "end": 145,
        "hook": "The shocking truth about...",
        "reason": "High emotional peak with controversy"
      }
    ]
    `
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 2000
    })
    
    const text = completion.choices[0]?.message?.content || ''
    
    // Parse the JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    const clips = JSON.parse(jsonMatch[0])
    
    return {
      success: true,
      clips: clips,
      rawResponse: text
    }
    
  } catch (error) {
    console.error('AI processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      clips: []
    }
  }
}