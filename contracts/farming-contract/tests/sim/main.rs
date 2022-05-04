use near_sdk::{serde_json::json, json_types::{U64, U128}};
use near_sdk_sim::{init_simulator, UserAccount, DEFAULT_GAS, STORAGE_AMOUNT, to_yocto};
use farming::{FarmInfo, FarmerInfo};

near_sdk_sim::lazy_static_include::lazy_static_include_bytes!{
    FT_CONTRACT_WASM_FILE => "tests/source/fungible_token.wasm",
    NFT_CONTRACT_WASM_FILE => "tests/source/non_fungible_token.wasm",
    FARMING_CONTRACT_WASM_FILE => "tests/source/farming.wasm"
}

const FT_CONTRACT_ID: &str = "ft_contract";
const NFT_CONTRACT_ID: &str = "nft_contract";

const FT_TOTAL_SUPPLY: &str = "100000000000000000000000000000";
const FARMING_CONTRACT_ID: &str = "staking_contract";
const RPS: u128 = 5;

const NFT_ID_1: &str = "token-1";
const NFT_ID_2: &str = "token-2";
const NFT_ID_3: &str = "token-3";

pub fn init() -> (UserAccount, UserAccount, UserAccount, UserAccount, UserAccount, UserAccount) {
    let root = init_simulator(None);
    let artist = root.create_user("artist".to_string(), to_yocto("100"));
    let collector = root.create_user("collector".to_string(), to_yocto("100"));

    // Deploy and init FT token
    let ft_contract = root.deploy_and_init(
        &FT_CONTRACT_WASM_FILE,
        FT_CONTRACT_ID.to_string(),
        "new_default_meta", 
        &json!({
            "owner_id": artist.account_id(),
            "total_supply": FT_TOTAL_SUPPLY
        }).to_string().as_bytes(), 
        STORAGE_AMOUNT,
        DEFAULT_GAS
    );

    // Deploy and init NFT
    let nft_contract = root.deploy_and_init(
        &NFT_CONTRACT_WASM_FILE,
        NFT_CONTRACT_ID.to_string(),
        "new_default_meta", 
        &json!({
            "owner_id": root.account_id(),
        }).to_string().as_bytes(), 
        STORAGE_AMOUNT,
        DEFAULT_GAS
    );

    // Deploy and init farming contract
    let farming_contract = root.deploy_and_init(
        &FARMING_CONTRACT_WASM_FILE, 
        FARMING_CONTRACT_ID.to_string(), 
        "new",
        &json!({
            "owner_id": root.account_id()
        }).to_string().as_bytes(), 
        STORAGE_AMOUNT,
        DEFAULT_GAS
    );

    //Mint NFT
    artist.call(
        nft_contract.account_id(), 
        "nft_mint", 
        &json!({
            "token_id": NFT_ID_1.to_string(),
            "metadata": {
                "title": "token-1"
            },
            "receiver_id": artist.account_id()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        to_yocto("1")
    ).assert_success();
    artist.call(
        nft_contract.account_id(), 
        "nft_mint", 
        &json!({
            "token_id": NFT_ID_2.to_string(),
            "metadata": {
                "title": "token-2"
            },
            "receiver_id": artist.account_id()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        to_yocto("1")
    ).assert_success();
    artist.call(
        nft_contract.account_id(), 
        "nft_mint", 
        &json!({
            "token_id": NFT_ID_3.to_string(),
            "metadata": {
                "title": "token-3"
            },
            "receiver_id": artist.account_id()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        to_yocto("1")
    ).assert_success();

    //Transfer NFT
    artist.call(
        nft_contract.account_id(), 
        "nft_transfer", 
        &json!({
            "receiver_id": collector.account_id(),
            "token_id": NFT_ID_1.to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();
    artist.call(
        nft_contract.account_id(), 
        "nft_transfer", 
        &json!({
            "receiver_id": collector.account_id(),
            "token_id": NFT_ID_2.to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();
    artist.call(
        nft_contract.account_id(), 
        "nft_transfer", 
        &json!({
            "receiver_id": collector.account_id(),
            "token_id": NFT_ID_3.to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();

    // Whitelist NFT contract
    root.call(
        farming_contract.account_id(), 
        "whitelist_nft_contract", 
        &json!({
            "nft_contract_id": nft_contract.account_id()
        }).to_string().as_bytes(), 
        DEFAULT_GAS, 
        1
    ).assert_success();

    // Deposit FT contract for farming contract
    artist.call(
        farming_contract.account_id(), 
        "ft_deposit", 
        &json!({
            "ft_account": ft_contract.account_id()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        to_yocto("0.126")
    ).assert_success();

    //create farm
    artist.call(
        farming_contract.account_id(), 
        "create_farm", 
        &json!({
            "terms": {
                "seed_id": ft_contract.account_id(),
                "start_at": "0",
                "reward_per_session": U128(RPS),
                "session_interval": "1"
            },
            "nft_contract_id": nft_contract.account_id(),
            "accepted_nfts": ["token-1", "token-2", "token-3"]
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();
    let mut farm_0 = ft_contract.account_id().clone();
    farm_0.push_str("#0");
    //add reward
    artist.call(
        ft_contract.account_id(), 
        "ft_transfer_call", 
        &json!({
            "receiver_id": farming_contract.account_id(),
            "amount": U128(100000000000000),
            "msg": &json!({"farm_id": farm_0.clone()}).to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();
    //collector register to be a farmer
    collector.call(
        ft_contract.account_id(), 
        "storage_deposit", 
        &json!({}).to_string().as_bytes(),
        DEFAULT_GAS, 
        to_yocto("0.126")
    ).assert_success();

    collector.call(
        farming_contract.account_id(), 
        "storage_deposit", 
        &json!({}).to_string().as_bytes(),
        DEFAULT_GAS, 
        to_yocto("2")
    ).assert_success();

    let nft_transfer_res= collector.call(
        nft_contract.account_id(), 
        "nft_transfer_call", 
        &json!({
            "receiver_id": farming_contract.account_id(),
            "token_id": NFT_ID_1,
            "msg": &json!({"farm_id": farm_0.clone()}).to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).promise_results();
    // print!("LAST_OUTCOMES: {:#?}", nft_transfer_res);

    let from: u64 = 0;
    let limit: u64 = 10; 
    let list_farms: Vec<(String, FarmInfo)> = root.view(
        farming_contract.account_id(), 
        "list_farms", 
        &json!({
            "from_index": from,
            "limit": limit
        }).to_string().as_bytes()
    ).unwrap_json();

    assert_eq!(list_farms.len(), 1);
    // assert_eq!(farm_info_v1.claimed_reward, U128(0));
    // assert_eq!(farm_info_v1.total_reward, U128(0));

    (root, artist, collector, ft_contract, nft_contract, farming_contract)
}

#[test]
pub fn test_create_farm() {
    let (root, artist, _collector, ft_contract, nft_contract, farming_contract) = init();

    //create farm
    artist.call(
        farming_contract.account_id(), 
        "create_farm", 
        &json!({
            "terms": {
                "seed_id": ft_contract.account_id(),
                "start_at": "0",
                "reward_per_session": U128(RPS),
                "session_interval": "1"
            },
            "nft_contract_id": nft_contract.account_id(),
            "accepted_nfts": ["token-1", "token-2", "token-3"]
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();
    let mut farm_1 = ft_contract.account_id().clone();
    farm_1.push_str("#1");
    let farm_info_v1: FarmInfo = root.view(
        farming_contract.account_id(), 
        "get_farm", 
        &json!({
            "farm_id": farm_1.clone()
        }).to_string().as_bytes()
    ).unwrap_json();

    assert!(farm_info_v1.owner_id.contains(&artist.account_id()));
    assert!(farm_info_v1.farm_status.contains("Created"));
    assert_eq!(farm_info_v1.total_reward.0, 0);
    assert_eq!(farm_info_v1.claimed_reward.0, 0);

    //add reward
    artist.call(
        ft_contract.account_id(), 
        "ft_transfer_call", 
        &json!({
            "receiver_id": farming_contract.account_id(),
            "amount": U128(100000000000000),
            "msg": &json!({"farm_id": farm_1.clone()}).to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();

    let farm_info_v2: FarmInfo = root.view(
        farming_contract.account_id(), 
        "get_farm", 
        &json!({
            "farm_id": farm_1.clone()
        }).to_string().as_bytes()
    ).unwrap_json();

    assert!(farm_info_v2.owner_id.contains(&artist.account_id()));
    assert!(farm_info_v2.farm_status.contains("Running"));
    assert_eq!(farm_info_v2.total_reward.0, 100000000000000);

    let from: u64 = 0;
    let limit: u64 = 10; 
    let list_farms: Vec<(String, FarmInfo)> = root.view(
        farming_contract.account_id(), 
        "list_farms", 
        &json!({
            "from_index": from,
            "limit": limit
        }).to_string().as_bytes()
    ).unwrap_json();

    assert_eq!(list_farms.len(), 2);
    assert_eq!(list_farms[0].1.staked_nfts.len(), 1);
}

#[test]
pub fn test_stake_farm() {
    let (root, _artist, collector, ft_contract, nft_contract, farming_contract) = init();
    let mut farm_0 = ft_contract.account_id().clone();
    farm_0.push_str("#0");
    //stake farm
    collector.call(
        nft_contract.account_id(), 
        "nft_transfer_call", 
        &json!({
            "receiver_id": farming_contract.account_id(),
            "token_id": NFT_ID_2,
            "msg": &json!({"farm_id": farm_0}).to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();

    let farmer_info_v1: FarmerInfo = root.view(
        farming_contract.account_id(), 
        "get_farmer", 
        &json!({
            "account_id": collector.account_id()
        }).to_string().as_bytes()
    ).unwrap_json();
    assert_eq!(farmer_info_v1.staking_info[0].amount, 2);

    let from: u64 = 0;
    let limit: u64 = 10; 
    let list_farms: Vec<(String, FarmInfo)> = root.view(
        farming_contract.account_id(), 
        "list_farms", 
        &json!({
            "from_index": from,
            "limit": limit
        }).to_string().as_bytes()
    ).unwrap_json();

    assert_eq!(list_farms.len(), 1);
    assert_eq!(list_farms[0].1.staked_nfts.len(), 2);
}

#[test]
pub fn test_claim_farm() {
    let (root, _artist, collector, ft_contract, nft_contract, farming_contract) = init();
    let mut farm_0 = ft_contract.account_id().clone();
    farm_0.push_str("#0");
    //claim farm
    assert!(root.borrow_runtime_mut().produce_blocks(60).is_ok());
    collector.call(
        farming_contract.account_id(), 
        "claim_reward_by_farm", 
        &json!({
            "farm_id": farm_0.clone()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();

    let farm_info_v1: FarmInfo = root.view(
        farming_contract.account_id(), 
        "get_farm", 
        &json!({
            "farm_id": farm_0.clone()
        }).to_string().as_bytes()
    ).unwrap_json();
    assert_ne!(farm_info_v1.claimed_reward.0, 0);
}


#[test]
pub fn test_withdraw_farm() {
    let (root, _artist, collector, ft_contract, nft_contract, farming_contract) = init();
    let mut farm_0 = ft_contract.account_id().clone();
    farm_0.push_str("#0");
    //claim farm
    assert!(root.borrow_runtime_mut().produce_blocks(60).is_ok());
    collector.call(
        farming_contract.account_id(), 
        "withdraw", 
        &json!({
            "farm_id": farm_0.clone(),
            "token_id": NFT_ID_1.to_string()
        }).to_string().as_bytes(),
        DEFAULT_GAS, 
        1
    ).assert_success();

    let farm_info_v1: FarmInfo = root.view(
        farming_contract.account_id(), 
        "get_farm", 
        &json!({
            "farm_id": farm_0.clone()
        }).to_string().as_bytes()
    ).unwrap_json();
    assert_ne!(farm_info_v1.claimed_reward.0, 0);
    assert_eq!(farm_info_v1.staked_nfts.len(), 0);
}