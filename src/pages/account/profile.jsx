import React, {useContext, useEffect} from "react";
import {appStore, onAppMount} from "../../state/app";
import ProfileForm from "src/components/account/ProfileForm";
import Box from "@mui/material/Box";
import {Minting} from "../../components/nft/Minting";
import NotLoggedIn from "../../components/common/NotLoggedIn";

export default function Profile() {
    const { state, dispatch, update } = useContext(appStore);

    const { near, wallet, account, loading } = state;

    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);
    const signedIn = ((wallet && wallet.signedIn));
    return (

        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >

            { signedIn && <ProfileForm account={account}/> }
            {
                !signedIn && <NotLoggedIn wallet={wallet} />
            }

        </Box>
    )

}