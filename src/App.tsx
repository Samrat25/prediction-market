import React, { useState } from 'react';

const samplePredictions = [
  { id: 1, question: "Will Bitcoin reach $100,000 by end of 2024?", category: "Crypto" },
  { id: 2, question: "Will Ethereum 2.0 launch before June 2024?", category: "Tech" },
  { id: 3, question: "Will the US approve a Bitcoin ETF in 2024?", category: "Finance" },
];

function App() {
  const [stakes, setStakes] = useState<{ [id: number]: { option: string; amount: number } }>({});
  const [demoBalance, setDemoBalance] = useState(100); // Start with 100 Demo Coins
  const [demoBetAmounts, setDemoBetAmounts] = useState<{ [id: number]: number }>({});
  const [betHistory, setBetHistory] = useState<{ event: string; amount: number; option: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Add Demo Coins
  const handleAddDemoCoins = () => setDemoBalance((prev) => prev + 100);

  // Handle Demo Coin Bet
  const handleStake = (id: number, option: string) => {
    const amount = demoBetAmounts[id] || 1;
    setBetHistory((prev) => [
      { event: samplePredictions.find(p => p.id === id)?.question || '', amount, option, time: new Date().toLocaleString() },
      ...prev
    ]);
    if (amount > demoBalance) {
      alert("You cannot bet more than your Demo Coin balance.");
      return;
    }
    setStakes((prev) => ({ ...prev, [id]: { option, amount } }));
    setDemoBalance((prev) => prev - amount);
  };

  // Connect to Petra Wallet
  const handleConnectWallet = async () => {
    if (!(window as any).aptos) {
      alert("Petra Wallet extension not found! Please install it from https://petra.app/");
      return;
    }
    try {
      const response = await (window as any).aptos.connect();
      setWalletConnected(true);
      setWalletAddress(response.address);
    } catch (err) {
      alert("Wallet connection failed or was rejected.");
    }
  };

  const handleDisconnectWallet = async () => {
    if ((window as any).aptos) {
      try {
        await (window as any).aptos.disconnect();
      } catch {}
    }
    setWalletConnected(false);
    setWalletAddress(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Prediction Market</h1>
        <div className="flex items-center gap-4">
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700 bg-green-100 px-2 py-1 rounded font-mono">
                {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-4)}
              </span>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-sm"
              onClick={handleConnectWallet}
            >
              Connect Petra Wallet
            </button>
          )}
          <span className="text-xs text-gray-700 bg-yellow-100 px-2 py-1 rounded font-mono">
            Demo Coin: {demoBalance.toFixed(2)}
          </span>
          <button onClick={handleAddDemoCoins} className="px-2 py-1 bg-yellow-400 text-xs rounded ml-2">Add Demo Coins</button>
        </div>
      </header>
      <main className="max-w-2xl mx-auto py-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Active Predictions</h2>
        <div className="space-y-6">
          {samplePredictions.map((pred) => (
            <div key={pred.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">{pred.category}</span>
                {stakes[pred.id] && (
                  <span className="text-xs text-green-600 font-semibold">
                    You staked: {stakes[pred.id].amount} Demo Coin on {stakes[pred.id].option.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-lg font-medium mb-4">{pred.question}</div>
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">Bet Amount: {demoBetAmounts[pred.id] || 1} Demo Coin</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={demoBetAmounts[pred.id] || 1}
                  onChange={e => setDemoBetAmounts(prev => ({ ...prev, [pred.id]: Number(e.target.value) }))}
                  className="w-full accent-yellow-500"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className={`flex-1 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600 transition ${
                    stakes[pred.id]?.option === 'yes' ? 'ring-2 ring-green-400' : ''
                  }`}
                  onClick={() => handleStake(pred.id, 'yes')}
                  disabled={loading}
                >
                  YES
                </button>
                <button
                  className={`flex-1 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition ${
                    stakes[pred.id]?.option === 'no' ? 'ring-2 ring-red-400' : ''
                  }`}
                  onClick={() => handleStake(pred.id, 'no')}
                  disabled={loading}
                >
                  NO
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Bet History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Bet History</h3>
          {betHistory.length === 0 ? (
            <div className="text-xs text-gray-500">No bets placed yet.</div>
          ) : (
            <ul className="text-xs space-y-1">
              {betHistory.map((bet, i) => (
                <li key={i} className="bg-gray-50 rounded p-2 flex justify-between items-center">
                  <span>{bet.time}</span>
                  <span className="ml-2 font-semibold">{bet.event}</span>
                  <span className="ml-2">{bet.amount} Demo Coin</span>
                  <span className="ml-2">on <b>{bet.option.toUpperCase()}</b></span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;