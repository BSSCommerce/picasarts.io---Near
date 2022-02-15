import React, { useEffect, useState } from 'react';
import * as nearAPI from 'near-api-js';
import { parseNearAmount, token2symbol, getTokenOptions, handleOffer } from 'src/state/near';

import { getMarketStoragePaid, loadItems } from 'src/state/views';
import { handleAcceptOffer, handleRegisterStorage, handleSaleUpdate } from 'src/state/actions';
import {
    Card,
    CardContent,
    Button,
    Typography,
    CardActions,
    Grid,
    TextField,
    Stack,
    Paper, CardHeader,
    Box,
    Skeleton
} from "@mui/material"
import { styled } from '@mui/material/styles';
import {formatAccountId} from "../../utils/near-utils";
import NextLink from "next/link";

const {
    utils: { format: { formatNearAmount } }
} = nearAPI;


const n2f = (amount) => parseFloat(parseNearAmount(amount, 8));

const sortFunctions = {
    1: (a, b) => parseInt(a.metadata.issued_at || '0') - parseInt(b.metadata.issued_at || '0'),
    2: (b, a) => parseInt(a.metadata.issued_at || '0') - parseInt(b.metadata.issued_at || '0'),
    3: (a, b) => n2f(a.sale_conditions?.near || '0') - n2f(b.sale_conditions?.near || '0'),
    4: (b, a) => n2f(a.sale_conditions?.near || '0') - n2f(b.sale_conditions?.near || '0'),
};

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const MyNfts = ({ app, views, update, contractAccount, account, loading, dispatch, ownerId }) => {
    if (!contractAccount) return null;

    const { tab, sort, filter, nearToUsd } = app;
    const { tokens, sales, allTokens, marketStoragePaid, isLoadingTokens } = views

    let accountId = '';
    if (account) accountId = account.accountId;
    useEffect(() => {
        if (!loading) {
            dispatch(loadItems({accountId: ownerId}))
            dispatch(getMarketStoragePaid({accountId: ownerId}))
        }
    }, [loading]);

    let market = sales;
    if (tab !== 2 && filter === 1) {
        market = market.concat(allTokens.filter(({ token_id }) => !market.some(({ token_id: t}) => t === token_id)));
    }
    market.sort(sortFunctions[sort]);
    tokens.sort(sortFunctions[sort]);

    return <>


        {/*<Stack direction="row"
               spacing={2}
               justifyContent="center"
               alignItems="center">
            <Item>
                {
                    tab !== 2 && <Button onClick={() => update('app.filter', filter === 2 ? 1 : 2)} style={{background: '#fed'}}>{filter === 1 ? 'All' : 'Sales'}</Button>
                }
            </Item>
            <Item>
                <Button onClick={() => update('app.sort', sort === 2 ? 1 : 2)} style={{ background: sort === 1 || sort === 2 ? '#fed' : ''}}>Date {sort === 1 && '⬆️'}{sort === 2 && '⬇️'}
                </Button>
            </Item>
            <Item>
                {
                    tab !== 2 && <Button onClick={() => update('app.sort', sort === 4 ? 3 : 4)} style={{ background: sort === 3 || sort === 4 ? '#fed' : ''}}>Price {sort === 3 && '⬆️'}{sort === 4 && '⬇️'}</Button>
                }
            </Item>
        </Stack>*/}



        <Grid container spacing={2} >
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
                (!tokens.length && !isLoadingTokens) && <>No NFT found</>
            }
            {
                tokens.map(({
                                metadata: { media, title },
                                owner_id,
                                token_id,
                                sale_conditions = {},
                                bids = {},
                                royalty = {}
                            }) =>
                    <Grid item key={token_id} xs={6} sm={4} md={3}>
                        <Card className={"nft-card"} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

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
                                <Typography variant="body2" color="text.secondary">

                                    {
                                        marketStoragePaid !== '0' ? <div className={"nft-card-royalty-price"}>
                                                {
                                                    Object.entries(sale_conditions).length > 0 ?  <Typography component="p">
                                                        Price
                                                    </Typography> : <p></p>
                                                }

                                                {
                                                    Object.entries(sale_conditions).map(([ft_token_id, price]) => <p className="nft-price" key={ft_token_id}>
                                                        <span>{price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}</span>
                                                        <span>|</span>
                                                        <span>{price === '0' ? "" : (parseFloat(formatNearAmount(price, 4)) * nearToUsd).toFixed(3) } USD</span>
                                                    </p>)
                                                }
                                                <Typography component="p">
                                                    Royalties
                                                </Typography>
                                                {
                                                    Object.keys(royalty).length > 0 ?
                                                        Object.entries(royalty).map(([receiver, amount]) => <p key={receiver}>
                                                            {receiver} - {amount / 100}%
                                                        </p>)
                                                        :
                                                        <p>This token has no royalties.</p>
                                                }

                                            </div>
                                            :
                                            <div className="center">
                                                <Button variant={"text"} onClick={() => handleRegisterStorage(account)}>Register with Market to Sell</Button>
                                            </div>
                                    }
                                </Typography>
                                <div className={"nft-card-actions"}>
                                    <NextLink href={"/token/[id]"} as={`/token/${token_id}`} >See Details</NextLink>
                                    <span> | </span>
                                    <NextLink href={"/crustscan/[cid]"} as={`/crustscan/${media.replace("https://crustwebsites.net/ipfs/", "")}`}>Scan</NextLink>
                                </div>

                            </CardContent>
                        </Card>
                    </Grid>
                )
            }
        </Grid>


    </>;
};

