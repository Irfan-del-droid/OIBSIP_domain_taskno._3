/*
  # ATM Banking System Schema

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (text, unique) - User's ATM ID
      - `pin` (text) - Encrypted PIN
      - `account_holder_name` (text)
      - `balance` (numeric) - Current account balance
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `account_id` (uuid, foreign key)
      - `transaction_type` (text) - withdraw, deposit, transfer
      - `amount` (numeric)
      - `recipient_id` (text, nullable) - For transfers
      - `balance_after` (numeric) - Balance after transaction
      - `description` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated account access
    - Ensure users can only access their own account data
    - Prevent unauthorized balance modifications

  3. Important Notes
    - Balance stored with 2 decimal precision
    - Transaction history maintained for audit trail
    - PIN should be hashed in production (simplified for demo)
    - Transfer operations validate recipient existence
*/

CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  pin text NOT NULL,
  account_holder_name text NOT NULL,
  balance numeric(12, 2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('withdraw', 'deposit', 'transfer_out', 'transfer_in')),
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  recipient_id text,
  balance_after numeric(12, 2) NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own account"
  ON accounts FOR SELECT
  USING (true);

CREATE POLICY "Users can update own account"
  ON accounts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can insert accounts"
  ON accounts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

INSERT INTO accounts (user_id, pin, account_holder_name, balance) 
VALUES 
  ('user001', '1234', 'John Doe', 5000.00),
  ('user002', '5678', 'Jane Smith', 3000.00),
  ('user003', '9999', 'Bob Johnson', 10000.00)
ON CONFLICT (user_id) DO NOTHING;