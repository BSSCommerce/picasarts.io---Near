import {Grid} from "@mui/material";
import NftToken from "./NftToken";
import React from "react";

export default function RelatedNFT({relatedTokens, nearToUsd}) {
    return <Grid container spacing={2}>

        {
            relatedTokens.map(({
                           metadata: { media, title },
                           owner_id,
                           token_id,
                           sale_conditions = {},
                           bids = {},
                           royalty = {}
                       }) => <NftToken media={media}
                                       title={title}
                                       owner_id={owner_id}
                                       token_id={token_id}
                                       sale_conditions={sale_conditions}
                                       bids={bids}
                                       royalty={royalty}
                                       nearToUsd={nearToUsd}
                />

            )
        }
    </Grid>
}