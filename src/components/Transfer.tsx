import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase, Account } from '../lib/supabase';

interface TransferProps {
  account: Account;
  onBack: () => void;
  onSuccess: () => void;
}

export function Transfer({ account, onBack, onSuccess }: TransferProps) {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (transferAmount > parseFloat(account.balance.toString())) {
      setError('Insufficient balance');
      return;
    }

    if (recipientId === account.user_id) {
      setError('Cannot transfer to your own account');
      return;
    }

    setLoading(true);

    try {
      const { data: recipientData, error: recipientError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', recipientId)
        .maybeSingle();

      if (recipientError) throw recipientError;

      if (!recipientData) {
        setError('Recipient account not found');
        setLoading(false);
        return;
      }

      const newSenderBalance = parseFloat(account.balance.toString()) - transferAmount;
      const newRecipientBalance = parseFloat(recipientData.balance.toString()) + transferAmount;

      const { error: senderUpdateError } = await supabase
        .from('accounts')
        .update({ balance: newSenderBalance, updated_at: new Date().toISOString() })
        .eq('id', account.id);

      if (senderUpdateError) throw senderUpdateError;

      const { error: recipientUpdateError } = await supabase
        .from('accounts')
        .update({ balance: newRecipientBalance, updated_at: new Date().toISOString() })
        .eq('id', recipientData.id);

      if (recipientUpdateError) throw recipientUpdateError;

      const { error: senderTransactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: account.id,
          transaction_type: 'transfer_out',
          amount: transferAmount,
          recipient_id: recipientId,
          balance_after: newSenderBalance,
          description: `Transfer to ${recipientData.account_holder_name}`,
        });

      if (senderTransactionError) throw senderTransactionError;

      const { error: recipientTransactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: recipientData.id,
          transaction_type: 'transfer_in',
          amount: transferAmount,
          recipient_id: account.user_id,
          balance_after: newRecipientBalance,
          description: `Transfer from ${account.account_holder_name}`,
        });

      if (recipientTransactionError) throw recipientTransactionError;

      setSuccess(true);
      setAmount('');
      setRecipientId('');
      onSuccess();
    } catch (err) {
      setError('Transfer failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Menu
      </button>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">Transfer Funds</h3>
      <p className="text-gray-600 mb-6">
        Available Balance: ${parseFloat(account.balance.toString()).toFixed(2)}
      </p>

      <form onSubmit={handleTransfer} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient User ID
          </label>
          <input
            type="text"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            placeholder="Enter recipient's User ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transfer Amount
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Transfer successful!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Processing...' : 'Transfer'}
        </button>

        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-medium mb-1">Available Test Accounts:</p>
          <p className="text-xs">user001, user002, user003</p>
        </div>
      </form>
    </div>
  );
}
