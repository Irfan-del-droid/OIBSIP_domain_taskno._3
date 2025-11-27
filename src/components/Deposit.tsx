import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase, Account } from '../lib/supabase';

interface DepositProps {
  account: Account;
  onBack: () => void;
  onSuccess: () => void;
}

export function Deposit({ account, onBack, onSuccess }: DepositProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const newBalance = parseFloat(account.balance.toString()) + depositAmount;

      const { error: updateError } = await supabase
        .from('accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: account.id,
          transaction_type: 'deposit',
          amount: depositAmount,
          balance_after: newBalance,
          description: 'Cash deposit',
        });

      if (transactionError) throw transactionError;

      setSuccess(true);
      setAmount('');
      onSuccess();
    } catch (err) {
      setError('Transaction failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 500, 1000];

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Menu
      </button>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">Deposit Cash</h3>
      <p className="text-gray-600 mb-6">
        Current Balance: ${parseFloat(account.balance.toString()).toFixed(2)}
      </p>

      <form onSubmit={handleDeposit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Deposit
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Amount
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Deposit successful!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </form>
    </div>
  );
}
