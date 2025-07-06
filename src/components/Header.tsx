import React from 'react';
import { useWallet } from '../context/WalletContext';

const Header: React.FC = () => {
  const { isConnected, address, connect, disconnect, isLoading, error, walletInfo, balance, fetchBalance } = useWallet();

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
        return 'text-green-600 bg-green-100';
      case 'testnet':
        return 'text-yellow-600 bg-yellow-100';
      case 'devnet':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Prediction Market</h1>
              <p className="text-sm text-gray-500">Web3 Platform on Aptos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-600">
                    Wallet: <span className="font-mono font-medium">{formatAddress(address!)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Balance: <span className="font-mono font-medium">{formatBalance(balance)}</span>
                    <button 
                      onClick={fetchBalance}
                      className="ml-2 text-xs text-blue-500 hover:text-blue-700"
                      title="Refresh balance"
                    >
                      ↻
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {balance === null ? 'Click ↻ to load balance' : 'Balance loaded'}
                  </div>
                  {walletInfo?.network && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getNetworkColor(walletInfo.network)}`}>
                      {walletInfo.network}
                    </span>
                  )}
                </div>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={connect}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Connecting...' : 'Connect Petra Wallet'}
                </button>
                {error && (
                  <div className="text-xs text-red-600 max-w-xs text-right">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 