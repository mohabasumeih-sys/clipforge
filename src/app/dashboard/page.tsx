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
                
                {/* Show clips with download links */}
                {video.clips && video.clips.length > 0 && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Generated Clips:</h4>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {video.clips.map((clip: any, index: number) => (
                        <div key={index} style={{ 
                          padding: '10px', 
                          background: '#222', 
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{clip.hook || `Clip ${index + 1}`}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888' }}>
                              {Math.floor(clip.start / 60)}:{String(clip.start % 60).padStart(2, '0')} - {Math.floor(clip.end / 60)}:{String(clip.end % 60).padStart(2, '0')}
                            </p>
                          </div>
                          {clip.url ? (
                            <a 
                              href={clip.url} 
                              download
                              style={{
                                padding: '8px 16px',
                                background: '#4ade80',
                                color: 'black',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}
                            >
                              Download
                            </a>
                          ) : (
                            <span style={{ color: '#666', fontSize: '12px' }}>Processing...</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}