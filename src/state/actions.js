import BN from "bn.js";
import {
  GAS,
  parseNearAmount,
  marketId,
  contractId,
  factoryId,
  farmingId,
} from "./near";
import { uploadToCrust } from "near-crust-ipfs";
import { transactions } from "near-api-js";
import { loadRequiredDeposit } from "./views";
import { formatNearAmount } from "near-api-js/lib/utils/format";

export const handleMint = async (
  account,
  royalties,
  media,
  validMedia,
  title,
  description,
  setValidateTitleMessage,
  setIsRequireMediaMessage,
  setValidateRoyaltiesMessage,
  setIsLoading
) => {
  setIsLoading(true);
  if (!title) {
    setValidateTitleMessage("Please enter item title");
    setIsLoading(false);
    return false;
  } else {
    setValidateTitleMessage("");
  }
  if (!media) {
    setIsRequireMediaMessage("Please enter a valid Image Link");
    setIsLoading(false);
    return false;
  } else {
    setIsRequireMediaMessage("");
  }

  const { cid, path } = await uploadToCrust(media);
  // shape royalties data for minting and check max is < 20%
  let perpetual_royalties = Object.entries(royalties)
    .map(([receiver, royalty]) => ({
      [receiver]: royalty * 100,
    }))
    .reduce((acc, cur) => Object.assign(acc, cur), {});
  if (Object.values(perpetual_royalties).reduce((a, c) => a + c, 0) > 2000) {
    setValidateRoyaltiesMessage(
      "Cannot add more than 20% in perpetual NFT royalties when minting"
    );
    setIsLoading(false);
    return false;
  } else {
    setValidateRoyaltiesMessage("");
  }

  const metadata = {
    title: title,
    description: description,
    media: path,
    issued_at: Date.now(),
  };
  const deposit = parseNearAmount("0.1");
  await account.functionCall(
    contractId,
    "nft_mint",
    {
      token_id: "token-" + Date.now(),
      metadata,
      perpetual_royalties,
      receiver_id: account.accountId,
    },
    GAS,
    deposit
  );
  setIsLoading(false);
};

export const handleAcceptOffer = async (account, token_id, ft_token_id) => {
  if (ft_token_id !== "near") {
    return alert("currently only accepting NEAR offers");
  }
  await account.functionCall(
    marketId,
    "accept_offer",
    {
      nft_contract_id: contractId,
      token_id,
      ft_token_id,
    },
    GAS
  );
};

export const handleRegisterStorage = async (account) => {
  // WARNING this just pays for 10 "spots" to sell NFTs in marketplace vs. paying each time
  await account.functionCall(
    marketId,
    "storage_deposit",
    {},
    GAS,
    new BN(await account.viewFunction(marketId, "storage_amount", {}, GAS)).mul(
      new BN("10")
    )
  );
};

export const handleSaleUpdate = async (
  account,
  token_id,
  newSaleConditions,
  isAuction
) => {
  const sale = await account
    .viewFunction(marketId, "get_sale", {
      nft_contract_token: contractId + "||" + token_id,
    })
    .catch(() => {});
  if (sale) {
    let saleConditions = Object.entries(newSaleConditions);
    await account.functionCall(
      marketId,
      "update_price",
      {
        nft_contract_id: contractId,
        token_id,
        ft_token_id: saleConditions[0][0],
        price: saleConditions[0][1],
        is_auction: isAuction === "1",
      },
      GAS,
      1
    );
  } else {
    await account.functionCall(
      contractId,
      "nft_approve",
      {
        token_id,
        account_id: marketId,
        msg: JSON.stringify({
          sale_conditions: newSaleConditions,
          is_auction: isAuction === "1",
        }),
      },
      GAS,
      parseNearAmount("0.01")
    );
  }
};

export const handleTransfer = async (account, receiver_id, token_id) => {
  await account.functionCall(
    contractId,
    "nft_transfer",
    {
      receiver_id,
      token_id,
    },
    GAS,
    1
  );
};

export const addReward = async (account, seed_id, farm_id, amount) => {
  await account.functionCall(
    seed_id,
    "ft_transfer_call",
    {
      receiver_id: farmingId,
      amount: amount,
      msg: JSON.stringify({ farm_id: farm_id }),
    },
    200000000000000,
    1
  );
};

export const createNewFT = async (account, args) => {
  const amount = await loadRequiredDeposit(account, account.accountId, args);
  let actions = [
    transactions.functionCall(
      "create_token",
      Buffer.from(JSON.stringify({ args: args })),
      200000000000000,
      "0"
    ),
  ];
  if (amount) {
    actions.unshift(
      transactions.functionCall(
        "storage_deposit",
        {},
        1000000000000,
        new BN(amount).add(new BN("1000000"))
      )
    );
  }
  const result = await account.signAndSendTransaction({
    receiverId: factoryId,
    actions: actions,
  });
  return result;
};

export const createNewFarm = async (account, args) => {
  let actions = [
    transactions.functionCall(
      "create_farm",
      args,
      200000000000000,
      parseNearAmount("2")
    ),
  ];

  let is_deposit = await account
    .viewFunction(args.terms.seed_id, "storage_balance_of", {
      account_id: farmingId,
    })
    .catch((e) => {
      console.log(e);
    });

  let seed = await account
    .viewFunction(farmingId, "get_seed", {
      seed_id: args.terms.seed_id,
    })
    .catch((e) => {
      console.log(e);
    });
  let farmIndex = seed ? seed.next_index : 0;
  let url = `https://picasarts.io/stake/create?farm_index=${farmIndex}&seed_id=${args.terms.seed_id}`;
  if (!is_deposit) {
    actions.unshift(
      transactions.functionCall(
        "ft_deposit",
        {
          ft_account: args.terms.seed_id,
        },
        20000000000000,
        parseNearAmount("0.1250001")
      )
    );
  }
  const result = await account.signAndSendTransaction({
    receiverId: farmingId,
    actions: actions,
    walletCallbackUrl: url,
  });
  return result;
};

export const depositFarming = async (account) => {
  await account.functionCall(
    farmingId,
    "storage_deposit",
    {},
    20000000000000,
    parseNearAmount("1")
  );
};

export const depositFT = async (account, seed_id) => {
  await account.functionCall(
    seed_id,
    "storage_deposit",
    {},
    200000000000000,
    parseNearAmount("0.1250001")
  );
};
export const depositNFT = async (
  account,
  nft_contract_id,
  token_id,
  farm_id
) => {
  await account.functionCall(
    nft_contract_id,
    "nft_transfer_call",
    {
      receiver_id: farmingId,
      token_id: token_id,
      msg: JSON.stringify({ farm_id: farm_id }),
    },
    200000000000000,
    1
  );
};

export const claimReward = async (account, farm_id) => {
  await account.functionCall(
    farmingId,
    "claim_reward_by_farm",
    { farm_id: farm_id },
    200000000000000,
    1
  );
};

export const withdrawNFT = async (account, farm_id, token_id) => {
  await account.functionCall(
    farmingId,
    "withdraw",
    { farm_id: farm_id, token_id: token_id },
    200000000000000,
    1
  );
};