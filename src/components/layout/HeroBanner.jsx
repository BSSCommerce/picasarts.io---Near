import backgroundImage from "src/public/static/img/bg_4.png";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Router from "next/router";
import Box from "@mui/material/Box";
import * as React from "react";

export default function HeroBanner() {
    return (
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
                    <Button variant={"contained"} onClick={() => Router.push("/all-nfts")}>Explore</Button>
                    <Button variant="contained"  onClick={() => Router.push("/create")}>Create</Button>
                </Stack>
            </Container>
        </Box>
    )
}