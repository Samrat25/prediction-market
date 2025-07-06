import React, { useState } from 'react';
import { Prediction } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { apiService } from '../services/api';

interface PredictionCardProps {
  prediction: Prediction;
  isConnected: boolean;
  onStakeSuccess?: () => void;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isConnected, onStakeSuccess }) => {
  const { address } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [isStaking, setIsStaking] = useState(false);

  const yesPercentage = prediction.totalStaked > 0 ? (prediction.yesStaked / prediction.totalStaked) * 100 : 0;
  const noPercentage = prediction.totalStaked > 0 ? (prediction.noStaked / prediction.totalStaked) * 100 : 0;

  const handleStake = async () => {
    if (!isConnected || !selectedOption || !stakeAmount || !address) {
      alert('Please connect wallet, select an option, and enter stake amount');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid stake amount');
      return;
    }

    setIsStaking(true);
    try {
      // First, try to send transaction via Petra wallet
      if (typeof window !== 'undefined' && 'petra' in window) {
        const petra = (window as any).petra;
        
        // Simulate transaction signing (in real app, this would be actual transaction)
        console.log(`Preparing to stake ${amount} APT on ${selectedOption} for prediction: ${prediction.question}`);
        
        // In a real implementation, you would:
        // 1. Create the transaction payload
        // 2. Sign it with Petra wallet
        // 3. Submit to Aptos network
        
        // For now, we'll simulate the transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Send stake to backend API
      const response = await apiService.stakeOnPrediction(prediction.id, {
        amount,
        option: selectedOption,
        userAddress: address
      });

      if (response.success) {
        alert(`Successfully staked ${amount} APT on ${selectedOption.toUpperCase()}`);
        setStakeAmount('');
        setSelectedOption(null);
        
        // Refresh predictions list
        if (onStakeSuccess) {
          onStakeSuccess();
        }
      }
    } catch (error) {
      console.error('Staking failed:', error);
      alert('Staking failed. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow poll-card-compact">
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
          {prediction.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {prediction.question}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {prediction.description}
        </p>
        <p className="text-xs text-gray-500">
          Ends: {new Date(prediction.endDate).toLocaleDateString()}
        </p>
      </div>

      {/* Staking Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>YES: {prediction.yesStaked} APT ({yesPercentage.toFixed(1)}%)</span>
          <span>NO: {prediction.noStaked} APT ({noPercentage.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${yesPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Total Staked: {prediction.totalStaked} APT
        </div>
      </div>

      {/* Staking Interface */}
      {isConnected ? (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedOption('yes')}
              className={`flex-1 py-1 px-2 rounded-full border text-xs font-bold transition-colors mr-1 ${
                selectedOption === 'yes'
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
              }`}
              style={{ minWidth: 0 }}
            >
              YES
            </button>
            <button
              onClick={() => setSelectedOption('no')}
              className={`flex-1 py-1 px-2 rounded-full border text-xs font-bold transition-colors ml-1 ${
                selectedOption === 'no'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
              }`}
              style={{ minWidth: 0 }}
            >
              NO
            </button>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Stake (APT)"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.1"
              step="0.1"
              style={{ minWidth: 0 }}
            />
            <button
              onClick={handleStake}
              disabled={!selectedOption || !stakeAmount || isStaking}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStaking ? 'Staking...' : 'Stake'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Connect wallet to participate
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionCard; 