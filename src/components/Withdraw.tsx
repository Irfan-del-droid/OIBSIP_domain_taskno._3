import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase, Account } from '../lib/supabase';

interface WithdrawProps {
  account: Account;
  onBack: () => void;
  onSuccess: () => void;
}

export function Withdraw({ account, onBack, onSuccess }: WithdrawProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > parseFloat(account.balance.toString())) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      const newBalance = parseFloat(account.balance.toString()) - withdrawAmount;

      const { error: updateError } = await supabase
        .from('accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: account.id,
          transaction_type: 'withdraw',
          amount: withdrawAmount,
          balance_after: newBalance,
          description: 'Cash withdrawal',
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

  const quickAmounts = [20, 50, 100, 200];

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Menu
      </button>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">Withdraw Cash</h3>
      <p className="text-gray-600 mb-6">
        Available Balance: ${parseFloat(account.balance.toString()).toFixed(2)}
      </p>

      <form onSubmit={handleWithdraw} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Withdraw
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
            Withdrawal successful!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </form>
    </div>
  );
}
