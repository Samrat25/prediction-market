const { AptosClient, AptosAccount, TxnBuilderTypes, BCS } = require('aptos');

class ContractService {
    constructor() {
        // Initialize Aptos client (testnet for development)
        this.client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
        
        // Contract address (update after deployment)
        this.contractAddress = process.env.CONTRACT_ADDRESS || '0x1234567890abcdef';
        
        // Module name
        this.moduleName = 'prediction_market';
    }

    // Create a new prediction
    async createPrediction(creatorAccount, question, description, category, durationDays) {
        try {
            const payload = {
                function: `${this.contractAddress}::${this.moduleName}::create_prediction`,
                type_arguments: [],
                arguments: [
                    question,
                    description,
                    category,
                    durationDays
                ]
            };

            const transaction = await this.client.generateTransaction(
                creatorAccount.address(),
                payload
            );

            const signedTxn = await this.client.signTransaction(creatorAccount, transaction);
            const result = await this.client.submitTransaction(signedTxn);
            
            await this.client.waitForTransaction(result.hash);

            return {
                success: true,
                transactionHash: result.hash,
                predictionId: await this.getNextPredictionId() - 1
            };
        } catch (error) {
            console.error('Error creating prediction:', error);
            throw error;
        }
    }

    // Stake on a prediction
    async stakeOnPrediction(userAccount, predictionId, option, amount) {
        try {
            const payload = {
                function: `${this.contractAddress}::${this.moduleName}::stake_on_prediction`,
                type_arguments: [],
                arguments: [
                    predictionId,
                    option, // true for YES, false for NO
                    amount // in octas (1 APT = 100000000 octas)
                ]
            };

            const transaction = await this.client.generateTransaction(
                userAccount.address(),
                payload
            );

            const signedTxn = await this.client.signTransaction(userAccount, transaction);
            const result = await this.client.submitTransaction(signedTxn);
            
            await this.client.waitForTransaction(result.hash);

            return {
                success: true,
                transactionHash: result.hash
            };
        } catch (error) {
            console.error('Error staking on prediction:', error);
            throw error;
        }
    }

    // Close a prediction
    async closePrediction(creatorAccount, predictionId, outcome) {
        try {
            const payload = {
                function: `${this.contractAddress}::${this.moduleName}::close_prediction`,
                type_arguments: [],
                arguments: [
                    predictionId,
                    outcome // true for YES, false for NO
                ]
            };

            const transaction = await this.client.generateTransaction(
                creatorAccount.address(),
                payload
            );

            const signedTxn = await this.client.signTransaction(creatorAccount, transaction);
            const result = await this.client.submitTransaction(signedTxn);
            
            await this.client.waitForTransaction(result.hash);

            return {
                success: true,
                transactionHash: result.hash
            };
        } catch (error) {
            console.error('Error closing prediction:', error);
            throw error;
        }
    }

    // Claim payout
    async claimPayout(userAccount, predictionId) {
        try {
            const payload = {
                function: `${this.contractAddress}::${this.moduleName}::claim_payout`,
                type_arguments: [],
                arguments: [predictionId]
            };

            const transaction = await this.client.generateTransaction(
                userAccount.address(),
                payload
            );

            const signedTxn = await this.client.signTransaction(userAccount, transaction);
            const result = await this.client.submitTransaction(signedTxn);
            
            await this.client.waitForTransaction(result.hash);

            return {
                success: true,
                transactionHash: result.hash
            };
        } catch (error) {
            console.error('Error claiming payout:', error);
            throw error;
        }
    }

    // Get prediction by ID
    async getPrediction(predictionId) {
        try {
            const resource = await this.client.getAccountResource(
                this.contractAddress,
                `${this.contractAddress}::${this.moduleName}::PredictionMarket`
            );

            // Parse the resource data to find the specific prediction
            // This is a simplified version - in practice you'd need to parse the vector
            const predictions = resource.data.predictions || [];
            
            for (let prediction of predictions) {
                if (prediction.id === predictionId) {
                    return prediction;
                }
            }

            throw new Error('Prediction not found');
        } catch (error) {
            console.error('Error getting prediction:', error);
            throw error;
        }
    }

    // Get all predictions
    async getAllPredictions() {
        try {
            const resource = await this.client.getAccountResource(
                this.contractAddress,
                `${this.contractAddress}::${this.moduleName}::PredictionMarket`
            );

            return resource.data.predictions || [];
        } catch (error) {
            console.error('Error getting all predictions:', error);
            throw error;
        }
    }

    // Get user stakes
    async getUserStakes(userAddress) {
        try {
            const resource = await this.client.getAccountResource(
                this.contractAddress,
                `${this.contractAddress}::${this.moduleName}::PredictionMarket`
            );

            const allStakes = resource.data.stakes || [];
            const userStakes = allStakes.filter(stake => stake.user === userAddress);

            return userStakes;
        } catch (error) {
            console.error('Error getting user stakes:', error);
            throw error;
        }
    }

    // Get next prediction ID
    async getNextPredictionId() {
        try {
            const resource = await this.client.getAccountResource(
                this.contractAddress,
                `${this.contractAddress}::${this.moduleName}::PredictionMarket`
            );

            return resource.data.next_prediction_id || 1;
        } catch (error) {
            console.error('Error getting next prediction ID:', error);
            return 1;
        }
    }

    // Convert APT to octas
    aptToOctas(apt) {
        return apt * 100000000;
    }

    // Convert octas to APT
    octasToApt(octas) {
        return octas / 100000000;
    }

    // Create account from private key
    createAccountFromPrivateKey(privateKeyHex) {
        const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
        return new AptosAccount(privateKeyBytes);
    }

    // Get account balance
    async getAccountBalance(accountAddress) {
        try {
            const resources = await this.client.getAccountResources(accountAddress);
            const coinResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
            
            if (coinResource) {
                return this.octasToApt(parseInt(coinResource.data.coin.value));
            }
            
            return 0;
        } catch (error) {
            console.error('Error getting account balance:', error);
            return 0;
        }
    }

    // Monitor transaction status
    async getTransactionStatus(transactionHash) {
        try {
            const transaction = await this.client.getTransactionByHash(transactionHash);
            return {
                hash: transaction.hash,
                success: transaction.success,
                timestamp: transaction.timestamp,
                gasUsed: transaction.gas_used,
                gasUnitPrice: transaction.gas_unit_price
            };
        } catch (error) {
            console.error('Error getting transaction status:', error);
            throw error;
        }
    }
}

module.exports = ContractService; 