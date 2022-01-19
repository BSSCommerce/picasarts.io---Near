import React, {useContext, useEffect, useState} from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Container from "@mui/material/Container";
import { useRouter } from 'next/router';
import { appStore, onAppMount} from '../../state/app';

import { TokenInformation } from "src/components/nft/TokenInformation"
import {getMarketStoragePaid, loadItems} from "../../state/views";

export default function NftPage() {

    const [isLoading, setIsLoading] = useState(true)

    const { dispatch, state, update } = useContext(appStore);
    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect( () => {
        if (isLoading) {
            onMount();
            setIsLoading(false);
        }

    }, [isLoading]);

    return (
        !isLoading && <TokenInformation {...{ app, views, update, loading, contractAccount, account, dispatch }} />

    )
}
