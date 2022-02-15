import React, { useEffect } from 'react';
import { getMarketStoragePaid, loadItems } from 'src/state/views';
import {Grid, Skeleton} from "@mui/material";
import NftToken from "./NftToken";
export const Sales = ({ app, views, loading, contractAccount, account, dispatch, numberOfTokens }) => {
    if (!contractAccount) return null;
    const { nearToUsd } = app;
    const { sales, allTokens, isLoadingTokens } = views
    let latestSales = sales.slice(0, (sales.length > numberOfTokens && numberOfTokens !== 0) ? numberOfTokens : sales.length);
    useEffect(() => {
        if (!loading) {
            dispatch(loadItems())
        }
    }, [loading]);
    return <Grid container spacing={2}>
        {
            isLoadingTokens && [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                return <Grid item key={`skeleton-${i}`} xs={6} sm={4} md={3}>
                    <Skeleton variant="rectangular" height={118}/>
                    <Skeleton/>
                    <Skeleton width="60%"/>
                </Grid>
            })

        }
        {
            (!latestSales.length && !isLoadingTokens) && <>No NFT found</>
        }
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

