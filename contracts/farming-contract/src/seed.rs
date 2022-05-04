use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId};

pub(crate) type SeedId = AccountId;

#[derive(BorshSerialize, BorshDeserialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Seed {
    pub seed_id: SeedId,
    pub next_index: u32,
}

impl Seed {
    pub fn new(seed_id: SeedId) -> Self {
        Self {
            seed_id: seed_id,
            next_index: 0
        }
    }
}
