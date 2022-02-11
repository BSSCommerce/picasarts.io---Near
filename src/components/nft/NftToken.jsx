import {Card, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import {formatAccountId} from "../../utils/near-utils";
import {token2symbol} from "../../state/near";
import NextLink from "next/link";
import React from "react";
import * as nearAPI from 'near-api-js';
const {
    utils: { format: { formatNearAmount } }
} = nearAPI;

export default function NftToken({media, title, owner_id, token_id, accountId, sale_conditions, bids, royalty, nearToUsd }) {
    return <Grid item key={token_id} xs={6} sm={4} md={3}>
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
            subheader={accountId !== owner_id ? <strong>by <NextLink key={`${token_id}_collection_link`} href={"/collection/[account_id]"} as={`/collection/${owner_id}`} className={"nft-author-name"}>{formatAccountId(owner_id)}</NextLink></strong> : `You own this!`}
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
}