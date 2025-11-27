import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { supabase, Transaction } from '../lib/supabase';

interface TransactionHistoryProps {
  accountId: string;
  onBack: () => void;
}

export function TransactionHistory({ accountId, onBack }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [accountId]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'deposit' || type === 'transfer_in') {
      return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
    }
    return <ArrowUpCircle className="w-5 h-5 text-red-600" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === 'deposit' || type === 'transfer_in') {
      return 'text-green-600';
    }
    return 'text-red-600';
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

      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction History
      </h3>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getTransactionIcon(transaction.transaction_type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(transaction.created_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                    {transaction.recipient_id && (
                      <div className="text-sm text-gray-600 mt-1">
                        To: {transaction.recipient_id}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`font-semibold text-lg ${getTransactionColor(transaction.transaction_type)}`}>
                    {(transaction.transaction_type === 'deposit' || transaction.transaction_type === 'transfer_in') ? '+' : '-'}
                    ${parseFloat(transaction.amount.toString()).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Balance: ${parseFloat(transaction.balance_after.toString()).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
