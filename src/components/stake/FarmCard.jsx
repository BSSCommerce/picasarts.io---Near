import React, { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import { claimReward, depositFT, depositNFT, withdrawNFT } from "src/state/actions";
import { ftStorage } from "src/state/views";
import NftLinkList from "./NftLinkList";
import NftStakeList from "./NftStakeList";

export default function FarmCard({
    contractAccount,
    account,
    data,
    index,
    farm_id,
    is_staking,
    registered,
    tokensForOwner,
}) {
    const [seed_id] = farm_id.split("#");
    const [tab, setTab] = useState(0);
    const [ftDialog, setFtDialog] = useState(false);
    const [stakeDialog, setStakeDialog] = useState(false);
    const [withdrawDialog, setWithdrawDialog] = useState(false);

    const convertTimeToSec = useCallback((time) => {
        return time / Math.pow(10, 9);
    }, []);

    const convertTimeToDate = useCallback((time) => {
        return new Date(time / Math.pow(10, 6)).toLocaleString();
    }, []);

    const handleFtClose = () => {
        setFtDialog(false);
    };

    const handleDepositFt = () => {
        depositFT(account, seed_id);
    };

    const handleStakeClose = () => {
        setStakeDialog(false);
    };

    const handleWithdrawClose = () => {
        setWithdrawDialog(false);
    };
    const handleStake = useCallback(
        async (e) => {
            if (account) {
                let deposit_total = await ftStorage(
                    contractAccount,
                    seed_id,
                    account.accountId
                );
                if (!deposit_total) {
                    setFtDialog(true);
                } else {
                    setStakeDialog(true);
                }
            }
        },
        [account]
    );
    const handleDepositNFT = (token_id) => {
        if (account) {
            depositNFT(account, data.nft_contract_id, token_id, farm_id);
        }
    };

    const handleClaim = (e) => {
        if (account) {
            claimReward(account, farm_id);
        }
    }

    const handleWithdrawNFT = (token_id) => {
        if (account) {
            withdrawNFT(account, farm_id, token_id);
        }
    };
    return (
        <Box>
            <Card
                sx={{
                    borderRadius: "12px",
                    pb: 1,
                }}
            >
                <CardMedia
                    component="img"
                    height="300"
                    width="300"
                    image={`https://picsum.photos/300?random=${index}`}
                    alt="Farm media"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" align="left">
                        Owner: {data.owner_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="left">
                        Reward: {data.seed_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="left">
                        RPS: {data.reward_per_session}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="left">
                        Session Interval: {convertTimeToSec(data.session_interval)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="left">
                        Start at: {convertTimeToDate(data.start_at)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="left">
                        Claimed: {data.claimed_reward}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="left">
                        Remain: {data.total_reward}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button
                                disabled={data.farm_status != "Running" || !registered}
                                variant="outlined"
                                fullWidth
                                onClick={handleStake}
                            >
                                Stake
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button disabled={!is_staking} onClick={() => setWithdrawDialog(true)} variant="outlined" fullWidth>
                                Withdraw
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button disabled={!is_staking} onClick={handleClaim} variant="contained" fullWidth>
                                Claim
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
            <Dialog
                fullScreen={false}
                open={ftDialog}
                onClose={handleFtClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Deposit FT contract?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have not register fungible token contract yet. Please register
                        for staking.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleFtClose}>
                        Disagree
                    </Button>
                    <Button onClick={handleDepositFt} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullScreen={false}
                open={stakeDialog}
                onClose={handleStakeClose}
                aria-labelledby="stake-dialog-title"
            >
                <DialogTitle id="stake-dialog-title" sx={{ textAlign: "center" }}>
                    {"Choose NFT to stake"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Tabs
                            value={tab}
                            onChange={(e, value) => setTab(value)}
                            aria-label="chosen-nft-tabs"
                            centered
                        >
                            <Tab label="Available" id="tabpanel-available" />
                            <Tab label="Eligible" id="tabpanel-eligable" />
                        </Tabs>
                        {tab == 0 && (
                            <NftStakeList
                                data={data.accepted_nfts.filter((item) =>
                                    tokensForOwner.includes(item)
                                )}
                                type="staked"
                                handleNFT={handleDepositNFT}
                            />
                        )}
                        {tab == 1 && (
                            <NftLinkList
                                accepted={data.accepted_nfts}
                                staked={data.staked_ids}
                            />
                        )}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            {account &&
                <Dialog
                    fullScreen={false}
                    open={withdrawDialog}
                    onClose={handleWithdrawClose}
                    aria-labelledby="withdraw-dialog-title"
                >
                    <DialogTitle id="withdraw-dialog-title" sx={{ textAlign: "center" }}>
                        {"Choose NFT to withdraw"}
                    </DialogTitle>
                    <DialogContent>
                        <NftStakeList
                            data={data.staked_ids.filter((item, index) =>
                                data.staked_nfts[index].owner_id == account.accountId
                            )}
                            type="withdraw"
                            handleNFT={handleWithdrawNFT}
                        />
                    </DialogContent>
                </Dialog>
            }
        </Box>
    );
}
