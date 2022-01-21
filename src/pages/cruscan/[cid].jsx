import React, { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot, crustTypes } from '@crustio/type-definitions';
import { useState, useEffect, useCallback } from "react";
import Router from "next/router";
import DataList from "src/components/cruscan/DataList";
import Box from "@mui/material/Box";
import {Button, Container, Grid, TextField} from "@mui/material";

// Create global chain instance
const crustChainEndpoint = 'wss://rpc.crust.network';
const api = new ApiPromise({
    provider: new WsProvider(crustChainEndpoint),
    typesBundle: typesBundleForPolkadot,
});
export default function CrustScanCid() {
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [fileData, setFileData] = useState(null);
    const [currentCid, setCurrentCid] = useState("")
    async function fetchData(cid) {
        try {
            await api.isReadyOrError;
            let fileDataReq = await api.query.market.files(cid);
            let fileDataRes = JSON.parse(fileDataReq);
            setFileData(fileDataRes);
            console.log("fileDataReq", fileDataRes);
        } catch (e) {
            console.log("Could not fetch file data", e);
        }
    }
    useEffect(() => {
        if (isFirstLoading) {
            setIsFirstLoading(false)
            let cid = Router.query.cid;
            setCurrentCid(cid);
            fetchData(cid);
        }
    }, [isFirstLoading])

    const handleSearch = useCallback(() => {
        fetchData(currentCid);
    }, [])

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
                        <Button variant={"contained"} onClick={handleSearch}>Search</Button>
                    </Grid>
                </Grid>
                <br/>
                <DataList cid={currentCid} fileData={fileData} />
            </Container>
        </Box>

    )
}