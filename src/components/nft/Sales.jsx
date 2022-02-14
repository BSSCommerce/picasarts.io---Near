import React, { useEffect } from 'react';
import { getMarketStoragePaid, loadItems } from 'src/state/views';
import {Grid} from "@mui/material";
import NftToken from "./NftToken";

export const Sales = ({ app, views, loading, contractAccount, account, dispatch, numberOfTokens }) => {
    if (!contractAccount) return null;
    const { nearToUsd } = app;
    const { sales, allTokens } = views
    let latestSales = sales.slice(0, (sales.length > numberOfTokens && numberOfTokens !== 0) ? numberOfTokens : sales.length);
    useEffect(() => {
        if (!loading) {
            dispatch(loadItems())
        }
    }, [loading]);
    return <Grid container spacing={2}>

        {
            latestSales.map(({
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
};

