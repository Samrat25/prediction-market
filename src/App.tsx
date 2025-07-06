import React, { useState } from 'react';
import Profile from './components/Profile.tsx';
import { useWallet } from './context/WalletContext.tsx';
import './App.css';

// Add this before the App component
declare global {
  interface Window {
    aptos?: any;
  }
}

const samplePredictions = [
  { id: 1, question: "Will Bitcoin reach $100,000 by end of 2024?", category: "Crypto" },
  { id: 2, question: "Will Ethereum 2.0 launch before June 2024?", category: "Tech" },
  { id: 3, question: "Will the US approve a Bitcoin ETF in 2024?", category: "Finance" },
  { id: 4, question: "Will AI-generated art win a major international award in 2024?", category: "AI" },
  { id: 5, question: "Will SpaceX launch a crewed Mars mission by 2026?", category: "Space" },
  { id: 6, question: "Will Apple release a foldable iPhone by 2025?", category: "Tech" },
  { id: 7, question: "Will global electric vehicle sales surpass 20 million in 2024?", category: "Automotive" },
  { id: 8, question: "Will a new all-time high for S&P 500 be reached in 2024?", category: "Finance" }
];

function App() {
  const { isConnected, address, connect, disconnect, balance } = useWallet();
  const [stakes, setStakes] = useState<{ [id: number]: { option: string; amount: number } }>({});
  const [demoBalance, setDemoBalance] = useState(100); // Start with 100 Demo Coins
  const [demoBetAmounts, setDemoBetAmounts] = useState<{ [id: number]: number }>({});
  const [betHistory, setBetHistory] = useState<{ event: string; amount: number; option: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [platformBalance, setPlatformBalance] = useState(0); // Platform balance for betting
  const [activeTab, setActiveTab] = useState<'predictions' | 'profile'>('predictions');
  const [transactionStatus, setTransactionStatus] = useState<{ [id: number]: { status: 'idle' | 'pending' | 'confirmed'; hash?: string } }>({});

  // Add Demo Coins
  const handleAddDemoCoins = () => setDemoBalance((prev) => prev + 100);

  // Handle Demo Coin Bet
  const handleStake = async (id: number, option: string) => {
    const amount = demoBetAmounts[id] || 1;
    if (!isConnected || !address) {
      alert('Please connect your Petra wallet to vote.');
      return;
    }
    if (!window.aptos) {
      alert('Petra wallet not found!');
      return;
    }
    if (balance !== null && balance < 0.0001) {
      alert('Insufficient APT balance to vote.');
      return;
    }
    setTransactionStatus(prev => ({ ...prev, [id]: { status: 'pending' } }));
    setLoading(true);
    try {
      // Always prompt connection (triggers popup if not connected)
      await window.aptos.connect();
      // Send 0.0001 APT to self as a demo transaction
      const payload = {
        type: 'entry_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [address, '10000'] // 0.0001 APT = 10000 octas
      };
      const tx = await window.aptos.signAndSubmitTransaction(payload);
      setTransactionStatus(prev => ({ ...prev, [id]: { status: 'pending', hash: tx.hash } }));
      // Wait for confirmation (simulate delay)
      setTimeout(() => {
        setStakes((prev) => ({ ...prev, [id]: { option, amount } }));
        setDemoBalance((prev) => prev - amount);
        setBetHistory((prev) => [
          { event: samplePredictions.find(p => p.id === id)?.question || '', amount, option, time: new Date().toLocaleString() },
          ...prev
        ]);
        setTransactionStatus(prev => ({ ...prev, [id]: { status: 'confirmed', hash: tx.hash } }));
        setLoading(false);
      }, 2000);
    } catch (err) {
      setTransactionStatus(prev => ({ ...prev, [id]: { status: 'idle' } }));
      setLoading(false);
      alert('Transaction failed or was rejected.');
    }
  };

  // Connect to Petra Wallet
  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (err) {
      alert("Wallet connection failed or was rejected.");
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden">
      <header className="glass shadow-lg p-6 flex flex-col items-center w-full max-w-md mx-auto">
        <div className="flex justify-between items-center w-full mb-2">
          <h1 className="market-title gradient-text mb-3">Prediction Market</h1>
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                <span className="text-xs font-mono bg-green-900/30 text-green-200 px-3 py-1 rounded-full shadow-sm">
                  {address?.slice(0, 8)}...{address?.slice(-4)}
                </span>
                <button
                  className="btn-danger text-xs py-1 px-3 rounded-full"
                  onClick={handleDisconnectWallet}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="btn-primary text-xs py-1 px-3 rounded-full"
                onClick={handleConnectWallet}
              >
                Connect Petra Wallet
              </button>
            )}
          </div>
        </div>
        <div className="balance-card flex flex-col items-center mb-6">
          <span className="balance-label">Current Balance</span>
          <span className="balance-amount">
            <span role="img" aria-label="wallet" className="wallet-icon" style={{marginRight:'8px'}}>👛</span>
            {platformBalance.toFixed(4)} <span className="apt-label">APT</span>
          </span>
        </div>
        <div className="tab-toggle flex gap-3 mb-2">
          <button
            onClick={() => setActiveTab('predictions')}
            className={`btn-tab ${activeTab === 'predictions' ? 'active' : ''}`}
          >
            Predictions
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`btn-tab ${activeTab === 'profile' ? 'active' : ''}`}
          >
            Profile
          </button>
        </div>
      </header>
      <main className="w-full max-w-md mx-auto flex flex-col items-center py-8 px-2">
        {activeTab === 'predictions' ? (
          <div className="predictions-section w-full space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-center gradient-text">Active Predictions</h2>
            {samplePredictions.map((pred, index) => (
              <div key={pred.id} className="prediction-card enhanced-card p-3 md:p-4 max-w-sm mx-auto w-full" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="category-tag text-xs px-3 py-1">{pred.category}</span>
                  {stakes[pred.id] && (
                    <span className="text-xs text-green-400 font-semibold bg-green-900/20 px-2 py-1 rounded-full">
                      You staked: {stakes[pred.id].amount} Demo Coin on {stakes[pred.id].option.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold mb-1" style={{color:'#6a82fb', minHeight:'2em', letterSpacing:'0.01em'}}>{pred.question}</div>
                <div className="mb-1 flex flex-col gap-1">
                  <label className="block text-xs text-gray-300 mb-1 font-medium">
                    Bet Amount: {demoBetAmounts[pred.id] || 1} Demo Coin
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={demoBetAmounts[pred.id] || 1}
                      onChange={e => setDemoBetAmounts(prev => ({ ...prev, [pred.id]: Number(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      disabled={loading}
                      style={{maxWidth:'120px'}}
                    />
                    <span className="text-xs text-gray-400">{demoBetAmounts[pred.id] || 1}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-1 justify-center">
                  <button
                    className={`btn-yes px-0 py-1 text-xs font-bold rounded-full max-w-[35px] w-full text-center ${stakes[pred.id]?.option === 'yes' ? 'ring-2 ring-green-400' : ''}`}
                    onClick={() => handleStake(pred.id, 'yes')}
                    disabled={loading || transactionStatus[pred.id]?.status === 'pending'}
                    style={{marginRight: '8px', minWidth: '30px'}}
                  >
                    {loading || transactionStatus[pred.id]?.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="loading-spinner"></div>
                        Processing...
                      </div>
                    ) : (
                      'YES'
                    )}
                  </button>
                  <button
                    className={`btn-no px-0 py-1 text-xs font-bold rounded-full max-w-[35px] w-full text-center ${stakes[pred.id]?.option === 'no' ? 'ring-2 ring-red-400' : ''}`}
                    onClick={() => handleStake(pred.id, 'no')}
                    disabled={loading || transactionStatus[pred.id]?.status === 'pending'}
                    style={{minWidth: '30px'}}
                  >
                    {loading || transactionStatus[pred.id]?.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="loading-spinner"></div>
                        Processing...
                      </div>
                    ) : (
                      'NO'
                    )}
                  </button>
                </div>
                {/* Transaction status */}
                {transactionStatus[pred.id]?.status === 'pending' && (
                  <div className="mt-2 p-2 bg-blue-900/30 rounded-lg border border-blue-800 transaction-pending text-xs text-blue-200 flex items-center gap-2">
                    <div className="loading-spinner"></div>
                    <span>Transaction pending...</span>
                  </div>
                )}
                {transactionStatus[pred.id]?.status === 'confirmed' && (
                  <div className="mt-2 p-2 bg-green-900/30 rounded-lg border border-green-800 transaction-confirmed text-xs text-green-200 flex items-center gap-2">
                    <span>✅ Transaction confirmed!</span>
                    <span className="font-mono">Hash: {transactionStatus[pred.id]?.hash}</span>
                  </div>
                )}
              </div>
            ))}
            {/* Bet History */}
            <div className="mt-4 enhanced-card p-3 max-w-sm mx-auto w-full">
              <h3 className="text-base font-bold mb-2 gradient-text">Bet History</h3>
              {betHistory.length === 0 ? (
                <div className="text-center py-2 text-gray-400 text-xs">
                  <div className="text-2xl mb-1">📊</div>
                  <p>No bets placed yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {betHistory.map((bet, i) => (
                    <div key={i} className="glass p-2 rounded flex justify-between items-center hover:bg-white/10 transition-all duration-300 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{bet.time}</span>
                        <span className="font-semibold text-gray-100">{bet.event}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-semibold text-yellow-200">
                          {bet.amount} APT
                        </span>
                        <span className="bg-blue-900/30 px-2 py-1 rounded-full text-xs font-semibold text-blue-200">
                          {bet.option.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="profile-section w-full">
            <Profile 
              platformBalance={platformBalance}
              setPlatformBalance={setPlatformBalance}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;