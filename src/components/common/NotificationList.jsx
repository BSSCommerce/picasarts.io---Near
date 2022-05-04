import React from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    Typography,
} from '@mui/material';
import NextLink from 'next/link';

export default function NotificationList({accountId, data}) {
    return (
        <List>
            {data.length ? data.map(item => (
                <ListItem key={`noti-${item._id}`}>
                    <ListItemButton>
                        <NextLink href={"/token/[id]"} as={`/token/${item.nft_id}`} >
                            <Typography textAlign={"Left"}>{item.message}</Typography>
                        </NextLink>
                    </ListItemButton>
                </ListItem>
            )) : <ListItemButton>You caught all the notifications</ListItemButton>}
        </List>
    )
}