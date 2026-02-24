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
    if (!file) return
    if (!user) {
      alert('Please sign in first')
      return
    }

    setUploading(true)

    const { data, error } = await supabase
      .from('videos')
      .insert([
        { 
          filename: file.name, 
          status: 'pending',
          user_id: user.id
        }
      ])
      .select()

    setUploading(false)

    if (error) {
      alert('Error: ' + error.message)
      console.error(error)
    } else {
      alert('Video saved! ID: ' + data[0].id)
      setFile(null)
    }
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFile}
      />
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
            {uploading ? 'Saving...' : 'Upload Video'}
          </button>
        </div>
      )}
    </div>
  )
}