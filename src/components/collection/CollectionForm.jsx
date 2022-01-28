import React, {useCallback, useEffect, useState} from 'react';
import {
    Button,
    TextField,
    Container,
    Grid, CircularProgress, CardHeader, Avatar,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ImageUpload from "src/components/common/ImageUpload";
import { uploadToCrust } from "near-crust-ipfs";

export default function CollectionForm({ account }) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [validLogoMedia, setValidLogoMedia] = useState(false);
    const [validBannerMedia, setValidBannerMedia] = useState(false);
    const handleSave = useCallback(async () => {
        // let [uploadedLogo, uploadedBanner] = await Promise.all([
        //     uploadToCrust(logo),
        //     uploadToCrust(banner)
        // ]);
        // let logoPath = uploadedLogo.path;
        // let bannerPath = uploadedBanner.path;
        /*let res = await fetch("/api/collection/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                logo: logoPath,
                banner: bannerPath,
                account_id: accountId,
                collection_id: new Date().getTime()
            })
        });*/
        console.log(account.accountId)
        // if (res.status !== 200) {
        //     console.log("Wrong")
        // }
        setIsLoading(false);
    }, [isLoading])
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <h4>Create New Collection</h4>
                    <TextField variant={"standard"} fullWidth placeholder={"name"} value={name} onChange={(e) => setName(e.target.value)} />
                    <br/>
                    <TextField variant={"standard"} fullWidth placeholder={"description"} value={description} onChange={(e) => setDescription(e.target.value)} multiline={true} />
                    <br/>
                    <ImageUpload setMedia={setLogo}/>
                    <ImageUpload setMedia={setBanner}/>

                    { !validLogoMedia && <p>Image link is invalid.</p> }
                    { !validBannerMedia && <p>Image link is invalid.</p> }
                    <br/>
                    <Button disabled={isLoading} variant={"contained"} onClick={() => { handleSave()}}>
                        {isLoading && <CircularProgress size={14} />}
                        {!isLoading && 'Save'}
                    </Button>


                </Grid>
                <Grid item xs={4}>
                    <h4>Preview</h4>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar key={"new-collection-avatar"} sx={{ bgcolor: "white" }} aria-label="recipe">
                                    { logo && <img key={"new-collection-logo"} src={URL.createObjectURL(logo)} onLoad={() => setValidLogoMedia(true)} onError={() => setValidLogoMedia(false)} /> }
                                </Avatar>
                            }
                            title={name}
                            subheader={account.accountId}
                        />
                        { banner && <img key={"new-collection-banner"} src={URL.createObjectURL(banner)} onLoad={() => setValidBannerMedia(true)} onError={() => setValidBannerMedia(false) } /> }
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Container>)
}

