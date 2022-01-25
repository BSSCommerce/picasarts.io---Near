import React, { useEffect } from 'react';
import * as nearAPI from 'near-api-js';
import {
    formatAccountId,
} from 'src/utils/near-utils';
import { getMarketStoragePaid, loadItems } from 'src/state/views';
import {Grid, CardContent, Typography, CardActions, Card, CardHeader, Avatar} from "@mui/material";
const {
    utils: { format: { formatNearAmount } }
} = nearAPI;
import NextLink from 'next/link';

export const Sales = ({ app, views, loading, contractAccount, account, dispatch }) => {
    if (!contractAccount) return null;
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
                        }) =>
                    <Grid item key={token_id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            {/*<img style={{width: "100%"}} src={media} onLoad={() => {}} onError={*/}
                            {/*    ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }*/}
                            {/*} />*/}
                            {/*<CardContent sx={{ flexGrow: 1 }}>*/}
                            {/*    <Typography gutterBottom variant="h5" component="h2">*/}
                            {/*        { title }*/}
                            {/*    </Typography>*/}
                            {/*    <Typography>*/}
                            {/*        {accountId !== owner_id ? `Owned by ${formatAccountId(owner_id)}` : `You own this!`}*/}
                            {/*    </Typography>*/}
                            {/*</CardContent>*/}
                            {/*<CardActions disableSpacing={}>*/}
                            {/*    <NextLink href={"/token/[id]"} as={`/token/${token_id}`} >Buy Now</NextLink>*/}
                            {/*</CardActions>*/}

                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: "white" }} aria-label="recipe">
                                        <img style={{width: "100%"}} src={media} onLoad={() => {}} onError={
                                            ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }
                                        } />
                                    </Avatar>
                                }
                                title={title}
                                subheader={accountId !== owner_id ? `Owned by ${formatAccountId(owner_id)}` : `You own this!`}
                            />
                            <img style={{width: "100%"}} src={media} onLoad={() => {}} onError={
                                ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }
                            } />
                            <CardActions disableSpacing>
                                <NextLink href={"/token/[id]"} as={`/token/${token_id}`} >Buy Now</NextLink>
                            </CardActions>
                        </Card>



                    </Grid>
                )
        }
    </Grid>
};

