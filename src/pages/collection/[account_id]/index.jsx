import Box from "@mui/material/Box";
import React, {useContext, useEffect} from "react";
import ProfileBanner from "src/components/account/ProfileBanner";
import {appStore, onAppMount} from "src/state/app";
import {MyNfts} from "src/components/nft/MyNfts";
import Container from "@mui/material/Container";

export default function Index({account_id}) {
    const { state, dispatch, update } = useContext(appStore);

    const { app, views, contractAccount, loading } = state;
    let account = {
        accountId: account_id
    }
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);
    return (
        <Box
            className={"picasart-dashboard"}
            sx={{
                bgcolor: 'background.paper',
            }}
        >
            <ProfileBanner account={account}/>
            <Container sx={{ py: 8 }} maxWidth="lg">
                <MyNfts {...{ app, views, update, loading, contractAccount, account, dispatch }} />
            </Container> }
        </Box>
    )
}

Index.getInitialProps = async ({query}) => {
    return {
        account_id: query.account_id
    }
}

