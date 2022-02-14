import Box from "@mui/material/Box";
import React, {useContext, useEffect} from "react";
import ProfileBanner from "src/components/account/ProfileBanner";
import {appStore, onAppMount} from "src/state/app";
import {MyNfts} from "src/components/nft/MyNfts";
import Container from "@mui/material/Container";

export default function Index({ownerId}) {
    const { state, dispatch, update } = useContext(appStore);

    const { app, views, contractAccount, loading, account } = state;
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
            <ProfileBanner account={ownerId}/>
            <Container sx={{ py: 8 }} maxWidth="lg">
                <MyNfts {...{ app, views, update, loading, contractAccount, account, dispatch, ownerId }} />
            </Container> }
        </Box>
    )
}

Index.getInitialProps = async ({query}) => {
    return {
        ownerId: query.owner_id
    }
}

