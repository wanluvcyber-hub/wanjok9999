import { createClient } from '@supabase/supabase-js'

// Support both Vite (import.meta.env) and Node/Nitro (process.env)
const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL as string) || (process.env?.VITE_SUPABASE_URL as string)
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || (process.env?.VITE_SUPABASE_ANON_KEY as string)

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase URL or Anon Key is missing. Please check your .env file.')
  } else {
    // Server-side logging
    console.error('SERVER ERROR: Supabase configuration missing!')
    console.error('URL:', supabaseUrl ? 'Set' : 'Missing')
    console.error('Key:', supabaseAnonKey ? 'Set' : 'Missing')
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
