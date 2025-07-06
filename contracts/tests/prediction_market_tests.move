#[test_only]
module prediction_market::prediction_market_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use prediction_market::prediction_market;

    // Test accounts
    const CREATOR: address = @0x1;
    const USER1: address = @0x2;
    const USER2: address = @0x3;

    // Test constants
    const PREDICTION_ID: u64 = 1;
    const STAKE_AMOUNT: u64 = 1000000; // 1 APT in octas

    #[test]
    fun test_initialize() {
        let creator = account::create_account_for_test(CREATOR);
        
        // Initialize prediction market
        prediction_market::initialize(&creator);
        
        // Verify initialization
        let predictions = prediction_market::get_all_predictions();
        assert!(vector::length(&predictions) == 0, 0);
    }

    #[test]
    fun test_create_prediction() {
        let creator = account::create_account_for_test(CREATOR);
        
        // Initialize
        prediction_market::initialize(&creator);
        
        // Create prediction
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30 // 30 days
        );
        
        // Verify prediction was created
        let predictions = prediction_market::get_all_predictions();
        assert!(vector::length(&predictions) == 1, 1);
        
        let prediction = vector::borrow(&predictions, 0);
        assert!(prediction.id == PREDICTION_ID, 2);
        assert!(prediction.question == b"Will Bitcoin reach $100k?", 3);
        assert!(prediction.creator == CREATOR, 4);
        assert!(!prediction.is_closed, 5);
    }

    #[test]
    fun test_stake_on_prediction() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize and create prediction
        prediction_market::initialize(&creator);
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        // Stake on prediction
        prediction_market::stake_on_prediction(
            &user1,
            PREDICTION_ID,
            true, // YES
            STAKE_AMOUNT
        );
        
        // Verify stake was recorded
        let prediction = prediction_market::get_prediction(PREDICTION_ID);
        assert!(prediction.total_staked == STAKE_AMOUNT, 6);
        assert!(prediction.yes_staked == STAKE_AMOUNT, 7);
        assert!(prediction.no_staked == 0, 8);
    }

    #[test]
    fun test_multiple_stakes() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        let user2 = account::create_account_for_test(USER2);
        
        // Initialize and create prediction
        prediction_market::initialize(&creator);
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        // User1 stakes YES
        prediction_market::stake_on_prediction(
            &user1,
            PREDICTION_ID,
            true, // YES
            STAKE_AMOUNT
        );
        
        // User2 stakes NO
        prediction_market::stake_on_prediction(
            &user2,
            PREDICTION_ID,
            false, // NO
            STAKE_AMOUNT * 2
        );
        
        // Verify total stakes
        let prediction = prediction_market::get_prediction(PREDICTION_ID);
        assert!(prediction.total_staked == STAKE_AMOUNT * 3, 9);
        assert!(prediction.yes_staked == STAKE_AMOUNT, 10);
        assert!(prediction.no_staked == STAKE_AMOUNT * 2, 11);
    }

    #[test]
    #[expected_failure(abort_code = prediction_market::EALREADY_STAKED)]
    fun test_double_stake_failure() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize and create prediction
        prediction_market::initialize(&creator);
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        // First stake
        prediction_market::stake_on_prediction(
            &user1,
            PREDICTION_ID,
            true,
            STAKE_AMOUNT
        );
        
        // Second stake should fail
        prediction_market::stake_on_prediction(
            &user1,
            PREDICTION_ID,
            false,
            STAKE_AMOUNT
        );
    }

    #[test]
    #[expected_failure(abort_code = prediction_market::EINVALID_AMOUNT)]
    fun test_invalid_stake_amount() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize and create prediction
        prediction_market::initialize(&creator);
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        // Stake with zero amount should fail
        prediction_market::stake_on_prediction(
            &user1,
            PREDICTION_ID,
            true,
            0
        );
    }

    #[test]
    #[expected_failure(abort_code = prediction_market::EPREDICTION_NOT_FOUND)]
    fun test_stake_on_nonexistent_prediction() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize without creating prediction
        prediction_market::initialize(&creator);
        
        // Stake on non-existent prediction should fail
        prediction_market::stake_on_prediction(
            &user1,
            999, // Non-existent ID
            true,
            STAKE_AMOUNT
        );
    }

    #[test]
    fun test_close_prediction() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize and create prediction
        prediction_market::initialize(&creator);
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            1 // 1 day duration
        );
        
        // Stake on prediction
        prediction_market::stake_on_prediction(
            &user1,
            PREDICTION_ID,
            true,
            STAKE_AMOUNT
        );
        
        // Fast forward time (in real scenario, wait for actual time)
        // For testing, we'll simulate time passing
        
        // Close prediction
        prediction_market::close_prediction(
            &creator,
            PREDICTION_ID,
            true // Outcome: YES
        );
        
        // Verify prediction is closed
        let prediction = prediction_market::get_prediction(PREDICTION_ID);
        assert!(prediction.is_closed, 12);
        assert!(*&std::option::borrow(&prediction.outcome), 13); // Should be true (YES)
    }

    #[test]
    #[expected_failure(abort_code = prediction_market::ENOT_AUTHORIZED)]
    fun test_unauthorized_close() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize and create prediction
        prediction_market::initialize(&creator);
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        // User1 tries to close prediction (should fail)
        prediction_market::close_prediction(
            &user1,
            PREDICTION_ID,
            true
        );
    }

    #[test]
    fun test_get_user_stakes() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize and create prediction
        prediction_market::initialize(&creator);
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        // User1 stakes
        prediction_market::stake_on_prediction(
            &user1,
            PREDICTION_ID,
            true,
            STAKE_AMOUNT
        );
        
        // Get user stakes
        let user_stakes = prediction_market::get_user_stakes(USER1);
        assert!(vector::length(&user_stakes) == 1, 14);
        
        let stake = vector::borrow(&user_stakes, 0);
        assert!(stake.prediction_id == PREDICTION_ID, 15);
        assert!(stake.user == USER1, 16);
        assert!(stake.amount == STAKE_AMOUNT, 17);
        assert!(stake.option, 18); // Should be true (YES)
    }

    #[test]
    fun test_multiple_predictions() {
        let creator = account::create_account_for_test(CREATOR);
        let user1 = account::create_account_for_test(USER1);
        
        // Initialize
        prediction_market::initialize(&creator);
        
        // Create multiple predictions
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        prediction_market::create_prediction(
            &creator,
            b"Will Ethereum 2.0 launch?",
            b"Ethereum upgrade prediction",
            b"Technology",
            60
        );
        
        // Verify both predictions exist
        let predictions = prediction_market::get_all_predictions();
        assert!(vector::length(&predictions) == 2, 19);
        
        let prediction1 = vector::borrow(&predictions, 0);
        let prediction2 = vector::borrow(&predictions, 1);
        
        assert!(prediction1.id == 1, 20);
        assert!(prediction2.id == 2, 21);
        assert!(prediction1.question == b"Will Bitcoin reach $100k?", 22);
        assert!(prediction2.question == b"Will Ethereum 2.0 launch?", 23);
    }

    #[test]
    fun test_prediction_categories() {
        let creator = account::create_account_for_test(CREATOR);
        
        // Initialize
        prediction_market::initialize(&creator);
        
        // Create predictions with different categories
        prediction_market::create_prediction(
            &creator,
            b"Will Bitcoin reach $100k?",
            b"Bitcoin price prediction",
            b"Cryptocurrency",
            30
        );
        
        prediction_market::create_prediction(
            &creator,
            b"Will Tesla stock rise?",
            b"Tesla stock prediction",
            b"Finance",
            30
        );
        
        prediction_market::create_prediction(
            &creator,
            b"Will it rain tomorrow?",
            b"Weather prediction",
            b"Weather",
            1
        );
        
        // Verify categories
        let predictions = prediction_market::get_all_predictions();
        assert!(vector::length(&predictions) == 3, 24);
        
        let prediction1 = vector::borrow(&predictions, 0);
        let prediction2 = vector::borrow(&predictions, 1);
        let prediction3 = vector::borrow(&predictions, 2);
        
        assert!(prediction1.category == b"Cryptocurrency", 25);
        assert!(prediction2.category == b"Finance", 26);
        assert!(prediction3.category == b"Weather", 27);
    }
} 