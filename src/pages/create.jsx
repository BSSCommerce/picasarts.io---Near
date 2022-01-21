import React, { useContext, useEffect, useState } from 'react';

import { appStore, onAppMount } from '../state/app';
import { Minting } from 'src/components/nft/Minting';
import Box from "@mui/material/Box";


const Create = () => {
    const { state, dispatch, update } = useContext(appStore);

    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;

    const [profile, setProfile] = useState(false);

    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);


    const signedIn = ((wallet && wallet.signedIn));

    if (profile && !signedIn) {
        setProfile(false);
    }

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >

            {
                signedIn && <Minting {...{ near, update, wallet, account }} />

            }

        </Box>
        )
};

export default Create;
