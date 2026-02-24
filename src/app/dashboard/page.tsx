'use client'

import { UserButton, useUser } from "@clerk/nextjs";
import UploadForm from "@/components/ui/UploadForm";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user } = useUser();
  const [videos, setVideos] = useState<any[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setVideos(data);
  };

  const processVideo = async (videoId: string) => {
    setProcessing(videoId);
    
    // For now, use a dummy transcript
    // Later we'll get this from Whisper API
    const dummyTranscript = `
    Welcome to the show! Today we're talking about how to grow on social media.
    The first tip is to post consistently. Many creators give up after 2 weeks.
    The second tip is to engage with your audience. Reply to every comment.
    The third tip is to use trending sounds and hashtags.
    Thanks for watching! Subscribe for more content.
    `;
    
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, transcript: dummyTranscript }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Processing complete! Found ${result.clips.length} clips.`);
        fetchVideos();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to process video');
    }
    
    setProcessing(null);
  };

  return (
    <div style={{ background: 'black', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>ClipForge Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <UploadForm />
      
      <div style={{ marginTop: '40px' }}>
        <h2>Your Videos</h2>
        {videos.length === 0 ? (
          <p>No videos yet. Upload one above!</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            {videos.map((video) => (
              <div key={video.id} style={{ 
                padding: '20px', 
                border: '1px solid #333', 
                borderRadius: '8px',
                background: '#111'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{video.filename}</h3>
                    <p style={{ margin: '5px 0', color: '#888', fontSize: '14px' }}>
                      Status: {video.status} | Uploaded: {new Date(video.created_at).toLocaleDateString()}
                    </p>
                    {video.clips && (
                      <p style={{ margin: '5px 0', color: '#4ade80', fontSize: '14px' }}>
                        {video.clips.length} clips generated
                      </p>
                    )}
                  </div>
                  
                  {video.status === 'pending' && (
                    <button
                      onClick={() => processVideo(video.id)}
                      disabled={processing === video.id}
                      style={{
                        padding: '10px 20px',
                        background: processing === video.id ? '#666' : 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: processing === video.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {processing === video.id ? 'Processing...' : 'Process with AI'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}