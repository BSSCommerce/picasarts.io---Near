import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import NearIcon from '../icons/NearIcon';

export const Wallet = ({ wallet, account, handleOpenUserMenu }) => {
	if (wallet && wallet.signedIn) {
		return <Button sx={{ display: "flex", color: "white", textTransform: 'none' }} onClick={handleOpenUserMenu}>
			{account.accountId} | {wallet.balance} N
		</Button>;
	}

	return (
		<Button color="inherit" onClick={() => wallet.signIn()}>Connect Wallet |</Button>
	)
};

