
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::{near_bindgen, PanicOnDefault, AccountId, BorshStorageKey, Promise, Gas, env};
use near_sdk::json_types::ValidAccountId;
use crate::seed::*;
pub use crate::farmer::FarmerInfo;
pub use crate::farm::FarmInfo;
use crate::farmer::*;
use crate::farm::*;
use crate::utils::{ext_ft};
near_sdk::setup_alloc!();

mod actions_of_farm;
mod actions_of_reward;
mod seed;
mod farmer;
mod farm;
mod utils;
mod token_receiver;
mod storage_impl;
pub const GAS_FOR_FT_DEPOSIT: Gas = 10_000_000_000_000;
pub const GAS_FOR_NFT_DEPOSIT: Gas = 10_000_000_000_000;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    seeds: UnorderedMap<SeedId, Seed>,
    farmers: LookupMap<AccountId, Farmer>,
    farms: UnorderedMap<FarmId, Farm>,
    nft_contracts: UnorderedSet<AccountId>,
    farmer_count: u64
}

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Farms,
    Seeds,
    Farmers,
    NFTContracts,
    FarmerStaking { account_id: AccountId },
    StakedNFTs { farm_id: FarmId }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: ValidAccountId) -> Self {
        Self {
            owner_id: owner_id.into(),
            farmer_count: 0,
            seeds: UnorderedMap::new(StorageKeys::Seeds),
            farmers: LookupMap::new(StorageKeys::Farmers),
            farms: UnorderedMap::new(StorageKeys::Farms),
            nft_contracts: UnorderedSet::new(StorageKeys::NFTContracts)
        }
    }

    #[payable]
    pub fn whitelist_nft_contract(&mut self, nft_contract_id: ValidAccountId) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner_id,
            "ERR_NOT_ALLOWED"
        );
        self.nft_contracts.insert(&nft_contract_id.into());
    }

    #[payable]
    pub fn ft_deposit(&mut self, ft_account: ValidAccountId) -> Promise {
        assert!(env::attached_deposit() >= 1250000000000000000000, "You need attach more yocto");
        ext_ft::storage_deposit(
            env::current_account_id(),
            true,
            &ft_account,
            1250000000000000000000,
            GAS_FOR_FT_DEPOSIT,
        )
    }

    pub fn is_whitelist_nft_contract(&self, nft_contract_id: &AccountId) -> bool {
        self.nft_contracts.contains(nft_contract_id)
    }

    pub fn list_seeds(&self) -> Vec<String> {
        self.seeds.keys_as_vector().to_vec()
    }

    pub fn get_farm(&self, farm_id: FarmId) -> FarmInfo {
        let farm = self.farms.get(&farm_id).unwrap();
        FarmInfo::from(&farm)
    }

    pub fn get_farmer(&self, account_id: AccountId) -> FarmerInfo {
        FarmerInfo::from(self.farmers.get(&account_id).unwrap())
    }

    pub fn get_seed(&self, seed_id: SeedId) -> Seed {
        self.seeds.get(&seed_id).unwrap()
    }
}