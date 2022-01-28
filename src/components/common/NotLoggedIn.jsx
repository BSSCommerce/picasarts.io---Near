import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Router from "next/router";
import {Wallet} from "../nft/Wallet";
import Container from "@mui/material/Container";
import React from "react";

export default function NotLoggedIn({wallet}) {
    return (
        <Container maxWidth="md">
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
                Please connect wallet to create your own NFT
            </Typography>
            <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
            >
                <Button variant="contained" onClick={() => Router.push("/")}>Explore</Button>
                <Wallet {...{ wallet }} />
            </Stack>
        </Container>
    )
}