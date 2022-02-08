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
import {CurrencySymbol} from "../layout/CurrencySymbol";
import nearLogo from "../../public/static/img/near-logo.png";
import {token2symbol} from "../../state/near";

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
                        }) =>
                    <Grid item key={token_id} xs={6} sm={4} md={3}>
                        <Card
                            className={"nft-card"}
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div className={"nft-image"}>
                                <img  key={`${token_id}_card_main_media`}  src={media} onLoad={() => {}} onError={
                                    ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }
                                } />
                            </div>

                            <CardHeader
                                sx={{ paddingBottom: "0"}}
                                key={`${token_id}_card_header`}
                                title={<span className={"nft-title"}>{title}</span>}
                                subheader={accountId !== owner_id ? <strong>by <span className={"nft-author-name"}>{formatAccountId(owner_id)}</span></strong> : `You own this!`}
                            />
                            <CardContent key={`${token_id}_card_main_content`}>
                                <Typography gutterBottom component="div">
                                    Price
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {
                                        Object.entries(sale_conditions).map(([ft_token_id, price]) => <div className="nft-price" key={ft_token_id}>
                                            <span>{price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}</span>
                                            <span>|</span>
                                            <span>{price === '0' ? "" : (parseFloat(formatNearAmount(price, 4)) * nearToUsd).toFixed(3) } USD</span>
                                        </div>)
                                    }
                                </Typography>
                                <div className={"nft-card-actions"}>
                                    <NextLink  key={`${token_id}_card_actions_link`} href={"/token/[id]"} as={`/token/${token_id}`} >See Details</NextLink>
                                </div>

                            </CardContent>

                        </Card>
                    </Grid>
                )
        }
    </Grid>
};

