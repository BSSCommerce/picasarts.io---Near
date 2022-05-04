use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};

use std::convert::TryInto;

use near_sdk::json_types::{ValidAccountId, U128};
use near_sdk::{assert_one_yocto, env, near_bindgen, Promise};
use crate::*;

pub const STORAGE_BALANCE_MIN_BOUND: u128 = 100_000_000_000_000_000_000_000;

/// Implements users storage management for the pool.
#[near_bindgen]
impl StorageManagement for Contract {
    #[allow(unused_variables)]
    #[payable]
    fn storage_deposit(
        &mut self,
        account_id: Option<ValidAccountId>,
        registration_only: Option<bool>,
    ) -> StorageBalance {
        let amount = env::attached_deposit();
        let account_id = account_id
            .map(|a| a.into())
            .unwrap_or_else(|| env::predecessor_account_id());
        let already_registered = self.farmers.contains_key(&account_id);
        if amount < STORAGE_BALANCE_MIN_BOUND && !already_registered {
            env::panic("Not deposit enough storage".as_bytes());
        }

        if already_registered {
            if amount > 0 {
                Promise::new(env::predecessor_account_id()).transfer(amount);
            }
        } else {
            self.farmers.insert(&account_id, &Farmer::new(account_id.clone()));
            self.farmer_count += 1;
            let refund = amount - STORAGE_BALANCE_MIN_BOUND;
            if refund > 0 {
                Promise::new(env::predecessor_account_id()).transfer(refund);
            }
        }
        self.storage_balance_of(account_id.try_into().unwrap()).unwrap()
    }

    #[allow(unused_variables)]
    #[payable]
    fn storage_withdraw(&mut self, amount: Option<U128>) -> StorageBalance {
        assert_one_yocto();

        let account_id = env::predecessor_account_id();
        Promise::new(account_id.clone()).transfer(amount.unwrap().into());
        self.storage_balance_of(account_id.try_into().unwrap()).unwrap()
    }

    #[allow(unused_variables)]
    #[payable]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        assert_one_yocto();
        // force option is useless, leave it for compatible consideration.
        // User should withdraw all his rewards and seeds token before unregister!
        let account_id = env::predecessor_account_id();
        if let Some(farmer) = self.farmers.get(&account_id) {
            // todo: how about his rps lookup map? maybe already cleaned when unstake all seeds
            self.farmers.remove(&account_id);
            self.farmer_count -= 1;
            Promise::new(account_id.clone()).transfer(STORAGE_BALANCE_MIN_BOUND);
            true
        } else {
            false
        }
    }

    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
        StorageBalanceBounds {
            min: U128(STORAGE_BALANCE_MIN_BOUND),
            max: None,
        }
    }

    fn storage_balance_of(&self, account_id: ValidAccountId) -> Option<StorageBalance> {
        if self.farmers.contains_key(&account_id.into()) {
            Some(StorageBalance {
                total: U128(STORAGE_BALANCE_MIN_BOUND),
                available: U128(0),
            })
        } else {
            None
        }
    }
}
