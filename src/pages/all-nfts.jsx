import * as React from 'react';
import Container from '@mui/material/Container';
import { appStore, onAppMount} from '../state/app';
import {useContext, useEffect, useState} from "react";
import { Sales } from "../components/nft/Sales";
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

            <Container sx={{ py: 8 }} maxWidth="lg">
                <Sales {...{ app, views, update, loading, contractAccount, account, dispatch, numberOfTokens: 1000  }} />
            </Container>

    );
}
