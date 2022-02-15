import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Container, Grid,
    TextField
} from "@mui/material";
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const consensusDate = new Date(2021, 6, 9, 7, 50, 30);
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                <TableCell align="left">{row.cid}</TableCell>
                <TableCell align="left">{row.replicas_count}</TableCell>
                <TableCell align="left">{row.file_size}</TableCell>
                <TableCell align="left">
                    { row.last_storage_order
                        ? new Date(
                            consensusDate.getTime() +
                            row.last_storage_order * 6 * 1000
                        )
                            .toISOString()
                            .split('T')[0]
                        : ''}</TableCell>
                <TableCell align="left">{ row.expired_at
                    ? new Date(
                        consensusDate.getTime() +
                        row.expired_at * 6 * 1000
                    )
                        .toISOString()
                        .split('T')[0]
                    : ''}</TableCell>
                <TableCell align="left">{row.prepaid}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Technical Replicas Info
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Anchor</TableCell>
                                        <TableCell>Is Reported</TableCell>
                                        <TableCell align="right">Valid At</TableCell>
                                        <TableCell align="right">Who</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.replicas.map((replica) => (
                                        <TableRow key={replica.anchor}>
                                            <TableCell component="th" scope="row">
                                                <div  style={{maxWidth: "400px", overflowWrap: "break-word"}}>{replica.anchor}</div>
                                            </TableCell>
                                            <TableCell>{replica.is_reported}</TableCell>
                                            <TableCell align="right">{replica.valid_at}</TableCell>
                                            <TableCell align="right">
                                                {replica.who}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}



export default function DataList({cid, fileData}) {
    if (!fileData) {
        return (
            <></>
        )
    }
    const rows = [
        {
            cid: cid,
            replicas_count: fileData.reported_replica_count,
            file_size: fileData.file_size,
            expired_at: fileData.expired_at,
            last_storage_order: fileData.calculated_at,
            prepaid: fileData.prepaid,
            replicas: fileData.replicas
        }
    ];

    return (
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>CID</TableCell>
                                <TableCell align="left">Replicas</TableCell>
                                <TableCell align="left">File Size</TableCell>
                                <TableCell align="left">Last Storage Order</TableCell>
                                <TableCell align="left">Expired On</TableCell>
                                <TableCell align="left">Prepaid</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <Row key={row.cid} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
    );
}
