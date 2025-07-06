import React from 'react';
import { useWallet } from '../context/WalletContext';

const WalletInfo: React.FC = () => {
  const { isConnected, address, walletInfo, balance, fetchBalance } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance: number | null) => {
    if (balance === null) return 'Loading...';
    return `${balance.toFixed(4)} APT`;
  };

  const getNetworkColor = (network: string) => {
    switch (network?.toLowerCase()) {
      case 'mainnet':
        return 'network-mainnet';
      case 'testnet':
        return 'network-testnet';
      case 'devnet':
        return 'network-devnet';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Petra Wallet</h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-lg font-medium">Wallet Not Connected</p>
            <p className="text-sm">Connect your Petra wallet to view your APT balance</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Petra Wallet</h3>
        <button 
          onClick={fetchBalance}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          title="Refresh balance"
        >
          ↻ Refresh
        </button>
      </div>

      {/* APT Balance Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">APT Balance</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatBalance(balance)}
            </p>
          </div>
          <div className="text-blue-500">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
        {balance === null && (
          <p className="text-xs text-blue-600 mt-2">Click refresh to load balance</p>
        )}
      </div>

      {/* Wallet Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Wallet Address:</span>
          <span className="text-sm font-mono text-gray-800 break-all">
            {formatAddress(address!)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Blockchain Network:</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getNetworkColor(walletInfo?.network || '')}`}>
            {walletInfo?.network || 'Unknown'}
          </span>
        </div>

        {walletInfo?.publicKey && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Public Key:</span>
            <span className="text-sm font-mono text-gray-800 break-all">
              {walletInfo.publicKey.slice(0, 8)}...{walletInfo.publicKey.slice(-8)}
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Your APT balance is automatically fetched when you connect your wallet. 
          Click "Refresh" to update the balance manually.
        </p>
      </div>
    </div>
  );
};

export default WalletInfo; 