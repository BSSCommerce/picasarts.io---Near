import React, { useState, useEffect } from 'react';
import {
    Box,
    Popover,
    IconButton,
    Typography,
    Link
} from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import NotificationList from 'src/components/common/NotificationList';

const getNotifications = async (accountId) => {
    let data = [];
    try {
        let promiseMk1 = fetch('https://api.thegraph.com/subgraphs/name/dungntbss/marketsubgraph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetActivities($accountId: String) {
                        activities(first: 10, orderDirection: desc, orderBy: blockTime, where: { from: $accountId }) {
                            id
                            token_id
                            from
                            to
                            type
                            ft_token_id
                            price
                        }
                    }
                `,
                variables: {
                    accountId: accountId
                },
            }),
        });

        let promiseMk2 = fetch('https://api.thegraph.com/subgraphs/name/dungntbss/marketsubgraph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetActivities($accountId: String) {
                        activities(first: 10, orderDirection: desc, orderBy: blockTime, where: { to: $accountId }) {
                            id
                            token_id
                            from
                            to
                            type
                            ft_token_id
                            price
                        }
                    }
                `,
                variables: {
                    accountId: accountId
                },
            }),
        });

        let promiseNft1 = fetch('https://api.thegraph.com/subgraphs/name/dungntbss/nftsubgraph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetActivities($accountId: String) {
                        activities(first: 10, orderDirection: desc, orderBy: blockTime, where: { from: $accountId }) {
                            id
                            token_id
                            from
                            to
                            type
                            ft_token_id
                            price
                        }
                    }
                `,
                variables: {
                    accountId: accountId
                },
            }),
        });

        let promiseNft2 =  fetch('https://api.thegraph.com/subgraphs/name/dungntbss/nftsubgraph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetActivities($accountId: String) {
                        activities(first: 10, orderDirection: desc, orderBy: blockTime, where: { to: $accountId }) {
                            id
                            token_id
                            from
                            to
                            type
                            ft_token_id
                            price
                        }
                    }
                `,
                variables: {
                    accountId: accountId
                },
            }),
        });
        let [data1, data2, data3, data4] = await Promise.all([promiseMk1, promiseMk2, promiseNft1, promiseNft2]);
        let [dataP1, dataP2, dataP3, dataP4] = await Promise.all([data1.json(), data2.json(), data3.json(), data4.json()]);
        data = dataP1.data.activities.concat(dataP2.data.activities, dataP3.data.activities, dataP4.data.activities);
        console.log(data)
    } catch (e) {
        console.log(e)
    }
    return data
}

export default function Notification({ accountId }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getNotifications(accountId);
    }, [])

    return (
        <>
            <IconButton onClick={handleClick} >
                <CircleNotificationsIcon sx={{ fontSize: 30, color: 'white' }} />
            </IconButton>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ py: 2 }}>
                    <NotificationList
                        accountId={accountId}
                        data={[]} />
                    <Typography align="center">
                        <Link href="/account/notification" underline="hover">
                            View All
                        </Link>
                    </Typography>
                </Box>
            </Popover>
        </>
    )
}