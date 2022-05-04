import React, { useEffect, useState, useCallback } from 'react';
import {
    Button,
    Skeleton,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    TextField,
    Grid
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { loadFarm } from "src/state/views";
import { addReward } from 'src/state/actions';

export const AddReward = ({ contractAccount, account, farm_index, seed_id }) => {
    if (!account) return <p>Please connect your NEAR Wallet</p>;
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState(1);
    const farmId = `${seed_id}#${farm_index}`;

    const convertTimeToSec = useCallback((time) => {
        return time / Math.pow(10, 9);
    }, []);

    const convertTimeToDate = useCallback((time) => {
        return (new Date(time / Math.pow(10, 6))).toLocaleString();
    }, []);


    const handleAddReward = useCallback(() => {
        addReward(account, seed_id, farmId, amount.toString());
    }, [account, amount]);
    useEffect(() => {
        if (contractAccount && farmId) {
            loadFarm(contractAccount, farmId)
                .then(newData => {
                    setData(newData);
                    setLoading(false);
                })
        }
    }, [contractAccount]);

    if (loading) return <Skeleton variant="rectangular" width={345} height={400} sx={{mx: 'auto'}}/>
    if (!data) return <p>Error, please go back your farms page</p>;
    return (
        <Card sx={{
            maxWidth: 345, borderRadius: '12px', pb: 1,
            mx: 'auto'
        }}>
            <CardMedia
                component="img"
                height="300"
                width="300"
                image={'https://picsum.photos/300'}
                alt="Farm media"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary" align='left'>
                    Owner: {data.owner_id}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left'>
                    Reward: {data.seed_id}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left'>
                    RPS: {data.reward_per_session}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left'>
                    Session Interval: {convertTimeToSec(data.session_interval)}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left'>
                    Start at: {convertTimeToDate(data.start_at)}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left'>
                    Claimed: {data.claimed_reward}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left'>
                    Remain: {data.total_reward}
                </Typography>
            </CardContent>
            <CardActions>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField required type={'number'} variant={"outlined"} fullWidth label={"Amount"} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleAddReward} variant="outlined" fullWidth>
                            Add Reward
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )
}

