import React, {useCallback, useEffect, useState} from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Paper,
    Alert,
    Select,
    MenuItem
} from "@mui/material";
import {getTokenOptions, handleOffer, parseNearAmount, token2symbol, handleBuyNow} from "../../state/near";
import {handleAcceptOffer, handleRegisterStorage, handleSaleUpdate} from "../../state/actions";
import {getMarketStoragePaid, loadItem, loadItems} from '../../state/views';
import * as nearAPI from "near-api-js";
import NextLink from "next/link";
import RelatedNFT from "./RelatedNFT";
const {
    utils: { format: { formatNearAmount } }
} = nearAPI;

export const TokenInformation = ({ app, views, update, contractAccount, account, loading, dispatch, id, viewCount }) => {

    if (!contractAccount) return null;
    const {nearToUsd} = app;
    let accountId = '';
    if (account) accountId = account.accountId;
    const { tokens, sales, allTokens, marketStoragePaid } = views
    /// market
    const [offerPrice, setOfferPrice] = useState('');
    const [offerToken, setOfferToken] = useState('near');
    const [addOfferErrorMessage, setAddOfferErrorMessage] = useState('');
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
    const [isAuction, setIsAuction] = useState("1");
    let relatedTokens = sales.filter((t) => t.owner_id == token.owner_id);
    const handleAddOffer = useCallback(async (account, token_id, offerToken, offerPrice) => {
        let result = await handleOffer(account, token_id, offerToken, offerPrice)
        if (result) {
            setAddOfferErrorMessage(result);
        }
    }, [addOfferErrorMessage])
    // useEffect(() => {
    //     if (!loading && token) {
    //        if (token.is_auction) {
    //            setIsAuction("1")
    //        } else {
    //            setIsAuction("0")
    //        }
    //     }
    // }, [loading,token, isAuction])
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
            { token && <Container maxWidth="lg">
                <Grid container className={"token-information"} columns={{ xs: 12 }} spacing={2}>
                    <Grid item xs={6} className={"token-image-wrapper"}>
                        <img style={{width: "100%"}} src={token.metadata.media} onLoad={() => {}} onError={
                            ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }
                        } />

                    </Grid>
                    <Grid item xs={6} className={"token-information-main"}>
                        <div className={"section header"}>
                            <Typography component="div" variant="h4">
                                <strong>{ token.metadata.title }</strong>
                            </Typography>
                            <Typography component="p">
                                 By <strong> <span className={"nft-author-name"}>{token.owner_id}</span></strong>
                            </Typography>
                        </div>
                        {
                            token.sale_conditions ? Object.entries(token.sale_conditions).map(([ft_token_id, price]) => <div  className={"section sale"} key={ft_token_id}>
                                <p className="section-title">Price</p>
                                <p className="nft-price" >
                                    <span>{price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}</span>
                                    <span>|</span>
                                    <span>{price === '0' ? "" : (parseFloat(formatNearAmount(price, 4)) * nearToUsd).toFixed(3) } USD</span>
                                </p>

                            </div>) : ""
                        }
                        <div className={"section description"}>
                            <p className="section-title">Description</p>
                            <p>
                                {token.metadata.description}
                            </p>
                        </div>
                        <Grid container columns={{ xs: 12 }} spacing={2}>
                            <Grid item xs={6}>
                                <div className={"section royalties"}>
                                    <p className="section-title">Royalties</p>
                                    {
                                        token.royalty && Object.keys(token.royalty).length > 0 ?
                                            Object.entries(token.royalty).map(([receiver, amount]) => <div key={receiver}>
                                                {receiver} - {amount / 100}%
                                            </div>)
                                            :
                                            <p>No royalties.</p>
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className={"section page_view"}>
                                    <p className="section-title">Views</p>
                                    <p>{ viewCount }</p>
                                </div>
                            </Grid>
                        </Grid>




                        {
                            accountId === token.owner_id &&  ( marketStoragePaid !== '0' ? <div className={"section add-price"}>
                                <div>
                                    <p className="section-title">Add Price</p>
                                    <Grid container columns={{ xs: 12 }} spacing={2} style={{display: "flex"}}>
                                        <Grid item xs={3}>
                                            <TextField  variant={"standard"} type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={2}>
                                            {
                                                getTokenOptions(ft, setFT)
                                            }
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={isAuction}
                                                label="Age"
                                                onChange={(e) => setIsAuction(e.target.value)}
                                                variant={"standard"}
                                            >
                                                <MenuItem value={"1"}>Enable Auction</MenuItem>
                                                <MenuItem value={"0"}>Disable Auction</MenuItem>
                                            </Select>
                                        </Grid>

                                        <Grid item xs={2}>
                                            <Button variant={"contained"} onClick={() => {
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
                                                handleSaleUpdate(account, token.token_id, newSaleConditions, isAuction);
                                            }}>Add</Button>
                                        </Grid>
                                    </Grid>



                                </div>
                                <div>
                                    <i style={{ fontSize: '0.75rem' }}>Note: price 0 means open offers</i>
                                </div>
                            </div> : <div className="section">
                                <Button variant={"text"} onClick={() => handleRegisterStorage(account)}>Register with Market to Sell</Button>
                            </div>)
                        }
                        {
                            accountId.length > 0 && accountId !== token.owner_id && token.is_auction && <div className={"section add-offers"}>
                                <p className="section-title">Add Offer</p>
                                <Grid container columns={{ xs: 12 }} spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField variant={"standard"} placeholder="Price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        {
                                            getTokenOptions(offerToken, setOfferToken, Object.keys(token.sale_conditions))
                                        }
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button variant={"contained"} onClick={() => handleAddOffer(account, token.token_id, offerToken, offerPrice)}>Offer</Button>
                                    </Grid>

                                </Grid>

                                { addOfferErrorMessage && <> <br/><Alert severity={"error"}>{addOfferErrorMessage}</Alert></> }
                            </div>
                        }

                        {
                            token.bids && Object.keys(token.bids).length > 0 && token.is_auction && <div className={"section bids"}>
                                <p className="section-title">Offers</p>
                                {
                                    Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
                                        <p className="nft-price" >
                                            <span>{price === '0' ? 'open' : formatNearAmount(price, 4)} {token2symbol[ft_token_id]}</span>
                                            <span> | </span>
                                            <span>{price === '0' ? "" : (parseFloat(formatNearAmount(price, 4)) * nearToUsd).toFixed(3) } USD</span>
                                            <span> | </span>
                                            <span>by <strong>{bid_owner_id}</strong></span>
                                            <span> | </span>
                                            <span>{accountId === token.owner_id && <Button variant={"contained"} onClick={() => handleAcceptOffer(account, token.token_id, ft_token_id)}>Accept</Button>}</span>
                                        </p>

                                    </div>) )
                                }
                            </div>
                        }

                        <div className={"section token-info"}>
                            <p className="section-title">Token info</p>
                            <div className={"token-info-item"}>
                                <span>
                                    Smart Contract
                                </span>
                                <span>
                                    {contractAccount.accountId}
                                </span>

                            </div>
                            <div className={"token-info-item"}>
                                <span>
                                    Image Link
                                </span>
                                <span>
                                    <a href={token.metadata.media} target="_blank">{token.metadata.media.slice(0, 30)}...</a>
                                    <span> | </span>
                                    <NextLink href={"/cruscan/[cid]"} as={`/cruscan/${token.metadata.media.replace("https://crustwebsites.net/ipfs/", "")}`}>Scan</NextLink>
                                </span>

                            </div>
                        </div>

                        {
                            accountId.length > 0
                            && accountId !== token.owner_id
                            && !token.is_auction
                            && token.sale_conditions
                            && Object.keys(token.sale_conditions).length > 0
                            && <div className={"section token-info"}>
                                <Button variant={"contained"} onClick={() => handleBuyNow(account, token.token_id, offerToken)}>Buy Now</Button>
                            </div>
                        }

                    </Grid>


                </Grid>
                {
                    relatedTokens && relatedTokens.length && <>
                        <h2>You might like</h2>
                        <RelatedNFT relatedTokens={relatedTokens} nearToUsd={nearToUsd} />
                    </>
                }
            </Container> }


        </Box>

    );
}