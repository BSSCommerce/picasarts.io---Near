import React from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    Typography,
    IconButton,
} from '@mui/material';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import NextLink from 'next/link';

export default function NftLinkList({ accepted, staked }) {
    return (
        <List>
            {accepted.length ? accepted.map(item => (
                <ListItem key={`nft-${item}`}
                    secondaryAction={
                        <IconButton disabled edge="end" aria-label="staked">
                            {staked && staked.includes(item) ? <DataSaverOnIcon /> : <DataSaverOffIcon />}
                        </IconButton>
                    }
                >
                    <ListItemButton>
                        <NextLink href={"/token/[id]"} as={`/token/${item}`} >
                            <Typography textAlign={"Left"}>{item}</Typography>
                        </NextLink>
                    </ListItemButton>
                </ListItem>
            )) : <ListItemButton>Error load token</ListItemButton>}
        </List>
    )
}