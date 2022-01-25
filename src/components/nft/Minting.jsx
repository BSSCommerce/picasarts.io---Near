import React, {useEffect, useState} from 'react';
import * as nearAPI from 'near-api-js';
import { handleMint } from '../../state/actions';
import {
	isAccountTaken,
	networkId,
} from '../../utils/near-utils';
import {
	Button,
	TextField,
	Container,
	Grid, CircularProgress,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import ImageUpload from "../common/ImageUpload";

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
					<h4>Create your NFT</h4>
					<div className={"form-control"}>
					<TextField variant={"outlined"} fullWidth label={"Title"} value={title} onChange={(e) => setTitle(e.target.value)} />
					</div>
					<div className={"form-control"}>
					<TextField variant={"outlined"} fullWidth label={"description"} value={description} onChange={(e) => setDescription(e.target.value)} multiline={true} />
					</div>

					<div className={"form-control"}>
						<label>Upload file</label>
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
					<Button disabled={isLoading} variant={"contained"} onClick={() => { setIsLoading(false); handleMint(account, royalties, media, validMedia, title, description)}}>
						{isLoading && <CircularProgress size={14} />}
						{!isLoading && 'Create NFT'}
					</Button>


				</Grid>
				<Grid item xs={4}>
					<h4>Preview</h4>
					{/*<img src={media} onLoad={() => setValidMedia(true)} onError={() => setValidMedia(false)} />*/}
					<Card
						sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
					>
						{ media && <img src={URL.createObjectURL(media)} onLoad={() => setValidMedia(true)} onError={() => setValidMedia(false)} /> }
						<CardContent sx={{ flexGrow: 1 }}>
							<Typography gutterBottom variant="h5" component="h2">
								{ title }
							</Typography>
							<Typography gutterBottom>
								{account.accountId}
							</Typography>
							<Typography>
								{ description }
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

