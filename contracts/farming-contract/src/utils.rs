use crate::farm::{NFTTokenId, TermsJson};
use crate::FarmId;
use near_sdk::{env, ext_contract, Gas};
use std::collections::HashSet;
pub const GAS_FOR_NFT_TRANSFER: Gas = 10_000_000_000_000;
pub const GAS_FOR_FT_TRANSFER: Gas = 10_000_000_000_000;
pub const XCC_GAS: Gas = 20000000000000;
#[ext_contract(ext_ft)]
trait FungibleToken {
    // change methods
    fn ft_transfer(&mut self, receiver_id: String, amount: String, memo: Option<String>);
    fn ft_transfer_call(
        &mut self,
        receiver_id: String,
        amount: String,
        memo: Option<String>,
        msg: String,
    ) -> U128;

    // view methods
    fn ft_total_supply(&self) -> String;
    fn ft_balance_of(&self, account_id: String) -> String;

    fn storage_deposit(account_id: String, registration_only: bool) -> StorageBalance;
    fn storage_balance_of(account_id: String) -> StorageBalance;
}

#[ext_contract(ext_nft)]
trait NonFungibleToken {
    // change methods
    fn nft_transfer(
        &mut self,
        receiver_id: String,
        token_id: String,
        approval_id: Option<u64>,
        memo: Option<String>,
    );

    fn storage_deposit(account_id: String, registration_only: bool) -> StorageBalance;

    fn storage_balance_of(account_id: String) -> StorageBalance;

    fn is_creator_of_nfts(account_id: String, tokens_set: HashSet<String>) -> bool;
}

#[ext_contract(ext_self)]
pub trait FarmActions {
    fn callback_check_nfts_owner(
        owner_id: AccountId,
        terms: TermsJson,
        nft_contract_id: AccountId,
        accepted_nfts: HashSet<NFTTokenId>,
    );
}

pub fn parse_farm_id(farm_id: &FarmId) -> (String, usize) {
    let v: Vec<&str> = farm_id.split("#").collect();
    if v.len() != 2 {
        env::panic(b"Farm id not found")
    }
    (v[0].to_string(), v[1].parse::<usize>().unwrap())
}
