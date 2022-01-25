import React, {useCallback, useEffect, useState} from 'react';
import {
    Button,
    TextField,
    Container,
    Grid, CircularProgress, CardHeader, Avatar,
} from "@mui/material";
import ImageUpload from "src/components/common/ImageUpload";

export default function ProfileForm({ account }) {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [instagram, setInstagram] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [validLogoMedia, setValidLogoMedia] = useState(true);
    const [validBannerMedia, setValidBannerMedia] = useState(true);
    const handleSave = useCallback(async () => {
        /// let [uploadedLogo, uploadedBanner] = await Promise.all([
        //     uploadToCrust(logo),
        //     uploadToCrust(banner)
        // ]);
        // let logoPath = uploadedLogo.path;
        // let bannerPath = uploadedBanner.path;
        let res = await fetch("/api/profile/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_id: account.accountId,
                email: email,
                bio,
                website,
                logo,
                banner,
                twitter,
                instagram,
                walletAddress
            })
        });
        console.log(account.accountId)
        if (res.status !== 200) {
            console.log("could not create profile")
        }
        setIsLoading(false);
    }, [isLoading])
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h4>Update your profile</h4>
                    <div className={"form-control"}>
                        <TextField variant={"standard"} fullWidth placeholder={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={"form-control"}>
                        <TextField variant={"standard"} fullWidth placeholder={"bio"} value={bio} onChange={(e) => setBio(e.target.value)} multiline={true} />
                    </div>

                    <TextField variant={"standard"} fullWidth placeholder={"website"} value={website} onChange={(e) => setWebsite(e.target.value)} multiline={true} />
                    <br/>
                    <div className={"form-control"}>
                        <label>Upload profile logo</label>
                        <ImageUpload setMedia={setLogo}/>
                        { !validLogoMedia && <p>Image link is invalid.</p> }
                    </div>
                    <div className={"form-control"}>
                        <label>Upload profile banner</label>
                        <ImageUpload setMedia={setBanner}/>
                        { !validBannerMedia && <p>Image link is invalid.</p> }
                    </div>
                    <br/>
                    <Button disabled={isLoading} variant={"contained"} onClick={() => handleSave()}>
                        {isLoading && <CircularProgress size={14} />}
                        {!isLoading && 'Save'}
                    </Button>


                </Grid>
                {/*<Grid item xs={4}>
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
                </Grid>*/}

            </Grid>
        </Container>)
}

