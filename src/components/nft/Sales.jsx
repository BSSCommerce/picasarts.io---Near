import React, { useEffect } from 'react';
import { getMarketStoragePaid, loadItems } from 'src/state/views';
import {Grid} from "@mui/material";
import NftToken from "./NftToken";

export const Sales = ({ app, views, loading, contractAccount, account, dispatch }) => {
    if (!contractAccount) return null;
    const { nearToUsd } = app;
    const { sales, allTokens } = views
    let accountId = '';
    if (account) accountId = account.accountId;
    let market = sales;
    market = market.concat(allTokens.filter(({ token_id }) => !market.some(({ token_id: t}) => t === token_id)));
    useEffect(() => {
        if (!loading) {
            dispatch(loadItems(account))
            dispatch(getMarketStoragePaid(account))
        }
    }, [loading]);
    return <Grid container spacing={2}>

        {
            sales.map(({
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

