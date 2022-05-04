import React, { useContext, useEffect, useState, useCallback } from 'react';
import { appStore, onAppMount } from 'src/state/app';
import { useDropzone } from 'react-dropzone';
import {
    Container,
    Button,
    TextField,
    Grid,
    Typography,
    Paper
} from '@mui/material';
import NotLoggedIn from "src/components/common/NotLoggedIn";
import minifySvg from 'mini-svg-data-uri';
import { createNewFT } from 'src/state/actions';

const Create = () => {
    const { state, dispatch, update } = useContext(appStore);
    const { wallet, account, contractAccount } = state;

    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);

    const signedIn = ((wallet && wallet.signedIn));

    const [onwerId, setOwnerId] = useState("");
    const [totalSupply, setTotalSupply] = useState(0);
    const [spec, setSpec] = useState("ft-1.0.0");
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [icon, setIcon] = useState("");
    const [decimals, setDecimals] = useState(0);

    const createFT = useCallback(() => {
        let args = {
            owner_id: onwerId,
            total_supply: totalSupply.toString(),
            metadata: {
                spec: spec,
                name: name,
                icon: icon,
                symbol: symbol,
                decimals: parseInt(decimals)
            }
        }
        createNewFT(account, args)
            .then(res => {
                console.log(res)
            })
    }, [account, onwerId, totalSupply, spec, name, icon, symbol, decimals])
    const onDrop = useCallback(acceptedFiles => {
        let file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            setIcon(minifySvg(reader.result))
        }
        reader.readAsText(file)
        // );
    }, []);

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/svg+xml',
        maxFiles: 1,
        maxSize: 2050,
        onDrop
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    return (
        <>
            {
                signedIn && <Container
                    component={Paper}
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 4,
                        pb: 6,
                        my: 2
                    }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5">Create new token</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={"form-control"}>
                                <TextField required variant={"outlined"} fullWidth label={"Owner"} value={onwerId} onChange={(e) => setOwnerId(e.target.value)} />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={"form-control"}>
                                <TextField required variant={"outlined"} fullWidth label={"Total Supply"} value={totalSupply} onChange={(e) => setTotalSupply(e.target.value)} />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Metadata</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={"form-control"}>
                                <TextField required variant={"outlined"} fullWidth label={"Spec"} value={spec} onChange={(e) => setSpec(e.target.value)} />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={"form-control"}>
                                <TextField required variant={"outlined"} fullWidth label={"Name"} value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={"form-control"}>
                                <TextField required variant={"outlined"} fullWidth label={"Symbol"} value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={"form-control"}>
                                <TextField required variant={"outlined"} fullWidth label={"Decimals"} value={decimals} onChange={(e) => setDecimals(e.target.value)} />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">Icon <em>(File types supported: SVG. Max size: 2 kB)</em></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">Preview</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <section className="container">
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                    <em>(Only *.svg images will be accepted)</em>
                                </div>
                            </section>
                        </Grid>
                        <Grid item xs={6}>
                            {icon && <img height={"100px"}src={icon} />}
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" onClick={() => createFT()}>Create new FT</Button>
                        </Grid>
                    </Grid>
                </Container>
            }
            {
                !signedIn && <NotLoggedIn wallet={wallet} />
            }
        </>
    )
};

export default Create;
