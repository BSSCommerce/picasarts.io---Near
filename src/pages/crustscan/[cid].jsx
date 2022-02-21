import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot, crustTypes } from '@crustio/type-definitions';
import React, { useState, useEffect, useCallback } from "react";
import Router from "next/router";
import DataList from "src/components/crustscan/DataList";
import Box from "@mui/material/Box";
import {Button, CircularProgress, Container, Grid, TextField} from "@mui/material";


export default function CrustScanCid({cid, crustApi}) {
    // Create global chain instance
    const crustRpcChainEndpoint = 'wss://rpc.crust.network';
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [fileData, setFileData] = useState(null);
    const [currentCid, setCurrentCid] = useState(cid)
    const [isLoadingData, setIsLoadingData] = useState(false);
    async function fetchData(cid) {
        setIsLoadingData(true);
        try {

            const crustApi = new ApiPromise({
                provider: new WsProvider(crustRpcChainEndpoint),
                typesBundle: typesBundleForPolkadot,
            });
            await crustApi.isReadyOrError;
            let fileDataReq = await crustApi.query.market.files(cid);
            let fileDataRes = JSON.parse(fileDataReq);
            setFileData(fileDataRes);
            console.log("fileDataRes", fileDataRes);
        } catch (e) {
            console.log("Could not fetch file data", e);
        }
        setIsLoadingData(false);
    }
    useEffect(() => {
        if (isFirstLoading) {
            setIsFirstLoading(false)
            setCurrentCid(cid);
            fetchData(cid);
        }
    }, [isFirstLoading, currentCid])

    const handleSearch = useCallback(() => {
        fetchData(currentCid);
    }, [currentCid])

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <TextField style={{width: "100%"}} variant={"standard"} placeholder={"CID"} value={currentCid} onChange={(e) => setCurrentCid(e.target.value)} />
                    </Grid>
                    <Grid item xs={3}>
                        <Button disabled={isLoadingData} variant={"contained"} onClick={handleSearch}>
                            {isLoadingData && <CircularProgress size={14} />}
                            {!isLoadingData && 'Search'}
                        </Button>
                    </Grid>
                </Grid>
                <br/>
                { !isLoadingData && <DataList cid={currentCid} fileData={fileData} /> }
                {isLoadingData && <CircularProgress size={42} title={"Loading Data"} />}
            </Container>
        </Box>

    )
}

CrustScanCid.getInitialProps = async (ctx) => {
    const {cid} = ctx.query;
    return {
        cid: cid,
    }
}