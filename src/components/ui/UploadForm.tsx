'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'

export default function UploadForm() {
  const { user } = useUser()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file || !user) return
    setUploading(true)
    setProgress('Creating record...')

    try {
      // Step 1: Create video record in Supabase
      const { data, error } = await supabase
        .from('videos')
        .insert([{ filename: file.name, status: 'pending', user_id: user.id }])
        .select()

      if (error || !data) {
        alert('Error: ' + error?.message)
        setUploading(false)
        return
      }

      const videoId = data[0].id
      setProgress('Getting upload URL...')

      // Step 2: Get presigned URL from our API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          videoId,
          filename: file.name,
          contentType: file.type || 'video/mp4'
        })
      })

      const { presignedUrl, error: urlError } = await response.json()

      if (urlError || !presignedUrl) {
        alert('Failed to get upload URL: ' + urlError)
        setUploading(false)
        return
      }

      setProgress('Uploading to S3...')

      // Step 3: Upload directly to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'video/mp4' }
      })

      if (!uploadResponse.ok) {
        alert('S3 upload failed')
        setUploading(false)
        return
      }

      // Step 4: Mark as uploaded in Supabase
      await supabase.from('videos')
        .update({ status: 'uploaded' })
        .eq('id', videoId)

      setProgress('')
      setFile(null)
      alert('Video uploaded successfully! Click "Process with AI" to generate clips.')

    } catch (error) {
      alert('Upload failed: ' + error)
    }

    setUploading(false)
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <input type="file" accept="video/*" onChange={handleFile} />
      {file && (
        <div style={{ marginTop: '10px' }}>
          <p>Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              padding: '10px 20px',
              background: uploading ? '#666' : 'white',
              color: 'black',
              border: 'none',
              cursor: uploading ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            {uploading ? progress || 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      )}
    </div>
  )
}