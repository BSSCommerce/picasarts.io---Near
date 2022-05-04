use crate::*;
use near_contract_standards::fungible_token::receiver::FungibleTokenReceiver;
use near_contract_standards::non_fungible_token::core::NonFungibleTokenReceiver;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, serde_json, PromiseOrValue};
/// Message parameters to receive via token function call.
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct FTReceiverMessage {
    farm_id: FarmId
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct NFTReceiverMessage {
    farm_id: FarmId
}

#[near_bindgen]
impl FungibleTokenReceiver for Contract {
    /// Callback on receiving tokens by this contract.
    /// transfer reward token with specific msg indicate
    /// which farm to be deposited to.
    fn ft_on_transfer(
        &mut self,
        sender_id: ValidAccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        let sender: AccountId = sender_id.into();
        let amount: u128 = amount.into();
        let seed_id = env::predecessor_account_id();
        if msg.is_empty() {
            env::panic(b"We do not support FT staking.");
        } else {
            let message = serde_json::from_str::<FTReceiverMessage>(&msg).expect("Wrong format");
            if message.farm_id.is_empty() {
                return PromiseOrValue::Value(U128(amount));
            } else {
                self.internal_add_reward_to_farm(sender, seed_id, message.farm_id, amount);
            }
            PromiseOrValue::Value(U128(0))
        }
    }
}

#[near_bindgen]
impl NonFungibleTokenReceiver for Contract {
    fn nft_on_transfer(
        &mut self,
        _sender_id: AccountId,
        previous_owner_id: AccountId,
        token_id: NFTTokenId,
        msg: String,
    ) -> PromiseOrValue<bool> {
        let nft_contract_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();

        assert_ne!(
            nft_contract_id, signer_id,
            "nft_on_approve should only be called via cross-contract call"
        );

        assert_eq!(
            previous_owner_id,
            signer_id,
            "Owner_id should be signer_id"
        );

        if msg.is_empty() {
            env::panic(b"Not found farm_id args");
        } else {
            let message = serde_json::from_str::<NFTReceiverMessage>(&msg).expect("Wrong format");
            if !message.farm_id.is_empty() {
                self.internal_stake(message.farm_id, previous_owner_id, nft_contract_id, token_id);
                return PromiseOrValue::Value(false);
            } else {
                return PromiseOrValue::Value(true);
            }
        }
    }
}
