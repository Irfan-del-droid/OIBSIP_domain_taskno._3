import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Account {
  id: string;
  user_id: string;
  pin: string;
  account_holder_name: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  transaction_type: 'withdraw' | 'deposit' | 'transfer_out' | 'transfer_in';
  amount: number;
  recipient_id: string | null;
  balance_after: number;
  description: string;
  created_at: string;
}
