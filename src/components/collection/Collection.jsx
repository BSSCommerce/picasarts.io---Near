import {Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import React from "react";
import NextLink from "next/link";
import {formatAccountId} from "../../utils/near-utils";

export default function Collection({collection}) {
    return (
        <Grid item key={collection.account_id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => {}}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "white" }} aria-label="recipe">
                            <img src={collection.logo} onLoad={() => {}} onError={
                                ({target}) => { target.onerror = null;target.src='https://source.unsplash.com/random' }
                            } />
                        </Avatar>
                    }
                    title={collection.collection_name ? collection.collection_name : collection.account_id }
                    subheader={<strong>by <NextLink key={`${collection.account_id}_collection_link`} href={"/collection/[account_id]"} as={`/collection/${collection.account_id}`} className={"nft-author-name"}>{collection.account_id}</NextLink></strong>}
                />
            </Card>

        </Grid>
    )
}