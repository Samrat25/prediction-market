const express = require('express');
const cors = require('cors');
const { AptosClient, AptosAccount, TxnBuilderTypes, BCS } = require('aptos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Aptos client (using testnet for demo)
const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');

// Sample prediction data (in a real app, this would come from a database)
let predictions = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 by end of 2024?',
    description: 'Bitcoin price prediction for the end of 2024',
    endDate: '2024-12-31',
    totalStaked: 15000,
    yesStaked: 9000,
    noStaked: 6000,
    category: 'Cryptocurrency',
    contractAddress: '0x1234567890abcdef',
    moduleName: 'prediction_market',
    functionName: 'stake'
  },
  {
    id: '2',
    question: 'Will Ethereum 2.0 launch before June 2024?',
    description: 'Ethereum network upgrade completion prediction',
    endDate: '2024-06-30',
    totalStaked: 8500,
    yesStaked: 5200,
    noStaked: 3300,
    category: 'Technology',
    contractAddress: '0x1234567890abcdef',
    moduleName: 'prediction_market',
    functionName: 'stake'
  },
  {
    id: '3',
    question: 'Will the US approve a Bitcoin ETF in 2024?',
    description: 'SEC approval of Bitcoin ETF prediction',
    endDate: '2024-12-31',
    totalStaked: 22000,
    yesStaked: 15000,
    noStaked: 7000,
    category: 'Finance',
    contractAddress: '0x1234567890abcdef',
    moduleName: 'prediction_market',
    functionName: 'stake'
  },
  {
    id: '4',
    question: 'Will Aptos TVL exceed $1B by Q2 2024?',
    description: 'Aptos blockchain total value locked prediction',
    endDate: '2024-06-30',
    totalStaked: 12000,
    yesStaked: 8000,
    noStaked: 4000,
    category: 'DeFi',
    contractAddress: '0x1234567890abcdef',
    moduleName: 'prediction_market',
    functionName: 'stake'
  }
];

// API Routes

// Get all predictions
app.get('/api/predictions', (req, res) => {
  try {
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Get single prediction by ID
app.get('/api/predictions/:id', (req, res) => {
  try {
    const prediction = predictions.find(p => p.id === req.params.id);
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prediction' });
  }
});

// Create new prediction (admin only in real app)
app.post('/api/predictions', (req, res) => {
  try {
    const { question, description, endDate, category } = req.body;
    
    const newPrediction = {
      id: (predictions.length + 1).toString(),
      question,
      description,
      endDate,
      totalStaked: 0,
      yesStaked: 0,
      noStaked: 0,
      category,
      contractAddress: '0x1234567890abcdef',
      moduleName: 'prediction_market',
      functionName: 'stake'
    };
    
    predictions.push(newPrediction);
    res.status(201).json(newPrediction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prediction' });
  }
});

// Stake on a prediction (simulate transaction)
app.post('/api/predictions/:id/stake', async (req, res) => {
  try {
    const { amount, option, userAddress } = req.body;
    const predictionId = req.params.id;
    
    const prediction = predictions.find(p => p.id === predictionId);
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }
    
    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid stake amount' });
    }
    
    if (!['yes', 'no'].includes(option)) {
      return res.status(400).json({ error: 'Invalid option' });
    }
    
    // Update prediction stakes
    prediction.totalStaked += amount;
    if (option === 'yes') {
      prediction.yesStaked += amount;
    } else {
      prediction.noStaked += amount;
    }
    
    // In a real app, this would interact with the Aptos blockchain
    // For now, we'll simulate the transaction
    console.log(`Staking ${amount} APT on ${option} for prediction ${predictionId} by ${userAddress}`);
    
    res.json({
      success: true,
      message: `Successfully staked ${amount} APT on ${option}`,
      prediction
    });
    
  } catch (error) {
    console.error('Staking error:', error);
    res.status(500).json({ error: 'Failed to process stake' });
  }
});

// Get user's stakes (simulate)
app.get('/api/user/:address/stakes', (req, res) => {
  try {
    const userAddress = req.params.address;
    
    // In a real app, this would query the blockchain or database
    const userStakes = [
      {
        predictionId: '1',
        amount: 100,
        option: 'yes',
        timestamp: new Date().toISOString()
      }
    ];
    
    res.json(userStakes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user stakes' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Predictions API: http://localhost:${PORT}/api/predictions`);
}); 