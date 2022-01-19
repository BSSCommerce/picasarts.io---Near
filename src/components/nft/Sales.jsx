import React, { useEffect } from 'react';
import * as nearAPI from 'near-api-js';
import { parseNearAmount } from '../../state/near';
import {
    formatAccountId,
} from '../../utils/near-utils';
import { getMarketStoragePaid, loadItems } from '../../state/views';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
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
    return <>

        {
            sales.map(({
                            metadata: { media, title },
                            owner_id,
                            token_id,
                            sale_conditions = {},
                            bids = {},
                            royalty = {}
                        }) =>
                <div key={token_id} className="item">
                    {/*<img src={media} onClick={() => history.pushState({}, '', window.location.pathname + '?t=' + token_id)} />*/}
                    <Grid item key={token_id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardMedia
                                onClick={() => {} }
                                component="img"
                                sx={{
                                    // 16:9
                                    pt: '56.25%',
                                }}
                                image="https://source.unsplash.com/random"
                                alt="random"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    { title }
                                </Typography>
                                <Typography>
                                    {accountId !== owner_id ? `Owned by ${formatAccountId(owner_id)}` : `You own this!`}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <NextLink href={"/token/[id]"} as={`/token/${token_id}`} >Buy Now</NextLink>
                            </CardActions>
                        </Card>
                    </Grid>
                </div>)
        }



    </>;
};

