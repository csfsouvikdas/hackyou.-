import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ofkhjeaefibzqekroegd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Xf3QH-StpL7WfO0whiY2BA_seegiJsM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
