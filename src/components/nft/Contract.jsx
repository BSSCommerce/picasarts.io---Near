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
	Grid,
	CardMedia
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import NextLink from "next/link";
import Card from "@mui/material/Card";
import ImageUpload from "./ImageUpload";

const {
	KeyPair,
} = nearAPI;

export const Contract = ({ near, update, account }) => {
	if (!account) return <p>Please connect your NEAR Wallet</p>;

	const [media, setMedia] = useState('');
	const [validMedia, setValidMedia] = useState('');
	const [royalties, setRoyalties] = useState({});
	const [royalty, setRoyalty] = useState([]);
	const [receiver, setReceiver] = useState([]);
	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={8}>

					<h4>Mint Something</h4>
					<ImageUpload setMedia={setMedia}/>
					<TextField className="full-width" placeholder="Image Link" value={media} onChange={(e) => setMedia(e.target.value)} />


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
					<TextField className="full-width" placeholder="Account ID" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
					<TextField type="number" className="full-width" placeholder="Percentage" value={royalty} onChange={(e) => setRoyalty(e.target.value)} />
					<Button onClick={async () => {
						const exists = await isAccountTaken(receiver);
						if (!exists) return alert(`Account: ${receiver} does not exist on ${networkId ==='default' ? 'testnet' : 'mainnet'}.`);
						setRoyalties(Object.assign({}, royalties, {
							[receiver]: royalty
						}));
					}}>Add Royalty</Button>

					<div className="line"></div>

					<Button onClick={() => handleMint(account, royalties, media, validMedia)}>Mint</Button>


				</Grid>
				<Grid item xs={4}>
					<h4>Preview</h4>
					{/*<img src={media} onLoad={() => setValidMedia(true)} onError={() => setValidMedia(false)} />*/}
					<Card
						sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
					>
						<img src={media} onLoad={() => setValidMedia(true)} onError={() => setValidMedia(false)} />
						<CardContent sx={{ flexGrow: 1 }}>
							<Typography gutterBottom variant="h5" component="h2">
								{ "NFT TITLE" }
							</Typography>
							<Typography>
								{account.accountId}
							</Typography>
						</CardContent>
						<CardActions>
							<a>Buy Now</a>
						</CardActions>
					</Card>
				</Grid>

			</Grid>
		</Container>)
}

