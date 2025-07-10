import { createClient } from "@supabase/supabase-js";

/**
 * PUBLIC_INTERFACE
 * Supabase client instance, initialized from environment variables.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
