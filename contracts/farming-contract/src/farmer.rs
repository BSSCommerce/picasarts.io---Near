use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{AccountId, Balance, Timestamp};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::collections::UnorderedMap;
use crate::StorageKeys;
use crate::FarmId;

#[derive(BorshSerialize, BorshDeserialize, Debug, Serialize, Deserialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct StakingInfo {
    pub last_staked_at: Timestamp,
    pub amount: Balance,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Farmer {
    pub staking: UnorderedMap<FarmId, StakingInfo>
}

impl Farmer {
    pub fn new(farmer_id: AccountId) -> Self {
        Self {
            staking: UnorderedMap::new(StorageKeys::FarmerStaking {
                account_id: farmer_id.clone()
            }),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct FarmerInfo {
    pub farm_staking: Vec<FarmId>,
    pub staking_info: Vec<StakingInfo>
}

impl From<Farmer> for FarmerInfo {
    fn from(farmer: Farmer) -> Self {
        Self {
            farm_staking: farmer.staking.keys_as_vector().to_vec(),
            staking_info: farmer.staking.values_as_vector().to_vec()
        }
    }
}
