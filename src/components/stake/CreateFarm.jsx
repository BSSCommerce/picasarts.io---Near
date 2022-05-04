import React, { useEffect, useState, useCallback } from 'react';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Grid,
    InputLabel,
    Switch,
    FormControlLabel,
    OutlinedInput,
    Card,
    CardMedia,
    CardContent,
    FormControl
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { loadFungibleTokens, loadNFTsForCreator, loadNumberTokens } from "src/state/views";
import { contractId } from 'src/utils/near-utils';
import { factoryId } from 'src/state/near';
import { createNewFarm } from 'src/state/actions';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const CreateFarm = ({ contractAccount, account }) => {
    if (!account) return <p>Please connect your NEAR Wallet</p>;
    const [isFactoryToken, setIsFactoryToken] = useState(true);
    const [tokenList, setTokenList] = useState([]);
    const [chosenFt, setChosenFt] = useState('');
    const [ftContractId, setFtContractId] = useState('');
    const [nftList, setNftList] = useState([]);

    const [startAt, setStartAt] = useState(0);
    const [timeStart, setTimeStart] = useState(new Date());

    const [sessionInterval, setSessionInterval] = useState(0);
    const [rewardPerSession, setRewardPerSession] = useState(1);
    const [nftContractId, setNftContractId] = useState(contractId);
    const [acceptNfts, setAcceptNfts] = useState([]);
    const handleCreateFarm = useCallback((event) => {
        const args = {
            terms: {
                seed_id: ftContractId,
                start_at: (startAt * 1000000).toString(),
                reward_per_session: rewardPerSession.toString(),
                session_interval: (sessionInterval * Math.pow(10, 9)).toString()
            },
            nft_contract_id: nftContractId,
            accepted_nfts: acceptNfts
        }
        createNewFarm(account, args);
    }, [account, ftContractId, startAt, nftContractId, rewardPerSession, sessionInterval, acceptNfts])

    const handleAcceptNfts = useCallback((event) => {
        const {
            target: { value },
        } = event;
        setAcceptNfts(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }, [acceptNfts]);

    useEffect(() => {
        if (contractAccount) {
            loadNumberTokens(contractAccount)
                .then(tokensLength => loadFungibleTokens(contractAccount, 0, tokensLength))
                .then(newData => {
                    setTokenList(newData);
                });
            loadNFTsForCreator(contractAccount, account.accountId)
                .then(newData => {
                    setNftList(newData);
                });
        }
    }, [contractAccount]);

    useEffect(() => {
        setFtContractId(chosenFt + "." + factoryId);
    }, [chosenFt]);

    return (
        <Grid container sx={{ py: 2 }} spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5">Term</Typography>
            </Grid>
            <Grid item xs={6}>
                <div className={"form-control"}>
                    {isFactoryToken ?
                        <FormControl fullWidth>
                            <InputLabel id="seed-id">Seed</InputLabel>
                            <Select
                                labelId="seed-id"
                                id="seed-id"
                                value={chosenFt}
                                label="Seed"

                                variant={"outlined"}
                                onChange={(e) => setChosenFt(e.target.value)}
                            >
                                {tokenList && tokenList.map(item =>
                                    <MenuItem value={item[0]} key={item[0]}>{item[1].metadata.symbol}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        : <TextField required variant={"outlined"} fullWidth label={"FT Contract ID"} value={ftContractId} onChange={(e) => setFtContractId(e.target.value)} />
                    }
                </div>
            </Grid>
            <Grid item xs={6}>
                <FormControlLabel labelPlacement="right" sx={{py: 2}} control={<Switch checked={isFactoryToken} onChange={(e) => setIsFactoryToken(!isFactoryToken)} />} label="Use Factory Token" />
            </Grid>
            <Grid item xs={4}>
                <div className={"form-control"}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => <TextField fullWidth {...props} />}
                            label="Start At"
                            value={timeStart}
                            onChange={(newValue) => {
                                setTimeStart(newValue);
                                setStartAt(newValue.getTime());
                            }}
                        />
                    </LocalizationProvider>
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className={"form-control"}>
                    <TextField required type={'number'} variant={"outlined"} fullWidth label={"Session Interval (Sec)"} value={sessionInterval} onChange={(e) => setSessionInterval(e.target.value)} />
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className={"form-control"}>
                    <TextField required type={'number'} variant={"outlined"} fullWidth label={"Reward Per Session"} value={rewardPerSession} onChange={(e) => setRewardPerSession(e.target.value)} />
                </div>
            </Grid>
            <Grid item xs={12} sx={{ display: 'none' }}>
                <div className={"form-control"}>
                    <TextField required variant={"outlined"} fullWidth label={"NFT Contract ID"} value={nftContractId} onChange={(e) => setNftContractId(e.target.value)} />
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className={"form-control"}>
                    <FormControl fullWidth>
                        <InputLabel id="accept-nfts">Accept NFTs</InputLabel>
                        <Select
                            labelId="accept-nfts"
                            id="accept-nfts"
                            value={acceptNfts}
                            label="Accept NFTs"
                            multiple
                            input={<OutlinedInput label="Accept NFTs" />}
                            onChange={handleAcceptNfts}
                            MenuProps={MenuProps}
                        >
                            {nftList && nftList.map(item =>
                                <MenuItem value={item.token_id} sx={{ display: 'flex', justifyContent: 'space-between' }} key={item.token_id}>
                                    {item.metadata.title} | {item.token_id}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Grid container xs={12} spacing={2}>
                    {nftList && nftList.filter(itemBefore => acceptNfts.includes(itemBefore.token_id)).map((item, index) =>
                        <Grid item key={item.token_id + "-img"}>
                            <Card sx={{
                                maxWidth: 250, borderRadius: '12px', py: 1
                            }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    width="200"
                                    src={item.metadata.media ? item.metadata.media : `https://picsum.photos/300?random=${index}`}
                                    alt="Paella dish"
                                />
                                <CardContent>
                                    {item.metadata.title}
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Button fullWidth variant='contained' onClick={handleCreateFarm}>Create New Farm</Button>
            </Grid>
        </Grid>
    )
}