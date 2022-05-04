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

export default function NftStakeList({ data, handleNFT, type }) {
    return (
        <List>
            {data.length ? data.map(item => (
                <ListItem key={`nft-available-${item}`}
                    secondaryAction={
                        <IconButton onClick={() => handleNFT(item)} edge="end" aria-label="staked">
                            {type == "stake" ? <DataSaverOnIcon /> : <DataSaverOffIcon />}
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