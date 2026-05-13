import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://oyubcaiqgzgwheflpsra.supabase.co'
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dWJjYWlxZ3pnd2hlZmxwc3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Njk1NzksImV4cCI6MjA5NDI0NTU3OX0.kbXEMLjcQ_BIFsVWWFLxf9VE_Fo_0khSpcYEEIIEMlo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)