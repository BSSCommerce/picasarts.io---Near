import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function TableFTs({ data }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Icon</TableCell>
                        <TableCell align="right">Symbol</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Owner</TableCell>
                        <TableCell align="right">Total supply</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.map((row, index) => (
                        <TableRow
                            key={row.metadata.symbol}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.metadata.icon ? <img height={50} src={row.metadata.icon} /> : <img src={`https://picsum.photos/50/?random=${index}`} />}
                            </TableCell>
                            <TableCell align="right">{row.metadata.symbol}</TableCell>
                            <TableCell align="right">{row.metadata.name}</TableCell>
                            <TableCell align="right">{row.owner_id}</TableCell>
                            <TableCell align="right">{row.total_supply}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}