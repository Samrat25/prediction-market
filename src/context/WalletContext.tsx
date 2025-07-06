import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
  balance: number | null;
  fetchBalance: () => Promise<void>;
  walletInfo: {
    address: string | null;
    publicKey: string | null;
    network: string | null;
  } | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [walletInfo, setWalletInfo] = useState<{
    address: string | null;
    publicKey: string | null;
    network: string | null;
  } | null>(null);

  // Check if Petra wallet is installed
  const isPetraInstalled = () => {
    return typeof window !== 'undefined' && 'petra' in window;
  };

  // Get Petra wallet instance
  const getPetraWallet = () => {
    if (typeof window !== 'undefined' && 'petra' in window) {
      return (window as any).petra;
    }
    return null;
  };

  // Fetch APT balance from Petra wallet
  const fetchBalance = async () => {
    if (!isConnected || !address) {
      setBalance(null);
      return;
    }

    try {
      const petra = getPetraWallet();
      if (!petra) {
        console.error('Petra wallet not available');
        return;
      }

      console.log('Fetching balance for address:', address);
      console.log('Available petra methods:', Object.keys(petra));

      // Try different methods to get balance
      let balanceInOctas = 0;

      // Method 1: Try getAccountResources if available
      if (petra.getAccountResources) {
        try {
          console.log('Trying getAccountResources method...');
          const resources = await petra.getAccountResources(address);
          console.log('Account resources:', resources);
          
          // Find the AptosCoin resource (0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>)
          const coinStore = resources.find((resource: any) => 
            resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
          );

          if (coinStore && coinStore.data && coinStore.data.coin) {
            balanceInOctas = parseInt(coinStore.data.coin.value);
            console.log('Found balance via getAccountResources:', balanceInOctas);
          }
        } catch (error) {
          console.log('getAccountResources failed:', error);
        }
      }

      // Method 2: Try getBalance if available
      if (balanceInOctas === 0 && petra.getBalance) {
        try {
          console.log('Trying getBalance method...');
          const balance = await petra.getBalance();
          balanceInOctas = parseInt(balance);
          console.log('Found balance via getBalance:', balanceInOctas);
        } catch (error) {
          console.log('getBalance failed:', error);
        }
      }

      // Method 3: Try account().balance if available
      if (balanceInOctas === 0 && petra.account) {
        try {
          console.log('Trying account().balance method...');
          const account = await petra.account();
          if (account.balance) {
            balanceInOctas = parseInt(account.balance);
            console.log('Found balance via account().balance:', balanceInOctas);
          }
        } catch (error) {
          console.log('account().balance failed:', error);
        }
      }

      // Method 4: Try using AptosClient directly
      if (balanceInOctas === 0) {
        try {
          console.log('Trying AptosClient method...');
          const { AptosClient } = require('aptos');
          const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
          const resources = await client.getAccountResources(address);
          
          const coinStore = resources.find((resource: any) => 
            resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
          );

          if (coinStore && coinStore.data && coinStore.data.coin) {
            balanceInOctas = parseInt(coinStore.data.coin.value);
            console.log('Found balance via AptosClient:', balanceInOctas);
          }
        } catch (error) {
          console.log('AptosClient method failed:', error);
        }
      }

      if (balanceInOctas > 0) {
        // Convert from octas (smallest unit) to APT
        const balanceInAPT = balanceInOctas / 100000000; // 1 APT = 100,000,000 octas
        setBalance(balanceInAPT);
        console.log('Final APT Balance:', balanceInAPT);
      } else {
        setBalance(0);
        console.log('No APT balance found - setting to 0');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    }
  };

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isPetraInstalled()) {
        setError('Petra Wallet is not installed. Please install it from https://petra.app/');
        return;
      }

      const petra = getPetraWallet();
      if (!petra) {
        setError('Failed to initialize Petra Wallet');
        return;
      }

      // Check if already connected
      const isConnected = await petra.isConnected();
      if (isConnected) {
        const account = await petra.account();
        const network = await petra.network();
        
        setAddress(account.address);
        setIsConnected(true);
        setWalletInfo({
          address: account.address,
          publicKey: account.publicKey,
          network: network.name
        });
        
        // Fetch balance after connection
        await fetchBalance();
        
        console.log('Already connected to Petra Wallet:', account.address);
        console.log('Network:', network.name);
        return;
      }

      // Request connection
      console.log('Requesting connection to Petra Wallet...');
      const response = await petra.connect();
      
      if (response.address) {
        const network = await petra.network();
        
        setAddress(response.address);
        setIsConnected(true);
        setWalletInfo({
          address: response.address,
          publicKey: response.publicKey,
          network: network.name
        });
        
        // Fetch balance after connection
        await fetchBalance();
        
        console.log('Successfully connected to Petra Wallet:', response.address);
        console.log('Network:', network.name);
        console.log('Public Key:', response.publicKey);
      } else {
        setError('Failed to get wallet address from Petra Wallet');
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet. Please make sure Petra Wallet is unlocked.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      const petra = getPetraWallet();
      if (petra) {
        await petra.disconnect();
        console.log('Disconnected from Petra Wallet');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    } finally {
      setIsConnected(false);
      setAddress(null);
      setBalance(null);
      setError(null);
      setWalletInfo(null);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected on page load
    const checkConnection = async () => {
      if (isPetraInstalled()) {
        const petra = getPetraWallet();
        if (petra) {
          try {
            const connected = await petra.isConnected();
            if (connected) {
              const account = await petra.account();
              const network = await petra.network();
              
              setAddress(account.address);
              setIsConnected(true);
              setWalletInfo({
                address: account.address,
                publicKey: account.publicKey,
                network: network.name
              });
              
              // Fetch balance after connection check
              await fetchBalance();
              
              console.log('Petra Wallet already connected:', account.address);
              console.log('Network:', network.name);
            }
          } catch (error) {
            console.error('Error checking wallet connection:', error);
          }
        }
      }
    };

    checkConnection();
  }, []);

  const value = {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading,
    error,
    balance,
    fetchBalance,
    walletInfo
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 