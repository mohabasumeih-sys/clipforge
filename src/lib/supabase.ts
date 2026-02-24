import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('URL:', supabaseUrl)
console.log('Key starts with:', supabaseKey?.substring(0, 20))

export const supabase = createClient(supabaseUrl, supabaseKey)