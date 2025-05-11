// src/shared/lib/supabase.client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ou anon key se só for upload público

export const supabase = createClient(supabaseUrl, supabaseKey);