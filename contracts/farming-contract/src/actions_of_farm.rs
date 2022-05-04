use crate::farm::{ContractNFTTokenId, Farm, FarmId, FarmInfo, Status, TermsJson};
use crate::seed::Seed;
use crate::utils::{ext_nft, ext_self, parse_farm_id, XCC_GAS, GAS_FOR_NFT_TRANSFER};
use crate::*;
use near_sdk::json_types::{U128, U64};
use near_sdk::{assert_one_yocto, env, near_bindgen, Balance, Promise, PromiseResult};
use near_sdk::{serde_json, Timestamp};
use std::collections::HashSet;

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn create_farm(
        &mut self,
        terms: TermsJson,
        nft_contract_id: &AccountId,
        accepted_nfts: HashSet<NFTTokenId>,
    ) -> Promise {
        assert!(
            self.is_whitelist_nft_contract(nft_contract_id),
            "We are not connected with this NFT contract"
        );

        let sender_id = env::predecessor_account_id();
        ext_nft::is_creator_of_nfts(sender_id.clone(), accepted_nfts.clone(), nft_contract_id, 0, XCC_GAS).then(
            ext_self::callback_check_nfts_owner(
                sender_id,
                terms,
                nft_contract_id.into(),
                accepted_nfts,
                &env::current_account_id(),
                0,
                XCC_GAS,
            ),
        )
    }

    #[payable]
    pub fn claim_reward_by_farm(&mut self, farm_id: FarmId) {
        let sender_id = env::predecessor_account_id();
        let new_staked_at = env::block_timestamp();
        let farm = self.farms.get(&farm_id).unwrap();
        let will_claim_amount = self.internal_get_claimable(&farm_id, &sender_id, new_staked_at);

        assert!(farm.status == Status::Running, "Farm is not running");
        assert!(farm.terms.start_at <= new_staked_at, "Farm is not started");
        assert_ne!(will_claim_amount, 0, "Not time for claiming reward");

        self.internal_claim_reward_by_farm(&farm_id, &sender_id, will_claim_amount, new_staked_at);
    }

    #[payable]
    pub fn withdraw(&mut self, farm_id: FarmId, token_id: NFTTokenId) {
        assert_one_yocto();
        self.internal_withdraw(farm_id, token_id);
    }

    /// View methods.
    pub fn get_number_of_farms(&self) -> U64 {
        U64(self.farms.len())
    }

    pub fn get_claimable_amount(&self, farm_id: FarmId, farmer_id: AccountId) -> U128 {
        let new_staked_at = env::block_timestamp();
        U128(self.internal_get_claimable(&farm_id, &farmer_id, new_staked_at))
    }

    pub fn list_farms(&self, from_index: u64, limit: u64) -> Vec<(String, FarmInfo)> {
        let keys = self.farms.keys_as_vector();

        (from_index..std::cmp::min(from_index + limit, self.farms.len()))
            .map(|index| (keys.get(index).unwrap(), (&self.farms.get(&keys.get(index).unwrap()).unwrap()).into()))
            .collect()
    }

    #[private]
    pub fn callback_check_nfts_owner(
        &mut self,
        owner_id: AccountId,
        terms: TermsJson,
        nft_contract_id: &AccountId,
        accepted_nfts: HashSet<NFTTokenId>,
    ) -> FarmId {
        assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Successful(val) => {
                if let Ok(is_owner) = serde_json::from_slice::<bool>(&val) {
                    assert!(is_owner, "ERR_NOT_NFTS_OWNERS");
                    self.internal_add_farm(owner_id, terms, nft_contract_id, accepted_nfts)
                } else {
                    env::panic(b"ERR_WRONG_VAL_RECEIVED")
                }
            }
            PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
        }
    }
}

impl Contract {
    fn internal_claim_reward_by_farm(
        &mut self,
        farm_id: &FarmId,
        sender_id: &AccountId,
        amount: Balance,
        new_staked_at: Timestamp,
    ) {
        let (seed_id, _) = parse_farm_id(&farm_id);
        if let Some(_seed) = self.seeds.get(&seed_id) {
            let mut farmer = self.farmers.get(&sender_id).unwrap();
            let mut farm = self.farms.get(&farm_id).unwrap();
            let remain_amount = farm.amount_of_reward;

            if remain_amount <= amount {
                self.internal_claim_user_reward(remain_amount, sender_id, &seed_id);
                farm.set_ended(remain_amount);
            } else {
                self.internal_claim_user_reward(amount, sender_id, &seed_id);
                farm.amount_of_claimed += amount;
                farm.amount_of_reward -= amount;
                let mut staking_info = farmer.staking.get(&farm_id).unwrap();
                staking_info.last_staked_at = new_staked_at;
                farmer.staking.insert(&farm_id, &staking_info);
            }

            self.farmers.insert(&sender_id, &farmer);
            self.farms.insert(&farm_id, &farm);
        }
    }

