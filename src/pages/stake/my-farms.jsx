import React, { useState, useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Container, Box, IconButton, InputLabel, Select, MenuItem, FormControl, TextField } from '@mui/material';
import Head from 'next/head';
import { appStore, onAppMount } from 'src/state/app';
import { loadFarms } from 'src/state/views';
import FarmCardOwner from 'src/components/stake/FarmCardOwner';

const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function MyFarms() {
    const { state, dispatch } = useContext(appStore);
    const { account, contractAccount } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);

    const [status, setStatus] = useState("Running");
    const [farmList, setFarmList] = useState([]);

    useEffect(() => {
        if (contractAccount) {
            loadFarms(contractAccount)
                .then(newData => {
                    setFarmList(newData);
                });
        }
    }, [contractAccount]);
    return (
        <div className={'container'}>
            <Head>
                <title>Explore Farms</title>
            </Head>
            <Container sx={{ py: 8 }} maxWidth="xl">
                <Box sx={{ minWidth: 150, maxWidth: 300, my: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={e => setStatus(e.target.value)}
                        >
                            <MenuItem value={"Created"}>Created</MenuItem>
                            <MenuItem value={"Running"}>Running</MenuItem>
                            <MenuItem value={"Ended"}>Ended</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Grid container spacing={2}>
                    {
                        farmList && farmList.filter(itemFilter => itemFilter[1].farm_status == status && itemFilter[1].owner_id == account.accountId).map((item, index) =>
                            <Grid item xs={3}>
                                <Item>
                                    <FarmCardOwner account={account} data={item[1]} index={index} farm_id={item[0]} />
                                </Item>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
        </div>
    );
};