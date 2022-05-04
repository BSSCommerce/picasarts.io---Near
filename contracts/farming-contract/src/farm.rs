use near_sdk::{env, AccountId, Balance, Timestamp};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::json_types::{U64, U128};
use near_sdk::serde::{Deserialize, Serialize};
use std::collections::{HashSet};
use crate::{SeedId, StorageKeys};

pub(crate) type FarmId = String;

#[derive(BorshSerialize, BorshDeserialize, Clone, PartialEq)]
pub enum Status {
    Created, Running, Ended
}

pub type ContractNFTTokenId = String;
pub type NFTTokenId = String;

impl From<&Status> for String {
    fn from(status: &Status) -> Self {
        match *status {
            Status::Created => { String::from("Created") },
            Status::Running => { String::from("Running") },
            Status::Ended => { String::from("Ended") }
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct StakedInfo {
    pub owner_id: AccountId,
    pub staked_at: Timestamp
}

#[derive(BorshSerialize, BorshDeserialize, Clone)]
pub struct Terms {
    pub seed_id: SeedId,
    pub start_at: Timestamp,
    pub reward_per_session: Balance,
    pub session_interval: Timestamp,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct TermsJson {
    pub seed_id: SeedId,
    pub start_at: U64,
    pub reward_per_session: U128,
    pub session_interval: U64,
}

impl From<TermsJson> for Terms {
    fn from(terms: TermsJson) -> Self {
        Terms {
            seed_id: terms.seed_id.clone(),
            start_at: terms.start_at.into(),
            reward_per_session: terms.reward_per_session.into(),
            session_interval: terms.session_interval.into(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Farm {
    pub owner_id: AccountId,
    pub terms: Terms,
    pub status: Status,
    pub amount_of_reward: Balance,
    pub amount_of_claimed: Balance,
    pub nft_contract_id: AccountId,
    pub staked_nfts: UnorderedMap<NFTTokenId, StakedInfo>,
    pub accepted_nfts: HashSet<NFTTokenId>
}

impl Farm {
    pub fn new(
        owner_id: AccountId,
        farm_id: FarmId,
        terms: Terms,
        nft_contract_id: AccountId,
        accepted_nfts: HashSet<NFTTokenId>
    ) -> Self {
        Self {
            owner_id,
            terms,
            status: Status::Created,
            amount_of_claimed: 0,
            amount_of_reward: 0,
            nft_contract_id,
            staked_nfts: UnorderedMap::new(StorageKeys::StakedNFTs {
                farm_id: farm_id.clone(),
            }),
            accepted_nfts
        }
    }

    pub fn set_ended(&mut self, amount: Balance) {
        self.amount_of_reward = 0;
        self.amount_of_claimed += amount;
        self.status = Status::Ended;
    }

    pub(crate) fn add_reward(&mut self, amount: &Balance){
        match self.status {
            Status::Created => {
                // When a farm gots first deposit of reward, it turns to Running state,
                // but farming or not depends on `start_at` 
                self.status = Status::Running;
                if self.terms.start_at == 0 {
                    // for a farm without start time, the first deposit of reward 
                    // would trigger the farming
                    self.terms.start_at = env::block_timestamp();
                }
                self.amount_of_reward += amount;
            },
            Status::Running => {
                self.amount_of_reward += amount;
            },
            _ => {
                env::panic(b"Farm is ended");
            },
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct FarmInfo {
    pub owner_id: String,
    pub farm_status: String,
    pub seed_id: SeedId,
    pub start_at: u64,
    pub reward_per_session: U128,
    pub session_interval: u64,
    pub nft_contract_id: String,

    pub total_reward: U128,
    pub claimed_reward: U128,
    pub accepted_nfts: HashSet<NFTTokenId>,
    pub staked_ids: Vec<NFTTokenId>,
    pub staked_nfts: Vec<StakedInfo>
}

impl From<&Farm> for FarmInfo {
    fn from(farm: &Farm) -> Self {
        Self {
            owner_id: farm.owner_id.clone(),
            farm_status: (&farm.status).into(),
            seed_id: farm.terms.seed_id.clone(),
            start_at: farm.terms.start_at.into(),
            reward_per_session: farm.terms.reward_per_session.into(),
            session_interval: farm.terms.session_interval.into(),
            nft_contract_id: farm.nft_contract_id.clone(),
            total_reward: farm.amount_of_reward.into(),
            claimed_reward: farm.amount_of_claimed.into(),
            accepted_nfts: farm.accepted_nfts.clone(),
            staked_ids: farm.staked_nfts.keys_as_vector().to_vec(),
            staked_nfts: farm.staked_nfts.values_as_vector().to_vec()
        }
    }
}
