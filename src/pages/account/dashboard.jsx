import Box from "@mui/material/Box";
import React, {useContext, useEffect} from "react";
import ProfileBanner from "src/components/account/ProfileBanner";
import {appStore, onAppMount} from "../../state/app";
import {MyNfts} from "../../components/nft/MyNfts";
import Container from "@mui/material/Container";

export default function Dashboard() {
    const { state, dispatch, update } = useContext(appStore);

    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;

    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);
    const signedIn = ((wallet && wallet.signedIn));
    return (
        <Box
            className={"picasart-dashboard"}
            sx={{
                bgcolor: 'background.paper',
            }}
        >

            { signedIn && <ProfileBanner account={account}/> }
            { signedIn && <Container sx={{ py: 8 }} maxWidth="lg">
                             <MyNfts {...{ app, views, update, loading, contractAccount, account, dispatch }} />
                </Container> }
        </Box>
    )
}