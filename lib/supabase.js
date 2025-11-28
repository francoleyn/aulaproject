import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qfryjissmvkbzdmwelsa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcnlqaXNzbXZrYnpkbXdlbHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTE1ODUsImV4cCI6MjA3OTkyNzU4NX0.oxi7ELmu5HCwUJO11nabXRvmwiDlIQivi3BmQxRtuMc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)