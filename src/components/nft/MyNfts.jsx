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
    Paper
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

export const MyNfts = ({ app, views, update, contractAccount, account, loading, dispatch }) => {
    if (!contractAccount) return null;

    const { tab, sort, filter, nearToUsd } = app;
    const { tokens, sales, allTokens, marketStoragePaid } = views

    let accountId = '';
    if (account) accountId = account.accountId;

    /// market
    const [offerPrice, setOfferPrice] = useState('');
    const [offerToken, setOfferToken] = useState('near');

    /// updating user tokens
    const [price, setPrice] = useState('');
    const [ft, setFT] = useState('near');
    const [saleConditions, setSaleConditions] = useState({});

    useEffect(() => {
        if (!loading) {
            dispatch(loadItems(account))
            dispatch(getMarketStoragePaid(account))
        }
    }, [loading]);

    let market = sales;
    if (tab !== 2 && filter === 1) {
        market = market.concat(allTokens.filter(({ token_id }) => !market.some(({ token_id: t}) => t === token_id)));
    }
    market.sort(sortFunctions[sort]);
    tokens.sort(sortFunctions[sort]);


    return <>


        <Stack direction="row"
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
        </Stack>



        <Grid container spacing={2} >
            {!tokens.length && <p className="margin">No NFTs. Try minting something!</p>}
            {
                tokens.map(({
                                metadata: { media, title },
                                owner_id,
                                token_id,
                                sale_conditions = {},
                                bids = {},
                                royalty = {}
                            }) =>
                    <Grid item key={token_id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <img src={media} onLoad={() => {}} onError={
                                ({target}) => { target.onerror = null;target.src='https://source.unsplash.com/random' }
                            } />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <h4>{title}</h4>
                                {
                                    marketStoragePaid !== '0' ? <>
                                            <h4>Royalties</h4>
                                            {
                                                Object.keys(royalty).length > 0 ?
                                                    Object.entries(royalty).map(([receiver, amount]) => <div key={receiver}>
                                                        {receiver} - {amount / 100}%
                                                    </div>)
                                                    :
                                                    <p>This token has no royalties.</p>
                                            }
                                            {
                                                Object.keys(sale_conditions).length > 0 && <>
                                                    <h4>Price</h4>
                                                    {
                                                        Object.entries(sale_conditions).map(([ft_token_id, price]) => <div className="margin-bottom" key={ft_token_id}>
                                                            {price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]}
                                                            <br/>
                                                            {price === '0' ? "" : (parseFloat(formatNearAmount(price, 4)) * nearToUsd).toFixed(3) } USD
                                                        </div>)
                                                    }
                                                </>
                                            }
                                            {/*{
                                                accountId === owner_id && <>
                                                    <div>
                                                        <h4>Add Sale Conditions</h4>
                                                        <Grid container columns={{ xs: 12 }} spacing={2}>
                                                            <Grid item xs={4}>
                                                                <TextField  variant={"standard"} type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                {
                                                                    getTokenOptions(ft, setFT)
                                                                }
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Button onClick={() => {
                                                                    if (!price.length) {
                                                                        return alert('Enter a price');
                                                                    }
                                                                    const newSaleConditions = {
                                                                        ...saleConditions,
                                                                        [ft]: parseNearAmount(price)
                                                                    }
                                                                    setSaleConditions(newSaleConditions);
                                                                    setPrice('');
                                                                    setFT('near');
                                                                    handleSaleUpdate(account, token_id, newSaleConditions);
                                                                }}>Add</Button>
                                                            </Grid>
                                                        </Grid>



                                                    </div>
                                                    <div>
                                                        <i style={{ fontSize: '0.75rem' }}>Note: price 0 means open offers</i>
                                                    </div>
                                                </>
                                            }*/}
                                            {/*{
                                                        Object.keys(bids).length > 0 && <>
                                                            <h4>Offers</h4>
                                                            {
                                                                Object.entries(bids).map(([ft_token_id, { owner_id, price }]) => <div className="offers" key={ft_token_id}>
                                                                    <div>
                                                                        {price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]}
                                                                    </div>
                                                                    <Button onClick={() => handleAcceptOffer(token_id, ft_token_id)}>Accept</Button>
                                                                </div>)
                                                            }
                                                        </>
                                                    }*/}
                                        </>
                                        :
                                        <div className="center">
                                            <button onClick={() => handleRegisterStorage(account)}>Register with Market to Sell</button>
                                        </div>
                                }
                            </CardContent>
                            <CardActions>
                                <NextLink href={"/token/[id]"} as={`/token/${token_id}`} >Details</NextLink>
                            </CardActions>
                        </Card>
                    </Grid>



                )
            }
        </Grid>


    </>;
};

