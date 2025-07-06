import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext.tsx';

// Add TypeScript declaration for Petra wallet
declare global {
  interface Window {
    aptos?: any;
  }
}

interface ProfileProps {
  platformBalance: number;
  setPlatformBalance: (balance: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ platformBalance, setPlatformBalance }) => {
  const { isConnected, balance, address } = useWallet();
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<Array<{
    type: 'deposit' | 'withdraw';
    amount: number;
    fee?: number;
    timestamp: string;
    hash?: string;
  }>>([]);

  const handleDeposit = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!window.aptos) {
      alert('Petra wallet not found!');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (balance !== null && amount > balance) {
      alert('Insufficient wallet balance');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Always prompt connection (triggers popup if not connected)
      await window.aptos.connect();
      
      // Send the deposit amount to a platform address (using user's own address for demo)
      const payload = {
        type: 'entry_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [address, (amount * 100000000).toString()] // Convert APT to octas
      };
      
      const tx = await window.aptos.signAndSubmitTransaction(payload);
      
      // Update platform balance
      setPlatformBalance(platformBalance + amount);
      
      // Add to transaction history
      setTransactionHistory(prev => [{
        type: 'deposit',
        amount,
        timestamp: new Date().toLocaleString(),
        hash: tx.hash
      }, ...prev]);
      
      setDepositAmount('');
      alert(`Successfully deposited ${amount.toFixed(4)} APT to platform. Transaction: ${tx.hash}`);
    } catch (error) {
      alert('Deposit failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!window.aptos) {
      alert('Petra wallet not found!');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > platformBalance) {
      alert('Insufficient platform balance');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Calculate 2% platform fee
      const fee = amount * 0.02;
      const netAmount = amount - fee;
      
      // Always prompt connection (triggers popup if not connected)
      await window.aptos.connect();
      
      // Send the withdrawal amount to user's wallet (using user's own address for demo)
      const payload = {
        type: 'entry_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [address, (netAmount * 100000000).toString()] // Convert APT to octas
      };
      
      const tx = await window.aptos.signAndSubmitTransaction(payload);
      
      // Update platform balance
      setPlatformBalance(platformBalance - amount);
      
      // Add to transaction history
      setTransactionHistory(prev => [{
        type: 'withdraw',
        amount: netAmount,
        fee,
        timestamp: new Date().toLocaleString(),
        hash: tx.hash
      }, ...prev]);
      
      setWithdrawAmount('');
      alert(`Successfully withdrew ${netAmount.toFixed(4)} APT (${fee.toFixed(4)} APT fee applied). Transaction: ${tx.hash}`);
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-lg font-medium">Wallet Not Connected</p>
            <p className="text-sm">Connect your Petra wallet to access your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-card p-4 md:p-6 max-w-md mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4 gradient-text text-center">Profile</h2>
      {/* Wallet Info */}
      <div className="mb-4 p-3 glass rounded-xl">
        <h3 className="text-base font-bold text-blue-200 mb-2 flex items-center gap-2">
          <span className="text-lg">👛</span>
          Wallet Information
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="font-semibold text-gray-300">Address:</span>
            <span className="font-mono text-gray-100 bg-gray-800 px-2 py-1 rounded">{formatAddress(address!)}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="font-semibold text-gray-300">Wallet Balance:</span>
            <span className="font-bold text-green-300">
              {balance !== null ? `${balance.toFixed(4)} APT` : 'Loading...'}
            </span>
          </div>
        </div>
      </div>
      {/* Platform Balance */}
      <div className="mb-4 p-3 glass rounded-xl">
        <h3 className="text-base font-bold text-green-200 mb-2 flex items-center gap-2">
          <span className="text-lg">💰</span>
          Platform Balance
        </h3>
        <div className="text-2xl font-bold text-green-300 mb-1 text-center">
          {platformBalance.toFixed(4)} APT
        </div>
        <p className="text-xs text-green-200 text-center">
          This is your balance available for betting on predictions
        </p>
      </div>
      {/* Deposit Section */}
      <div className="mb-4 p-3 glass rounded-xl border border-yellow-400/30 shadow-md bg-yellow-900/10">
        <h3 className="text-base font-bold text-yellow-200 mb-2 flex items-center gap-2">
          <span className="text-lg">📥</span>
          Deposit APT
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[120px] max-w-[220px]">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-300 text-lg">⬆️</span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.0000"
              step="0.0001"
              min="0"
              className="w-full pl-8 pr-2 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-gray-900 text-white"
              disabled={isProcessing}
              style={{ minWidth: '0', background: '#232946', color: '#fff', border: '1.5px solid #f7e06e' }}
            />
          </div>
          <button
            className="btn-deposit py-2 px-4 text-sm rounded-full font-bold shadow-lg border-2 border-yellow-400 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-400"
            onClick={handleDeposit}
            disabled={isProcessing}
            style={{ minWidth: '90px' }}
          >
            {isProcessing ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </div>
      {/* Withdraw Section */}
      <div className="mb-4 p-3 glass rounded-xl border border-red-400/30 shadow-md bg-red-900/10">
        <h3 className="text-base font-bold text-red-200 mb-2 flex items-center gap-2">
          <span className="text-lg">📤</span>
          Withdraw APT
        </h3>
        <div className="mb-2 p-2 bg-red-900/30 rounded border border-red-800">
          <p className="text-xs text-red-200 font-semibold flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <strong>Platform Fee:</strong> 2% fee applies to all withdrawals
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[120px] max-w-[220px]">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-red-300 text-lg">⬇️</span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.0000"
              step="0.0001"
              min="0"
              max={platformBalance}
              className="w-full pl-8 pr-2 py-2 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm bg-gray-900 text-white"
              disabled={isProcessing}
              style={{ minWidth: '0', background: '#232946', color: '#fff', border: '1.5px solid #ff6e6e' }}
            />
          </div>
          <button
            className="btn-withdraw py-2 px-4 text-sm rounded-full font-bold shadow-lg border-2 border-red-400 bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700 focus:ring-2 focus:ring-red-400"
            onClick={handleWithdraw}
            disabled={isProcessing}
            style={{ minWidth: '90px' }}
          >
            {isProcessing ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>
      {/* Transaction History */}
      <div className="p-3 glass rounded-xl">
        <h3 className="text-base font-bold text-gray-200 mb-2 flex items-center gap-2">
          <span className="text-lg">📋</span>
          Transaction History
        </h3>
        {transactionHistory.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-xs">
            <div className="text-3xl mb-2">💳</div>
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {transactionHistory.map((tx, index) => (
              <div key={index} className="glass p-2 rounded hover:bg-white/10 transition-all duration-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full font-semibold ${tx.type === 'deposit' ? 'bg-green-900/30 text-green-200' : 'bg-red-900/30 text-red-200'}`}>{tx.type.toUpperCase()}</span>
                  <span className="text-gray-400">{tx.timestamp}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{tx.type === 'deposit' ? '+' : '-'}{tx.amount.toFixed(4)} APT</span>
                  {tx.fee && (
                    <span className="block text-red-300">Fee: {tx.fee.toFixed(4)} APT</span>
                  )}
                  {tx.hash && (
                    <span className="block text-gray-400 font-mono">{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 