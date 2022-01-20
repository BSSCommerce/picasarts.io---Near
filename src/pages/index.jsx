import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { appStore, onAppMount} from '../state/app';
import {useContext, useEffect} from "react";
import { Sales } from "../components/nft/Sales";

export default function Index() {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const { dispatch, state, update } = useContext(appStore);
    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect( () => {
        onMount()
    }, []);
    return (
        <>
            {/* Hero unit */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                }}
            >
                <Container maxWidth="sm">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Discover, collect, and sell extraordinary NFTs
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>
                        Picasarts is the world's first and largest NFT marketplace
                    </Typography>
                    <Stack
                        sx={{ pt: 4 }}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button variant="contained">Explore</Button>
                        <Button variant="outlined">Create</Button>
                    </Stack>
                </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="lg">
                <Sales {...{ app, views, update, loading, contractAccount, account, dispatch }} />
            </Container>
        </>
    );
}
