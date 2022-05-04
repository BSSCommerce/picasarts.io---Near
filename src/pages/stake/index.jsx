import React, { useState, useContext, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
    Grid,
    Container,
    Box,
    Button,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Typography,
    Link
} from "@mui/material";
import Head from "next/head";
import FarmCard from "src/components/stake/FarmCard";
import FarmCardOwner from "src/components/stake/FarmCardOwner";
import { appStore, onAppMount } from "src/state/app";
import {
    farmStorage,
    loadFarms,
    loadNFTsForOwner,
    loadStaking,
} from "src/state/views";
import { depositFarming } from "src/state/actions";

const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

export default function Index() {
    const { state, dispatch } = useContext(appStore);
    const { account, contractAccount } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);

    const [status, setStatus] = useState("Running");
    const [staking, setStaking] = useState(false);
    const [farmList, setFarmList] = useState([]);
    const [stakingList, setStakingList] = useState({});
    const [registered, setRegistered] = useState(true);
    const [tokensForOwner, setTokensForOwner] = useState([]);

    useEffect(() => {
        if (contractAccount) {
            loadFarms(contractAccount).then((newData) => {
                setFarmList(newData);
            });

            if (account) {
                farmStorage(contractAccount, account.accountId).then((total) => {
                    if (!total) {
                        setRegistered(false);
                    }
                });
                loadNFTsForOwner(contractAccount, account.accountId).then((res) => {
                    if (res) {
                        setTokensForOwner(res.map((item) => item.token_id));
                    }
                });
                loadStaking(contractAccount, account.accountId).then((newStaking) => {
                    console.log(newStaking)
                    setStakingList(newStaking);
                });
            }
        }
    }, [contractAccount]);

    const handleDepositStorage = useCallback(
        (e) => {
            depositFarming(account);
        },
        [account]
    );
    return (
        <div className={"container"}>
            <Head>
                <title>Explore Farms</title>
            </Head>
            <Container sx={{ py: 8 }} maxWidth="xl">
                <Grid sx={{ py: 2 }} container spacing={2}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        {!registered &&
                            <Typography variant="h6">*To stake into any farm, please <Link
                                variant="h6"
                                sx={{ lineHeight: "3", cursor: 'pointer' }}
                                onClick={handleDepositStorage}
                            >register as a farmer</Link> to get permission</Typography>
                        }
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={staking}
                                label="Type"
                                onChange={(e) => setStaking(e.target.value)}
                            >
                                <MenuItem value={false}>All</MenuItem>
                                <MenuItem value={true}>Staking</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value={"Created"}>Created</MenuItem>
                                <MenuItem value={"Running"}>Running</MenuItem>
                                <MenuItem value={"Ended"}>Ended</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
                <Grid container spacing={2}>
                    {farmList &&
                        farmList
                            .filter(
                                (itemFilterStaking) =>
                                    !staking ||
                                    (stakingList.farm_staking &&
                                        stakingList.farm_staking.includes(itemFilterStaking[0]))
                            )
                            .filter(
                                (itemFilterStatus) =>
                                    itemFilterStatus[1].farm_status == status
                            )
                            .map((item, index) => (
                                <Grid item xs={3}>
                                    <Item>
                                        {
                                            account && item[1].owner_id == account.accountId ?
                                                <FarmCardOwner account={account} data={item[1]} index={index} farm_id={item[0]} />
                                                : <FarmCard
                                                    contractAccount={contractAccount}
                                                    registered={registered}
                                                    account={account}
                                                    data={item[1]}
                                                    index={index}
                                                    farm_id={item[0]}
                                                    is_staking={
                                                        stakingList.farm_staking &&
                                                        stakingList.farm_staking.includes(item[0])
                                                    }
                                                    tokensForOwner={tokensForOwner}
                                                />
                                        }
                                    </Item>
                                </Grid>
                            ))}
                </Grid>
            </Container>
        </div>
    );
}
