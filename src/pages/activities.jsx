import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatNearAmount } from "src/state/near";
import { Skeleton } from "@mui/material";

const getActivities = async () => {
    try {
        let promiseMk = fetch('https://api.thegraph.com/subgraphs/name/dungntbss/marketsubgraph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetActivities {
                        activities(first: 20, orderDirection: desc, orderBy: blockTime) {
                            token_id
                            from
                            to
                            type
                            ft_token_id
                            price
                            blockTime
                        }
                    }
                `
            }),
        });

        let promiseNft = fetch('https://api.thegraph.com/subgraphs/name/dungntbss/nftsubgraph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetActivities {
                        activities(first: 20, orderDirection: desc, orderBy: blockTime) {
                            token_id
                            from
                            to
                            type
                            ft_token_id
                            price
                            blockTime
                        }
                    }
                `
            }),
        });

        let [data1, data2] = await Promise.all([promiseMk, promiseNft]);
        let [dataP1, dataP2] = await Promise.all([data1.json(), data2.json()]);
        return dataP1.data.activities.concat(dataP2.data.activities).sort((a, b) => a.blockTime < b.blockTime);
    } catch (e) {
        console.log(e)
    }
    return [];
}

export default function Activities() {
    const [data, setData] = useState([]);
    useEffect(() => {
        console.log("hello")
        getActivities()
        .then(newData => {
            setData(newData);
        });
    }, []);


    useEffect(() => {
        console.log(data)
    }, [data]);
    if (!data || !data.length) return <Skeleton height={500}/>;

    return (
        <Container className={"picasart-dashboard"} sx={{ py: 8, bgcolor: 'background.paper', }} maxWidth="xl">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Token Id</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Block Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { data.map(row => (
                            <TableRow
                                key={row.token_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.token_id}</TableCell>
                                <TableCell>{row.from}</TableCell>
                                <TableCell>{row.to}</TableCell>
                                <TableCell>{row.price ? parseFloat(formatNearAmount(row.price, 4)) : ""}</TableCell>
                                <TableCell>{row.blockTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}
