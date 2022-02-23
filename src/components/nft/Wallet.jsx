import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import * as nearAPI from 'near-api-js';

export const Wallet = ({ wallet, account, handleOpenUserMenu }) => {
	if (wallet && wallet.signedIn) {
		return <div style={{display: "flex"}} onClick={handleOpenUserMenu}>
			<h4> {account.accountId} | { wallet.balance } N |</h4>
		</div>;
	}

	return (
		<Button color="inherit" onClick={() => wallet.signIn()}>Connect Wallet |</Button>
	)
};

