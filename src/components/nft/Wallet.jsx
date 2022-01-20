import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import * as nearAPI from 'near-api-js';
import { updateWallet } from '../../state/near';
import {
	getContract,
	contractMethods,
	GAS
} from '../../utils/near-utils';
const {
	KeyPair,
	utils: { PublicKey,
		format: {
			formatNearAmount
		} }
} = nearAPI;

export const Wallet = ({ wallet, account, update, dispatch, handleClose }) => {

	const [accountId, setAccountId] = useState('');
	const [proceeds, setProceeds] = useState('0');

	if (wallet && wallet.signedIn) {
		return <div style={{display: "flex"}}>
			<h4> {account.accountId} | { wallet.balance } N</h4><Button color="inherit" onClick={() => wallet.signOut()}> | Sign Out</Button>
		</div>;
	}

	return (
	<Button color="inherit" onClick={() => wallet.signIn()}>Connect Wallet</Button>
	)
};

