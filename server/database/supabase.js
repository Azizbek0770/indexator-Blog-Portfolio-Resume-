import dotenv from 'dotenv';

import { createClient } from '@supabase/supabase-js';

dotenv.config({ override: true });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

// Helper function to handle database errors
export const handleDbError = (error) => {
  console.error('Database Error:', error);
  return {
    status: 'error',
    message: error.message || 'Database operation failed',
    data: null
  };
};

// Helper function to format success response
export const formatResponse = (data, message = 'Success') => {
  return {
    status: 'success',
    message,
    data
  };
};

export default supabase;
