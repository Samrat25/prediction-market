module prediction_market::prediction_market {
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use std::option::{Self, Option};

    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EPREDICTION_NOT_FOUND: u64 = 2;
    const EPREDICTION_CLOSED: u64 = 3;
    const EPREDICTION_NOT_CLOSED: u64 = 4;
    const EINVALID_AMOUNT: u64 = 5;
    const EINVALID_OPTION: u64 = 6;
    const EALREADY_STAKED: u64 = 7;
    const ENOT_ENOUGH_BALANCE: u64 = 8;
    const EPREDICTION_EXPIRED: u64 = 9;

    // Structs
    struct Prediction has key, store {
        id: u64,
        question: vector<u8>,
        description: vector<u8>,
        category: vector<u8>,
        end_time: u64,
        total_staked: u64,
        yes_staked: u64,
        no_staked: u64,
        is_closed: bool,
        outcome: Option<bool>, // true for YES, false for NO
        creator: address,
        created_at: u64,
    }

    struct Stake has key, store {
        prediction_id: u64,
        user: address,
        amount: u64,
        option: bool, // true for YES, false for NO
        staked_at: u64,
    }

    struct PredictionMarket has key {
        predictions: vector<Prediction>,
        stakes: vector<Stake>,
        next_prediction_id: u64,
        total_predictions: u64,
        total_stakes: u64,
    }

    // Events
    struct PredictionCreatedEvent has drop, store {
        prediction_id: u64,
        question: vector<u8>,
        creator: address,
        end_time: u64,
    }

    struct StakePlacedEvent has drop, store {
        prediction_id: u64,
        user: address,
        amount: u64,
        option: bool,
    }

    struct PredictionClosedEvent has drop, store {
        prediction_id: u64,
        outcome: bool,
        total_payout: u64,
    }

    struct PayoutClaimedEvent has drop, store {
        prediction_id: u64,
        user: address,
        amount: u64,
    }

    // Initialize the prediction market
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        
        move_to(account, PredictionMarket {
            predictions: vector::empty(),
            stakes: vector::empty(),
            next_prediction_id: 1,
            total_predictions: 0,
            total_stakes: 0,
        });
    }

    // Create a new prediction
    public entry fun create_prediction(
        account: &signer,
        question: vector<u8>,
        description: vector<u8>,
        category: vector<u8>,
        duration_days: u64,
    ) acquires PredictionMarket {
        let account_addr = signer::address_of(account);
        let current_time = timestamp::now_seconds();
        let end_time = current_time + (duration_days * 86400); // 86400 seconds = 1 day

        let prediction = Prediction {
            id: get_next_prediction_id(),
            question,
            description,
            category,
            end_time,
            total_staked: 0,
            yes_staked: 0,
            no_staked: 0,
            is_closed: false,
            outcome: option::none(),
            creator: account_addr,
            created_at: current_time,
        };

        let prediction_market = borrow_global_mut<PredictionMarket>(@prediction_market);
        vector::push_back(&mut prediction_market.predictions, prediction);
        prediction_market.total_predictions = prediction_market.total_predictions + 1;

        // Emit event
        let prediction_id = get_next_prediction_id() - 1;
        emit_prediction_created_event(prediction_id, question, account_addr, end_time);
    }

    // Stake on a prediction
    public entry fun stake_on_prediction(
        account: &signer,
        prediction_id: u64,
        option: bool, // true for YES, false for NO
        amount: u64,
    ) acquires PredictionMarket {
        let account_addr = signer::address_of(account);
        
        // Validate amount
        assert!(amount > 0, EINVALID_AMOUNT);

        let prediction_market = borrow_global_mut<PredictionMarket>(@prediction_market);
        
        // Find prediction
        let prediction_index = find_prediction_index(prediction_id);
        assert!(prediction_index < vector::length(&prediction_market.predictions), EPREDICTION_NOT_FOUND);
        
        let prediction = vector::borrow_mut(&mut prediction_market.predictions, prediction_index);
        
        // Check if prediction is still open
        assert!(!prediction.is_closed, EPREDICTION_CLOSED);
        assert!(timestamp::now_seconds() < prediction.end_time, EPREDICTION_EXPIRED);

        // Check if user already staked on this prediction
        assert!(!has_user_staked(prediction_id, account_addr), EALREADY_STAKED);

        // Update prediction stakes
        prediction.total_staked = prediction.total_staked + amount;
        if (option) {
            prediction.yes_staked = prediction.yes_staked + amount;
        } else {
            prediction.no_staked = prediction.no_staked + amount;
        };

        // Create stake record
        let stake = Stake {
            prediction_id,
            user: account_addr,
            amount,
            option,
            staked_at: timestamp::now_seconds(),
        };

        vector::push_back(&mut prediction_market.stakes, stake);
        prediction_market.total_stakes = prediction_market.total_stakes + 1;

        // Emit event
        emit_stake_placed_event(prediction_id, account_addr, amount, option);
    }

    // Close a prediction and set outcome
    public entry fun close_prediction(
        account: &signer,
        prediction_id: u64,
        outcome: bool,
    ) acquires PredictionMarket {
        let account_addr = signer::address_of(account);
        
        let prediction_market = borrow_global_mut<PredictionMarket>(@prediction_market);
        
        // Find prediction
        let prediction_index = find_prediction_index(prediction_id);
        assert!(prediction_index < vector::length(&prediction_market.predictions), EPREDICTION_NOT_FOUND);
        
        let prediction = vector::borrow_mut(&mut prediction_market.predictions, prediction_index);
        
        // Only creator can close prediction
        assert!(prediction.creator == account_addr, ENOT_AUTHORIZED);
        
        // Check if prediction is still open
        assert!(!prediction.is_closed, EPREDICTION_NOT_CLOSED);
        assert!(timestamp::now_seconds() >= prediction.end_time, EPREDICTION_NOT_CLOSED);

        // Set outcome and close prediction
        prediction.is_closed = true;
        prediction.outcome = option::some(outcome);

        // Calculate total payout
        let total_payout = prediction.total_staked;

        // Emit event
        emit_prediction_closed_event(prediction_id, outcome, total_payout);
    }

    // Claim payout for winning stakes
    public entry fun claim_payout(
        account: &signer,
        prediction_id: u64,
    ) acquires PredictionMarket {
        let account_addr = signer::address_of(account);
        
        let prediction_market = borrow_global_mut<PredictionMarket>(@prediction_market);
        
        // Find prediction
        let prediction_index = find_prediction_index(prediction_id);
        assert!(prediction_index < vector::length(&prediction_market.predictions), EPREDICTION_NOT_FOUND);
        
        let prediction = vector::borrow(&prediction_market.predictions, prediction_index);
        
        // Check if prediction is closed
        assert!(prediction.is_closed, EPREDICTION_NOT_CLOSED);
        
        let outcome = *&option::borrow(&prediction.outcome);
        
        // Find user's stake
        let stake_index = find_user_stake_index(prediction_id, account_addr);
        assert!(stake_index < vector::length(&prediction_market.stakes), EPREDICTION_NOT_FOUND);
        
        let stake = vector::borrow(&prediction_market.stakes, stake_index);
        
        // Check if user's stake matches the outcome
        assert!(stake.option == outcome, EPREDICTION_NOT_FOUND);
        
        // Calculate payout
        let payout_amount = calculate_payout(prediction, stake);
        
        // Emit event
        emit_payout_claimed_event(prediction_id, account_addr, payout_amount);
    }

    // Get prediction by ID
    public fun get_prediction(prediction_id: u64): Prediction acquires PredictionMarket {
        let prediction_market = borrow_global<PredictionMarket>(@prediction_market);
        let prediction_index = find_prediction_index(prediction_id);
        assert!(prediction_index < vector::length(&prediction_market.predictions), EPREDICTION_NOT_FOUND);
        *vector::borrow(&prediction_market.predictions, prediction_index)
    }

    // Get all predictions
    public fun get_all_predictions(): vector<Prediction> acquires PredictionMarket {
        let prediction_market = borrow_global<PredictionMarket>(@prediction_market);
        *&prediction_market.predictions
    }

    // Get user's stakes
    public fun get_user_stakes(user: address): vector<Stake> acquires PredictionMarket {
        let prediction_market = borrow_global<PredictionMarket>(@prediction_market);
        let user_stakes = vector::empty<Stake>();
        let i = 0;
        let len = vector::length(&prediction_market.stakes);
        
        while (i < len) {
            let stake = vector::borrow(&prediction_market.stakes, i);
            if (stake.user == user) {
                vector::push_back(&mut user_stakes, *stake);
            };
            i = i + 1;
        };
        
        user_stakes
    }

    // Helper functions
    fun get_next_prediction_id(): u64 acquires PredictionMarket {
        let prediction_market = borrow_global_mut<PredictionMarket>(@prediction_market);
        let id = prediction_market.next_prediction_id;
        prediction_market.next_prediction_id = prediction_market.next_prediction_id + 1;
        id
    }

    fun find_prediction_index(prediction_id: u64): u64 acquires PredictionMarket {
        let prediction_market = borrow_global<PredictionMarket>(@prediction_market);
        let i = 0;
        let len = vector::length(&prediction_market.predictions);
        
        while (i < len) {
            let prediction = vector::borrow(&prediction_market.predictions, i);
            if (prediction.id == prediction_id) {
                return i
            };
            i = i + 1;
        };
        
        len // Return length if not found
    }

    fun has_user_staked(prediction_id: u64, user: address): bool acquires PredictionMarket {
        let prediction_market = borrow_global<PredictionMarket>(@prediction_market);
        let i = 0;
        let len = vector::length(&prediction_market.stakes);
        
        while (i < len) {
            let stake = vector::borrow(&prediction_market.stakes, i);
            if (stake.prediction_id == prediction_id && stake.user == user) {
                return true
            };
            i = i + 1;
        };
        
        false
    }

    fun find_user_stake_index(prediction_id: u64, user: address): u64 acquires PredictionMarket {
        let prediction_market = borrow_global<PredictionMarket>(@prediction_market);
        let i = 0;
        let len = vector::length(&prediction_market.stakes);
        
        while (i < len) {
            let stake = vector::borrow(&prediction_market.stakes, i);
            if (stake.prediction_id == prediction_id && stake.user == user) {
                return i
            };
            i = i + 1;
        };
        
        len // Return length if not found
    }

    fun calculate_payout(prediction: &Prediction, stake: &Stake): u64 {
        let total_winning_stakes = if (stake.option) {
            prediction.yes_staked
        } else {
            prediction.no_staked
        };
        
        if (total_winning_stakes == 0) {
            return 0
        };
        
        // Calculate proportional payout
        let payout_ratio = (stake.amount * 10000) / total_winning_stakes;
        let total_payout = (prediction.total_staked * payout_ratio) / 10000;
        
        total_payout
    }

    // Event emission functions
    fun emit_prediction_created_event(
        prediction_id: u64,
        question: vector<u8>,
        creator: address,
        end_time: u64,
    ) {
        // In a real implementation, this would emit an event
        // For now, we'll just return
    }

    fun emit_stake_placed_event(
        prediction_id: u64,
        user: address,
        amount: u64,
        option: bool,
    ) {
        // In a real implementation, this would emit an event
        // For now, we'll just return
    }

    fun emit_prediction_closed_event(
        prediction_id: u64,
        outcome: bool,
        total_payout: u64,
    ) {
        // In a real implementation, this would emit an event
        // For now, we'll just return
    }

    fun emit_payout_claimed_event(
        prediction_id: u64,
        user: address,
        amount: u64,
    ) {
        // In a real implementation, this would emit an event
        // For now, we'll just return
    }
} 