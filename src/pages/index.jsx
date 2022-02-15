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
import LatestCollections from "../components/collection/LatestCollections";
import HeroBanner from "../components/layout/HeroBanner";
export default function Index() {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const { dispatch, state, update } = useContext(appStore);
    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
    const { isLoadingTokens } = views;
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
            <HeroBanner />
            <Container sx={{ py: 8 }} maxWidth="lg" style={{paddingTop: "0", marginTop:"-40px"}}>
                <Sales {...{ app, views, update, loading, contractAccount, account, dispatch, numberOfTokens: 8  }} />
            </Container>
            <Container sx={{ py: 8 }} maxWidth="lg" style={{paddingTop: "0", marginTop:"-40px"}}>
                {
                    !isLoadingTokens && <LatestCollections/>
                }
            </Container>
        </>
    );
}
