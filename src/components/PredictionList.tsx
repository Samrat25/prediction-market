import React, { useState, useEffect } from 'react';
import PredictionCard from './PredictionCard';
import { useWallet } from '../context/WalletContext';
import { apiService, Prediction } from '../services/api';

const PredictionList: React.FC = () => {
  const { isConnected } = useWallet();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPredictions();
      setPredictions(data);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      setError('Failed to load predictions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800 mb-4">{error}</p>
        <button
          onClick={fetchPredictions}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            Connect your Petra Wallet to participate in predictions
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            isConnected={isConnected}
            onStakeSuccess={fetchPredictions}
          />
        ))}
      </div>
    </div>
  );
};

export default PredictionList; 