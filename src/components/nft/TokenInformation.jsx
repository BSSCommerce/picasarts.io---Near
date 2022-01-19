import {useRouter} from "next/router";
import {useTheme} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Card,
    CardMedia,
    CardContent,
    Typography,
    FormControl,
    Button, TextField
} from "@mui/material";
import {getTokenOptions, handleOffer, token2symbol} from "../../state/near";
import {handleAcceptOffer} from "../../state/actions";
import * as nearAPI from "near-api-js";

const {
    utils: { format: { formatNearAmount } }
} = nearAPI;

export const TokenInformation = ({ app, views, update, contractAccount, account, loading, dispatch }) => {
    if (!contractAccount) return null;
    const router = useRouter();
    let accountId = '';
    if (account) accountId = account.accountId;
    const { sales } = views
    const [token, setToken ] = useState(false);

    /// market
    const [offerPrice, setOfferPrice] = useState('');
    const [offerToken, setOfferToken] = useState('near');


    useEffect(() => {
        const {id} = router.query;
        let currentToken = sales.find(({ token_id }) => id === token_id);
        console.log(sales, currentToken);
        setToken(currentToken);
    }, [token])

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
            { token && <Container maxWidth="lg">
                <Card sx={{ display: 'flex' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: "60%" }}
                        image="https://crustwebsites.net/ipfs/QmZ97Lkjc2cmjKHqdzLQQtNt8gDXuKgDuSQC1X7gwkdZgR"
                        alt="Live from space album cover"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                Author
                            </Typography>
                            <Typography component="p">
                                {token.owner_id}
                            </Typography>
                            { Object.keys(token.sale_conditions).length > 0 && <>
                                <h4>Royalties</h4>
                                {
                                    Object.keys(token.royalty).length > 0 ?
                                        Object.entries(token.royalty).map(([receiver, amount]) => <div key={receiver}>
                                            {receiver} - {amount / 100}%
                                        </div>)
                                        :
                                        <p>This token has no royalties.</p>
                                }

                                {
                                    Object.keys(token.sale_conditions).length > 0 && <>
                                        <h4>Sale Conditions</h4>
                                        {
                                            Object.entries(token.sale_conditions).map(([ft_token_id, price]) => <div className="margin-bottom" key={ft_token_id}>
                                                {price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]}
                                            </div>)
                                        }
                                        {
                                            accountId.length > 0 && accountId !== token.owner_id && <>
                                                <TextField id="filled-basic" label="Price" variant="standard" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
                                                {
                                                    getTokenOptions(offerToken, setOfferToken, Object.keys(token.sale_conditions))
                                                }
                                                <Button onClick={() => handleOffer(account, token.token_id, offerToken, offerPrice)}>Offer</Button>
                                            </>
                                        }
                                    </>
                                }
                                {
                                    Object.keys(token.bids).length > 0 && <>
                                        <h4>Offers</h4>
                                        {
                                            Object.entries(token.bids).map(([ft_token_id, ft_token_bids]) => ft_token_bids.map(({ owner_id: bid_owner_id, price }) => <div className="offers" key={ft_token_id}>
                                                <div>
                                                    {price === '0' ? 'open' : formatNearAmount(price, 4)} - {token2symbol[ft_token_id]} by {bid_owner_id}
                                                </div>
                                                {
                                                    accountId === token.owner_id &&
                                                    <button onClick={() => handleAcceptOffer(account, token.token_id, ft_token_id)}>Accept</button>
                                                }
                                            </div>) )
                                        }
                                    </>
                                }
                            </>
                            }
                        </CardContent>

                    </Box>
                </Card>
            </Container> }
        </Box>

    );
}