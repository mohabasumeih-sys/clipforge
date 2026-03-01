'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'

export default function UploadForm() {
  const { user } = useUser()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !user) return
    setUploading(true)

    try {
      // Step 1: Create video record in Supabase
      const { data, error } = await supabase
        .from('videos')
        .insert([{ filename: file.name, status: 'pending', user_id: user.id }])
        .select()

      if (error || !data) {
        alert('Error creating record: ' + error?.message)
        setUploading(false)
        return
      }

      const videoId = data[0].id

      // Step 2: Upload file to S3 via API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)
      formData.append('videoId', videoId)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        alert('S3 upload failed: ' + uploadResult.error)
        setUploading(false)
        return
      }

      alert('Video uploaded successfully! You can now click "Process with AI"')
      setFile(null)

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
          <p>Selected: {file.name}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: 'black',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {uploading ? 'Uploading to S3...' : 'Upload Video'}
          </button>
        </div>
      )}
    </div>
  )
}