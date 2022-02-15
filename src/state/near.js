import React from 'react';
import getConfig from '../config';
import * as nearAPI from 'near-api-js';
import { getWallet, postSignedJson } from '../utils/near-utils';
import {Select, MenuItem, FormControl, TextField} from "@mui/material";

export const {
	GAS,
	explorerUrl,
	networkId, nodeUrl, walletUrl, nameSuffix,
	contractName: contractId
} = getConfig();

export const marketId = "market1." + contractId;

export const {
	utils: {
		format: {
			formatNearAmount, parseNearAmount
		}
	}
} = nearAPI;

export const initNear = () => async ({ update, getState, dispatch }) => {
	const { near, wallet, contractAccount } = await getWallet();

	wallet.signIn = () => {
		wallet.requestSignIn(contractId, 'Blah Blah');
	};
	const signOut = wallet.signOut;
	wallet.signOut = () => {
		signOut.call(wallet);
		update('wallet.signedIn', false);
		update('', { account: null });
		update('app.tab', 1);
	};

	wallet.signedIn = wallet.isSignedIn();

	let account;
	if (wallet.signedIn) {
		account = wallet.account();
		wallet.balance = formatNearAmount((await wallet.account().getAccountBalance()).available, 4);
		await update('', { near, wallet, contractAccount, account });
	}

	await update('', { near, wallet, contractAccount, account });
};

export const updateWallet = () => async ({ update, getState }) => {
	const { wallet } = await getState();
	wallet.balance = formatNearAmount((await wallet.account().getAccountBalance()).available, 2);
	await update('', { wallet });
};


export const token2symbol = {
	"near": "NEAR",
	// "dai": "DAI",
	// "usdc": "USDC",
	// "usdt": "USDT",
};

const allTokens = Object.keys(token2symbol);

export const getTokenOptions = (value, setter, accepted = allTokens) => (
	<Select
		variant="standard"
		labelId="demo-simple-select-label"
		id="demo-simple-select"
		value={value}
		onChange={(e) => setter(e.target.value)}
	>
		{
			accepted.map((value) => <MenuItem key={value} value={value}>{token2symbol[value]}</MenuItem>)
		}
	</Select>
	);


export const handleOffer = async (account, token_id, offerToken, offerPrice) => {
	try {
		if (offerToken !== 'near') {
			return alert('currently only accepting NEAR offers');
		}
		const sale = await account.viewFunction(marketId, 'get_sale', { nft_contract_token: contractId + "||" + token_id })
		if (sale) {
			let latestBid = (sale.bids.near && sale.bids.near.length) ? sale.bids.near[sale.bids.near.length - 1] : false;
			if (latestBid) {
				if (parseFloat(formatNearAmount(latestBid.price, 4)) > parseFloat(offerPrice)) {
					return "Can't pay less than or equal to latest bid price: " + formatNearAmount(latestBid.price, 4) + " NEAR";
				}
			} else {
				if (sale.sale_conditions) {
					if (parseFloat(formatNearAmount(sale.sale_conditions.near, 4)) > parseFloat(offerPrice)) {
						return "Can't pay less than or equal to current price: " + formatNearAmount(sale.sale_conditions.near, 4) + " NEAR";
					}
				} else {
					return "This NFT token is not available for sale"
				}

			}

		} else {
			console.log("Could not get sale");
			return "Could not get NFT token information";
		}


		if (offerToken === 'near') {
			await account.functionCall(marketId, 'offer', {
				nft_contract_id: contractId,
				token_id,
			}, GAS, parseNearAmount(offerPrice));
		} else {
			/// todo ft_transfer_call
		}
	} catch (e) {
		console.log("could not handle offer:", e);
	}

};

export const handleBuyNow = async (account, token_id, offerToken) => {
	try {
		if (offerToken !== 'near') {
			return alert('currently only accepting NEAR offers');
		}
		const sale = await account.viewFunction(marketId, 'get_sale', { nft_contract_token: contractId + "||" + token_id })
		if (sale) {
			let offerPrice = sale.sale_conditions.near;
			console.log(offerPrice);
			if (offerToken === 'near') {
				await account.functionCall(marketId, 'offer', {
					nft_contract_id: contractId,
					token_id,
				}, GAS, offerPrice);
			} else {
				/// todo ft_transfer_call
			}

		} else {
			console.log("Could not get sale");
			return "Could not get NFT token information";
		}



	} catch (e) {
		console.log("could not handle offer:", e);
	}

};

