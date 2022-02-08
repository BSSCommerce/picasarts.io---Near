import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { appStore, onAppMount} from '../state/app';
import {useContext, useEffect, useState} from "react";
import { Sales } from "../components/nft/Sales";
import Router from "next/router";
import backgroundImage from "../public/static/img/bg_4.png";
export default function Index() {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const { dispatch, state, update } = useContext(appStore);
    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect( () => {
        if (isFirstLoading) {
            setIsFirstLoading(false);
            onMount()
        }

    }, [isFirstLoading]);
    return (
        <>
            {/* Hero unit */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                    backgroundImage:`url(${backgroundImage.src})`
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="white"
                        gutterBottom
                    >
                        Discover, collect, and sell extraordinary NFTs
                    </Typography>
                    <Typography variant="h5" align="center" color="white" paragraph>
                        NFT marketplace for everyone
                    </Typography>
                    <Stack
                        sx={{ pt: 4 }}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button variant={"contained"} onClick={() => Router.push("/")}>Explore</Button>
                        <Button variant="contained"  onClick={() => Router.push("/create")}>Create</Button>
                    </Stack>
                </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="lg" style={{paddingTop: "0", marginTop:"-40px"}}>
                <Sales {...{ app, views, update, loading, contractAccount, account, dispatch }} />
            </Container>
        </>
    );
}
