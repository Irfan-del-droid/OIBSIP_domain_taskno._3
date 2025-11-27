import { useState, useEffect } from 'react';
import { LogOut, User, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TransactionHistory } from './TransactionHistory';
import { Withdraw } from './Withdraw';
import { Deposit } from './Deposit';
import { Transfer } from './Transfer';
import { supabase, Account } from '../lib/supabase';

type View = 'menu' | 'history' | 'withdraw' | 'deposit' | 'transfer';

export function ATMDashboard() {
  const { account, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('menu');
  const [currentAccount, setCurrentAccount] = useState<Account | null>(account);

  useEffect(() => {
    if (account) {
      refreshAccount();
    }
  }, [account]);

  const refreshAccount = async () => {
    if (!account) return;

    const { data } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', account.id)
      .maybeSingle();

    if (data) {
      setCurrentAccount(data);
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleBackToMenu = async () => {
    await refreshAccount();
    setCurrentView('menu');
  };

  if (!currentAccount) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">
                    {currentAccount.account_holder_name}
                  </h2>
                </div>
                <p className="text-emerald-100 text-sm">
                  ID: {currentAccount.user_id}
                </p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 text-emerald-100 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Available Balance
              </div>
              <div className="text-3xl font-bold">
                ${parseFloat(currentAccount.balance.toString()).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="p-6">
            {currentView === 'menu' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  What would you like to do?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleViewChange('history')}
                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border-2 border-blue-200 transition text-left group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      📋
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-1">
                      Transaction History
                    </h4>
                    <p className="text-gray-600 text-sm">
                      View all your transactions
                    </p>
                  </button>

                  <button
                    onClick={() => handleViewChange('withdraw')}
                    className="p-6 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl border-2 border-red-200 transition text-left group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      💸
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-1">
                      Withdraw
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Withdraw cash from account
                    </p>
                  </button>

                  <button
                    onClick={() => handleViewChange('deposit')}
                    className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl border-2 border-green-200 transition text-left group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      💰
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-1">
                      Deposit
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Deposit cash to account
                    </p>
                  </button>

                  <button
                    onClick={() => handleViewChange('transfer')}
                    className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border-2 border-purple-200 transition text-left group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      🔄
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-1">
                      Transfer
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Transfer to another account
                    </p>
                  </button>
                </div>
              </div>
            )}

            {currentView === 'history' && (
              <TransactionHistory
                accountId={currentAccount.id}
                onBack={handleBackToMenu}
              />
            )}

            {currentView === 'withdraw' && (
              <Withdraw
                account={currentAccount}
                onBack={handleBackToMenu}
                onSuccess={refreshAccount}
              />
            )}

            {currentView === 'deposit' && (
              <Deposit
                account={currentAccount}
                onBack={handleBackToMenu}
                onSuccess={refreshAccount}
              />
            )}

            {currentView === 'transfer' && (
              <Transfer
                account={currentAccount}
                onBack={handleBackToMenu}
                onSuccess={refreshAccount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
