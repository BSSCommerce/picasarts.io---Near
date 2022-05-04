import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { appStore, onAppMount } from "src/state/app";
import { loadFungibleTokens, loadNumberTokens } from "src/state/views";
import { Add, List } from "@mui/icons-material";
import NextLink from 'next/link';
import TableFTs from "src/components/common/TableFTs";

export default function Index() {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const { state, dispatch } = useContext(appStore);
    const [data, setData] = useState([]);
    const { contractAccount } = state;
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
        if (contractAccount) {
            loadNumberTokens(contractAccount)
                .then(tokensLength => loadFungibleTokens(contractAccount, 0, tokensLength))
                .then(newData => {
                    setData(newData.map(item => item[1]));
                });
        }
    }, [contractAccount]);

    return (
        <Container className={"picasart-dashboard"} sx={{ py: 8, bgcolor: 'background.paper', }} maxWidth="xl">
            <NextLink href={"/factory/my-tokens"} as={"/factory"}>
                <Button variant="outlined" sx={{ my: 2 }} startIcon={<List />}>
                    View my tokens
                </Button>
            </NextLink>
            <NextLink href={"/factory/create"} as={"/factory/create"}>
                <Button variant="contained" sx={{ my: 2, ml: 1 }} startIcon={<Add />}>
                    Create new token
                </Button>
            </NextLink>
            <TableFTs data={data} />
        </Container>
    )
}
