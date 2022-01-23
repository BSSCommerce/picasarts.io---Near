import React, {useContext, useEffect, useState} from "react";
import {appStore, onAppMount} from "src/state/app";
import NotLoggedIn from "../../components/common/NotLoggedIn";
import CollectionForm from "../../components/collection/CollectionForm";
import Box from "@mui/material/Box";

export default function NewCollection() {
    const { state, dispatch } = useContext(appStore);

    const {  wallet, account } = state;

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
                signedIn && <CollectionForm account={account} />

            }
            {
                !signedIn && <NotLoggedIn wallet={wallet} />
            }

        </Box>
    )
}