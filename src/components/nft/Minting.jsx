import React, {useEffect, useState} from 'react';
import * as nearAPI from 'near-api-js';
import { handleMint } from '../../state/actions';
import {
	formatAccountId,
	isAccountTaken,
	networkId,
} from '../../utils/near-utils';
import {
	Button,
	TextField,
	Container,
	Grid, CircularProgress, CardHeader,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import ImageUpload from "../common/ImageUpload";
import {token2symbol} from "../../state/near";
import NextLink from "next/link";

const {
	KeyPair,
} = nearAPI;

export const Minting = ({ near, update, account }) => {
	if (!account) return <p>Please connect your NEAR Wallet</p>;
	const [isLoading, setIsLoading] = useState(false)
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [media, setMedia] = useState('');
	const [validMedia, setValidMedia] = useState(true);
	const [royalties, setRoyalties] = useState({});
	const [royalty, setRoyalty] = useState([]);
	const [receiver, setReceiver] = useState([]);


	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<h4>Create New Item</h4>
					<div className={"minting-form"}>
						<h5><span style={{color: "red"}}>*</span> Required fields</h5>

						<div className={"form-control"}>
							<TextField required variant={"outlined"} fullWidth label={"Title"} value={title} onChange={(e) => setTitle(e.target.value)} />
						</div>
						<div className={"form-control"}>
							<TextField variant={"outlined"} fullWidth label={"Description"} value={description} onChange={(e) => setDescription(e.target.value)} multiline={true} />
						</div>

						<div className={"form-control"}>
							<strong>
								<p>Upload Images <span style={{color: "red"}}>*</span></p>
								<p>File types supported: JPG, PNG, GIF Max size: 5 MB</p>
							</strong>
							<ImageUpload setMedia={setMedia}/>
						</div>
						{ !validMedia && <p>Image link is invalid.</p> }

						<h4>Royalties</h4>
						{
							Object.keys(royalties).length > 0 ?
								Object.entries(royalties).map(([receiver, royalty]) => <div key={receiver}>
									{receiver} - {royalty} % <button onClick={() => {
									delete royalties[receiver];
									setRoyalties(Object.assign({}, royalties));
								}}>❌</button>
								</div>)
								:
								<p>No royalties added yet.</p>
						}
						<div className={"form-control"} style={{display: "flex"}}>
							<TextField variant={"outlined"} label="Account ID" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
							<TextField variant={"outlined"} type="number" label="Percentage" value={royalty} onChange={(e) => setRoyalty(e.target.value)} />
							<Button variant={"outlined"} onClick={async () => {
								const exists = await isAccountTaken(receiver);
								if (!exists) return alert(`Account: ${receiver} does not exist on ${networkId ==='default' ? 'testnet' : 'mainnet'}.`);
								setRoyalties(Object.assign({}, royalties, {
									[receiver]: royalty
								}));
							}}>Add</Button>
						</div>
						<Button disabled={isLoading} variant={"contained"} onClick={() => { setIsLoading(true); handleMint(account, royalties, media, validMedia, title, description)}}>
							{isLoading && <CircularProgress size={14} />}
							{!isLoading && 'Create'}
						</Button>
					</div>


				</Grid>
				<Grid item xs={4}>
					<h4>Preview</h4>
					{/*<img src={media} onLoad={() => setValidMedia(true)} onError={() => setValidMedia(false)} />*/}
					<Card
						className={"nft-card"}
						sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
					>
						<CardHeader
							key={`card_header`}
							title={title ? title : "[title]"}
							subheader={ <strong>by {formatAccountId(account.accountId)}</strong>}
						/>
						{ media && <img src={URL.createObjectURL(media)} onLoad={() => setValidMedia(true)} onError={() => setValidMedia(false)} /> }
						<CardContent sx={{ flexGrow: 1 }}>
							<Typography gutterBottom component="div">
								Price
							</Typography>
							<Typography variant="body2" color="text.secondary">
								-- NEAR | -- USD
							</Typography>
							<div className={"nft-card-actions"}>
								<NextLink href={"#"}>See Details</NextLink>
							</div>
						</CardContent>
					</Card>
				</Grid>

			</Grid>
		</Container>)
}

