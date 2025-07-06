# Prediction Market Smart Contract

This directory contains the Move smart contract for the Yes/No prediction market on Aptos blockchain.

## Contract Overview

The `prediction_market` module provides the following functionality:

- **Create Predictions**: Users can create new Yes/No prediction questions
- **Stake on Predictions**: Users can stake APT tokens on YES or NO outcomes
- **Close Predictions**: Prediction creators can close predictions and set outcomes
- **Claim Payouts**: Winners can claim their proportional payouts

## Contract Structure

### Main Structs

- `Prediction`: Stores prediction data including question, stakes, and outcome
- `Stake`: Records individual user stakes on predictions
- `PredictionMarket`: Global state management for all predictions and stakes

### Key Functions

- `initialize()`: Initialize the prediction market
- `create_prediction()`: Create a new prediction
- `stake_on_prediction()`: Stake APT on YES or NO
- `close_prediction()`: Close prediction and set outcome
- `claim_payout()`: Claim winnings for correct predictions

## Deployment

### Prerequisites

1. Install Aptos CLI: https://aptos.dev/tools/aptos-cli/
2. Set up Aptos account and get testnet APT
3. Configure Aptos CLI for testnet

### Deploy to Testnet

```bash
# Navigate to contracts directory
cd contracts

# Initialize Aptos project
aptos init --profile testnet

# Compile the contract
aptos move compile --profile testnet

# Deploy the contract
aptos move publish --profile testnet
```

### Deploy to Mainnet

```bash
# Switch to mainnet profile
aptos init --profile mainnet

# Compile and deploy
aptos move compile --profile mainnet
aptos move publish --profile mainnet
```

## Contract Address

After deployment, update the contract address in:
- `Move.toml` (replace `_` with actual address)
- Frontend configuration
- Backend API calls

## Usage Examples

### Create a Prediction

```move
prediction_market::create_prediction(
    &account,
    b"Will Bitcoin reach $100k by end of 2024?",
    b"Bitcoin price prediction",
    b"Cryptocurrency",
    30 // 30 days duration
);
```

### Stake on Prediction

```move
prediction_market::stake_on_prediction(
    &account,
    1, // prediction ID
    true, // YES
    1000000 // 1 APT (in octas)
);
```

### Close Prediction

```move
prediction_market::close_prediction(
    &account,
    1, // prediction ID
    true // outcome: YES
);
```

### Claim Payout

```move
prediction_market::claim_payout(
    &account,
    1 // prediction ID
);
```

## Integration with Frontend

### Backend API Updates

Update the backend to interact with the deployed contract:

```javascript
// Example transaction payload
const payload = {
    function: `${contractAddress}::prediction_market::stake_on_prediction`,
    type_arguments: [],
    arguments: [predictionId, option, amount]
};
```

### Frontend Integration

The frontend can now:
1. Read prediction data from blockchain
2. Submit staking transactions
3. Monitor transaction status
4. Display real-time updates

## Security Considerations

- **Access Control**: Only prediction creators can close predictions
- **Time Validation**: Predictions can only be closed after end time
- **Stake Validation**: Users can only stake once per prediction
- **Payout Calculation**: Proportional payouts based on stake amounts

## Testing

### Unit Tests

```bash
# Run Move unit tests
aptos move test --profile testnet
```

### Integration Tests

Create test scripts to verify:
- Prediction creation
- Staking functionality
- Payout calculations
- Error handling

## Gas Optimization

- Use efficient data structures
- Minimize storage operations
- Batch operations where possible
- Optimize loop iterations

## Upgrade Strategy

The contract uses `upgrade_policy = "compatible"` allowing for:
- Bug fixes
- Gas optimizations
- New features (with backward compatibility)

## Monitoring

Monitor contract events for:
- Prediction creation
- Staking activities
- Prediction closures
- Payout claims

## Support

For contract-related issues:
1. Check Move documentation
2. Review Aptos developer resources
3. Test thoroughly on testnet first
4. Use Aptos Explorer for transaction monitoring 