    pub fn internal_stake(
        &mut self,
        farm_id: FarmId,
        prev_owner: AccountId,
        nft_contract_id: AccountId,
        token_id: NFTTokenId,
    ) {
        let new_staked_at = env::block_timestamp();
        let mut farmer = self.farmers.get(&prev_owner).unwrap();
        let mut farm = self.farms.get(&farm_id).unwrap();

        assert!(farm.status != Status::Ended, "This farm is ended");
        assert!(
            farm.accepted_nfts.contains(&token_id),
            "This farm is not accept your NFT"
        );
        assert_eq!(
            farm.nft_contract_id, nft_contract_id,
            "This farm is not accept your NFT"
        );

        let farm_staked_info = StakedInfo {
            owner_id: prev_owner.clone(),
            staked_at: new_staked_at,
        };

        if let Some(mut staking_info) = farmer.staking.get(&farm_id) {
            let will_claim_amount = self.internal_get_claimable(&farm_id, &prev_owner, new_staked_at);
            assert_ne!(
                will_claim_amount, farm.amount_of_reward,
                "Farm\'s reward is almost over. Please claim your rewards as soon as possible"
            );
            farm.staked_nfts.insert(&token_id, &farm_staked_info);
            staking_info.amount += 1;
            farmer.staking.insert(&farm_id, &staking_info);
            
            self.farmers.insert(&prev_owner, &farmer);
            self.farms.insert(&farm_id, &farm);
            if will_claim_amount != 0 {
                self.internal_claim_reward_by_farm(
                    &farm_id,
                    &prev_owner,
                    will_claim_amount,
                    new_staked_at
                );
            }
        } else {
            let mut time_staked = new_staked_at;
            if new_staked_at > farm.terms.start_at {
                time_staked = new_staked_at;
            }
            let new_staking_info = StakingInfo {
                last_staked_at: time_staked,
                amount: 1,
            };

            farm.staked_nfts.insert(&token_id, &farm_staked_info);
            farmer.staking.insert(&farm_id, &new_staking_info);
            self.farmers.insert(&prev_owner, &farmer);
            self.farms.insert(&farm_id, &farm);
        }
    }

    pub fn internal_withdraw(
        &mut self,
        farm_id: FarmId,
        token_id: NFTTokenId
    ) {
        let sender_id = env::predecessor_account_id();
        let new_staked_at = env::block_timestamp();
        let mut farmer = self.farmers.get(&sender_id).unwrap();
        let mut farm = self.farms.get(&farm_id).unwrap();

        if let Some(token) = farm.staked_nfts.get(&token_id) {
            assert_eq!(
                token.owner_id, sender_id,
                "You are not the owner of this NFT"
            );
            if (new_staked_at - token.staked_at) >= farm.terms.session_interval
                && new_staked_at > farm.terms.start_at
            {
                let will_claim_amount =
                    self.internal_get_claimable(&farm_id, &sender_id, new_staked_at);
                let mut staking_info = farmer.staking.get(&farm_id).unwrap();
                staking_info.last_staked_at = new_staked_at;
                staking_info.amount -= 1;
                farm.staked_nfts.remove(&token_id);
                farmer.staking.insert(&farm_id, &staking_info);
                self.farmers.insert(&sender_id, &farmer);
                self.farms.insert(&farm_id, &farm);
                
                if will_claim_amount != 0 {
                    self.internal_claim_reward_by_farm(
                        &farm_id,
                        &sender_id,
                        will_claim_amount,
                        new_staked_at
                    );
                }
                self.internal_withdraw_nft(token_id, &sender_id, farm.nft_contract_id.clone());
            } else {
                env::panic(b"Not time for withdraw");
            }
        } else {
            env::panic(b"Not found this NFT in farm");
        }
    }

    fn internal_add_farm(
        &mut self,
        owner_id: AccountId,
        terms: TermsJson,
        nft_contract_id: &AccountId,
        accepted_nfts: HashSet<ContractNFTTokenId>,
    ) -> FarmId {
        let mut seed: Seed;
        if let Some(s) = self.seeds.get(&terms.seed_id.clone()) {
            seed = s;
            env::log(format!("New farm created with seed {}", terms.seed_id.clone()).as_bytes());
        } else {
            seed = Seed::new(terms.seed_id.clone());
            env::log(
                format!("The first farm created In seed {}", terms.seed_id.clone()).as_bytes(),
            );
        }
        let seed_id = terms.seed_id.clone();
        let farm_id: FarmId = format!("{}#{}", &terms.seed_id.clone(), seed.next_index as usize);
        let farm = Farm::new(
            owner_id,
            farm_id.clone(),
            terms.into(),
            nft_contract_id.into(),
            accepted_nfts,
        );

        seed.next_index += 1;
        self.seeds.insert(&seed_id, &seed);
        self.farms.insert(&farm_id.clone(), &farm);
        farm_id
    }

    pub fn internal_get_claimable(
        &self,
        farm_id: &FarmId,
        farmer_id: &AccountId,
        new_staked_at: Timestamp
    ) -> Balance {
        let mut will_claim_amount: Balance = 0;
        if let Some(farm) = self.farms.get(&farm_id) {
            if let Some(staking_info) = self.farmers.get(farmer_id).unwrap().staking.get(&farm_id)
            {
                if (new_staked_at - staking_info.last_staked_at) > farm.terms.session_interval
                    && farm.status == Status::Running
                {
                    will_claim_amount = staking_info.amount * farm.terms.reward_per_session;
                    will_claim_amount *=
                        (new_staked_at - staking_info.last_staked_at) as u128;
                    will_claim_amount /= farm.terms.session_interval as u128;
                    if will_claim_amount > farm.amount_of_reward {
                        will_claim_amount = farm.amount_of_reward;
                    }
                }
            }
        }
        will_claim_amount
    }

    pub fn internal_withdraw_nft(
        &mut self,
        token_id: NFTTokenId,
        sender_id: &AccountId,
        nft_contract_id: AccountId,
    ) -> Promise {
        ext_nft::nft_transfer(
            sender_id.clone().try_into().unwrap(),
            token_id,
            None,
            None,
            &nft_contract_id,
            1,
            GAS_FOR_NFT_TRANSFER
        )
    }
}
