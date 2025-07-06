# Yes/No Prediction Market Website on Aptos

A modern React-based prediction market website built on the Aptos blockchain, allowing users to stake on Yes/No predictions using Petra Wallet through their web browser.

## Features

- 🔗 **Petra Wallet Integration** - Connect and interact with Aptos blockchain via web browser
- 📊 **Prediction Cards** - Beautiful responsive UI for viewing and participating in predictions
- 💰 **Staking System** - Stake APT tokens on YES or NO outcomes
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile browsers
- 🎨 **Modern Web UI** - Built with React and Tailwind CSS
- 🔄 **Real-time Updates** - Live updates of staking amounts and percentages
- 🌐 **Web3 Ready** - Full blockchain integration for web applications

## Tech Stack

### Frontend (Website)
- React 18 with TypeScript
- Tailwind CSS for responsive styling
- Petra Wallet SDK for web browser integration
- Context API for state management
- Responsive web design

### Backend (Web Server)
- Node.js with Express
- Aptos SDK for blockchain integration
- RESTful API design
- CORS enabled for web browser communication

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Petra Wallet browser extension
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd prediction-market
```

2. **Install website dependencies**
```bash
npm install
```

3. **Install backend server dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Start the backend web server**
```bash
cd backend
npm run dev
```

5. **Start the frontend website**
```bash
# In a new terminal
npm start
```

The website will be available at `http://localhost:3000`

## Website Structure

```
prediction-market/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Website navigation and wallet connection
│   │   ├── PredictionList.tsx  # List of all predictions
│   │   ├── PredictionCard.tsx  # Individual prediction card
│   │   └── WalletInfo.tsx      # Web3 wallet information display
│   ├── context/
│   │   └── WalletContext.tsx   # Petra wallet state management
│   ├── services/
│   │   └── api.ts             # Backend web API communication
│   └── App.tsx                # Main website component
├── backend/
│   ├── server.js              # Express web server
│   ├── package.json           # Backend dependencies
│   └── README.md              # Backend documentation
└── README.md                  # This file
```

## Website Usage

### Connecting Wallet
1. Install the Petra Wallet browser extension
2. Open the website in your browser
3. Click "Connect Petra Wallet" in the header
4. Approve the connection in your wallet popup

### Participating in Predictions
1. Browse available predictions on the website
2. Select a prediction you want to stake on
3. Choose YES or NO
4. Enter your stake amount in APT
5. Click "Stake" to submit your prediction

### Sample Predictions
The website includes sample predictions for:
- Bitcoin price targets
- Ethereum 2.0 launch
- Bitcoin ETF approval
- Aptos TVL milestones

## Web API Endpoints

### Backend Web Server (Port 5000)
- `GET /api/predictions` - Get all predictions
- `GET /api/predictions/:id` - Get specific prediction
- `POST /api/predictions/:id/stake` - Stake on a prediction
- `GET /api/user/:address/stakes` - Get user's stakes
- `GET /api/health` - Health check

## Development

### Frontend Website Development
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Backend Web Server Development
```bash
cd backend
npm run dev        # Start with nodemon
npm start          # Start production server
```

### Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
```

## Web3 Integration

### Current Implementation
- Uses Aptos testnet for development
- Petra Wallet browser extension integration
- Responsive web design for all devices
- Web3 transaction simulation

### Production Considerations
- Deploy smart contracts to Aptos mainnet
- Implement real transaction signing
- Add proper error handling for failed transactions
- Store prediction data on-chain
- Implement proper web3 authentication

## Browser Compatibility

This website works with all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## Roadmap

- [ ] Smart contract deployment
- [ ] Real blockchain transactions
- [ ] User profile and history
- [ ] Prediction creation interface
- [ ] Advanced analytics
- [ ] Progressive Web App (PWA) features
- [ ] Social features 