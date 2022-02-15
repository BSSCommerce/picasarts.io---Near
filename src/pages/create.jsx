import React, { useContext, useEffect, useState } from 'react';

import { appStore, onAppMount } from '../state/app';
import { Minting } from 'src/components/nft/Minting';
import Box from "@mui/material/Box";
import NotLoggedIn from "../components/common/NotLoggedIn";


const Create = () => {
    const { state, dispatch, update } = useContext(appStore);

    const { near, wallet, account, loading } = state;

    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);


    const signedIn = ((wallet && wallet.signedIn));


    return (
       <>

            {
                signedIn && <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}>
                    <Minting {...{ near, update, wallet, account }} />
                </Box>

            }
            {
                !signedIn && <NotLoggedIn wallet={wallet} />
            }

        </>
        )
};

export default Create;
