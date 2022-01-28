import * as React from 'react';
import Container from '@mui/material/Container';
import { appStore, onAppMount} from '../state/app';
import {useContext, useEffect} from "react";
import { MyNfts } from "src/components/nft/MyNfts";

export default function MyCollectives() {
    const { dispatch, state, update } = useContext(appStore);
    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect( () => {
        onMount()
    }, []);
    return (

            <Container sx={{ py: 8 }} maxWidth="lg">
                <MyNfts {...{ app, views, update, loading, contractAccount, account, dispatch }} />
            </Container>

    );
}
