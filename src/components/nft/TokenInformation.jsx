import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Paper
} from "@mui/material";
import {getTokenOptions, handleOffer, parseNearAmount, token2symbol} from "../../state/near";
import {handleAcceptOffer, handleSaleUpdate} from "../../state/actions";
import {CurrencySymbol} from "src/components/layout/CurrencySymbol";
import {getMarketStoragePaid, loadItem, loadItems} from '../../state/views';
import * as nearAPI from "near-api-js";
import nearLogo from "src/public/static/img/near-logo.png";
const {
    utils: { format: { formatNearAmount } }
} = nearAPI;

export const TokenInformation = ({ app, views, update, contractAccount, account, loading, dispatch, id }) => {
    if (!contractAccount) return null;
    const {nearToUsd} = app;
    let accountId = '';
    if (account) accountId = account.accountId;
    const { tokens, sales, allTokens } = views
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
    let market = sales.concat(allTokens.filter(({ token_id }) => !sales.some(({ token_id: t}) => t === token_id)));
    let token = market.find(({ token_id }) => id === token_id);
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
            { token && <Container maxWidth="lg">
                <Grid container columns={{ xs: 12 }} spacing={2}>
                    <Grid item xs={6}>
                        <img style={{width: "100%"}} src={token.metadata.media} onLoad={() => {}} onError={
                            ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }
                        } />
                    </Grid>
                    <Grid item xs={6}>

                            <Typography component="div" variant="h5">
                                { token.metadata.title }
                            </Typography>
                            <Typography component="p">
                                {token.owner_id}
                            </Typography>

                            <h4>Royalties</h4>
                            {
                                token.royalty && Object.keys(token.royalty).length > 0 ?
                                    Object.entries(token.royalty).map(([receiver, amount]) => <div key={receiver}>
                                        {receiver} - {amount / 100}%
                                    </div>)
                                    :
                                    <p>This token has no royalties.</p>
                            }



                            {
                                token.sale_conditions ? Object.entries(token.sale_conditions).map(([ft_token_id, price]) => <div className="margin-bottom" key={ft_token_id}>
                                    <h4>Price</h4>
                                    <CurrencySymbol url={nearLogo} />{price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]}
                                    <br/>
                                    {price === '0' ? "" : (parseFloat(formatNearAmount(price, 4)) * nearToUsd).toFixed(3) } USD
                                </div>) : ""
                            }


                            {
                                accountId === token.owner_id && <>
                                    <div>
                                        <h4>Add Price</h4>
                                        <Grid container columns={{ xs: 12 }} spacing={2}>
                                            <Grid item xs={3}>
                                                    <TextField  variant={"standard"} type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                            </Grid>
                                            <Grid item xs={2}>
                                                    {
                                                        getTokenOptions(ft, setFT)
                                                    }
                                            </Grid>
                                            <Grid item xs={2}>
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
                                                        handleSaleUpdate(account, token.token_id, newSaleConditions);
                                                    }}>Add</Button>
                                            </Grid>
                                        </Grid>



                                    </div>
                                    <div>
                                        <i style={{ fontSize: '0.75rem' }}>Note: price 0 means open offers</i>
                                    </div>
                                </>
                            }
                            {
                                accountId.length > 0 && accountId !== token.owner_id && <div>
                                    <h4>Add Offer</h4>
                                    <Grid container columns={{ xs: 12 }} spacing={2}>
                                        <Grid item xs={4}>
                                            <TextField variant={"standard"} placeholder="Price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            {
                                                getTokenOptions(offerToken, setOfferToken, Object.keys(token.sale_conditions))
                                            }
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button  onClick={() => handleOffer(account, token.token_id, offerToken, offerPrice)}>Offer</Button>
                                        </Grid>

                                    </Grid>
                                </div>
                            }

                            {
                                token.bids && Object.keys(token.bids).length > 0 && <>
                                    <h4>Offers</h4>
                                    {
                                        Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
                                            <p>
                                                {price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]} by {bid_owner_id}
                                                <br/>
                                                {price === '0' ? "" : (parseFloat(formatNearAmount(price, 4)) * nearToUsd).toFixed(3) } USD
                                            </p>
                                            {
                                                accountId === token.owner_id &&
                                                <Button variant={"contained"} onClick={() => handleAcceptOffer(account, token.token_id, ft_token_id)}>Accept</Button>
                                            }
                                        </div>) )
                                    }
                                </>
                            }

                            <h4>Description</h4>
                            <p>
                                {token.metadata.description}
                            </p>
                    </Grid>


                </Grid>
            </Container> }
        </Box>

    );
}