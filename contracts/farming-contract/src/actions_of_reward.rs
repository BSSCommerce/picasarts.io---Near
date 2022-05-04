use near_sdk::{env, AccountId, Balance, Promise};
use std::convert::TryInto;

use crate::utils::{ext_ft, GAS_FOR_FT_TRANSFER};
use crate::*;

impl Contract {
    pub fn internal_claim_user_reward(
        &mut self,
        amount: Balance,
        sender_id: &AccountId,
        seed_id: &SeedId,
    ) -> Promise {
        ext_ft::ft_transfer(
            sender_id.clone().try_into().unwrap(),
            amount.to_string(),
            None,
            seed_id,
            1,
            GAS_FOR_FT_TRANSFER,
        )
    }

    pub fn internal_add_reward_to_farm(
        &mut self,
        sender_id: AccountId,
        seed_id: AccountId,
        farm_id: FarmId,
        amount: Balance,
    ) {
        if let Some(mut farm) = self.farms.get(&farm_id) {
            assert!(
                sender_id == farm.owner_id,
                "You are not farm owner"
            );
            assert!(
                seed_id == farm.terms.seed_id,
                "You added wrong seed"
            );
            farm.add_reward(&amount);
            self.farms.insert(&farm_id, &farm);
        } else {
            env::panic(b"Farm not found");
        }
    }
}
