import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { addReward } from 'src/state/actions';

export default function FarmCardOwner({account, data, index, farm_id }) {
    const [seed_id] = farm_id.split("#");
    const [amount, setAmount] = useState(1);
    const handleAddReward = useCallback(() => {
        addReward(account, seed_id, farm_id, amount.toString());
    }, [account, amount]);

    const convertTimeToSec = useCallback((time) => {
        return time / Math.pow(10, 9);
    }, []);

    const convertTimeToDate = useCallback((time) => {
        return (new Date(time / Math.pow(10, 6))).toLocaleString();
    }, []);
    return (
        <Card sx={{
            borderRadius: '12px', pb: 1
        }}>
            <CardMedia
                component="img"
                height="300"
                width="300"
                image={`https://picsum.photos/300?random=${index}`}
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
    );
}