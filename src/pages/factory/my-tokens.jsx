import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { appStore, onAppMount } from "src/state/app";
import { Add, List } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";
import { loadFungibleToken } from "src/state/views";
import NextLink from 'next/link';
import TableFTs from "src/components/common/TableFTs";

export default function MyTokens() {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const { state, dispatch } = useContext(appStore);
    const [data, setData] = useState([]);

    const { account, contractAccount } = state;

    const onMount = () => {
        dispatch(onAppMount());
    }; 
    useEffect(() => {
        if (isFirstLoading) {
            setIsFirstLoading(false);
            onMount()
        }

    }, [isFirstLoading]);


    useEffect(() => {
        if (account && contractAccount) {
            fetch(`/api/tokens?accountId=${account.accountId}`)
            .then(res=> res.json())
            .then(tokens => {
                let promises = [];
                tokens.forEach(item => {
                    const tokenData = contractAccount.viewFunction(item, 'ft_metadata');
                    promises.push(tokenData);
                });
                Promise.all(promises).then(values => {
                    setData(values.map(item => ({metadata: item})))
                });
            });
        }

    }, [account, contractAccount]);
    
    if (!account) return <p>Please connect your NEAR Wallet</p>;

    if (!data) return <Skeleton />

    return (
        <Container className={"picasart-dashboard"} sx={{ py: 8, bgcolor: 'background.paper', }} maxWidth="xl">
            <NextLink href={"/factory/my-tokens"} as={"/factory"}>
                <Button variant="contained" sx={{ my: 2 }} startIcon={<List />}>
                    View my tokens
                </Button>
            </NextLink>
            <NextLink href={"/factory/create"} as={"/factory/create"}>
                <Button variant="outlined" sx={{ my: 2, ml: 1 }} startIcon={<Add />}>
                    Create new token
                </Button>
            </NextLink>
            <TableFTs data={data} />
        </Container>
    )
}
