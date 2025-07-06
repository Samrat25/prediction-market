# Prediction Market Backend

Express.js backend server for the Yes/No prediction market on Aptos blockchain.

## Features

- RESTful API for prediction management
- Aptos blockchain integration
- CORS enabled for frontend communication
- Sample prediction data
- Staking simulation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Predictions
- `GET /api/predictions` - Get all predictions
- `GET /api/predictions/:id` - Get specific prediction
- `POST /api/predictions` - Create new prediction
- `POST /api/predictions/:id/stake` - Stake on a prediction

### User
- `GET /api/user/:address/stakes` - Get user's stakes

### Health
- `GET /api/health` - Health check

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=5000
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
```

## Sample Data

The server includes sample prediction data for:
- Bitcoin price predictions
- Ethereum 2.0 launch
- Bitcoin ETF approval
- Aptos TVL predictions

## Aptos Integration

The backend is set up to work with Aptos testnet. In production, you would:
1. Deploy smart contracts to Aptos mainnet
2. Use real transaction signing
3. Store prediction data on-chain
4. Implement proper authentication

## Development

For development, the server simulates blockchain transactions. To integrate with real Aptos:

1. Install the Aptos SDK: `npm install aptos`
2. Configure your Aptos client for mainnet/testnet
3. Implement proper transaction signing
4. Add error handling for failed transactions 