import React, {useCallback, useEffect, useState} from 'react';
import {
    Button,
    TextField,
    Container,
    Grid,
    CircularProgress,
    CardHeader,
    Avatar,
    Card,
    CardContent,
    Typography,
    CardMedia,
    Alert
} from "@mui/material";
import ImageUpload from "src/components/common/ImageUpload";
import { uploadToCrust } from "near-crust-ipfs";
export default function ProfileForm({ account }) {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
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
    const [collectionName, setCollectionName] = useState("");
    const [isSuccessSave, setIsSuccessSave] = useState(0);
    async function fetchData(accountId) {
        let getProfileReq = await fetch(`/api/profile/get/${accountId}`);
        let data = await getProfileReq.json();
        if (getProfileReq.status !== 200) {
            throw new Error(data.message)
        }
        if (data) {
            setEmail(data.email);
            setBio(data.bio);
            setWebsite(data.website);
            setLogo(data.logo);
            setBanner(data.banner);
            setCollectionName(data.collection_name)
        }
    }

    useEffect(() => {
        if (isFirstLoading) {
            setIsFirstLoading(false);
            fetchData(account.accountId)
        }
    }, [isFirstLoading])

    const handleSave = useCallback(async () => {
        setIsLoading(true);
        let [uploadedLogo, uploadedBanner] = await Promise.all([
            logo ? uploadToCrust(logo) : () => {},
            banner ? uploadToCrust(banner) : () => {}
        ]);
        let logoPath = logo ? uploadedLogo.path : "";
        let bannerPath = banner ? uploadedBanner.path : "";
        let res = await fetch("/api/profile/create-or-update", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_id: account.accountId,
                email: email,
                bio: bio,
                website: website,
                logo: logoPath,
                banner: bannerPath,
                twitter,
                instagram,
                walletAddress,
                collectionName: collectionName
            })
        });
        if (res.status !== 200) {
            setIsSuccessSave(1);
        } else {
            setIsSuccessSave(2)
        }
        setIsLoading(false);
    }, [isLoading, email, bio, website, logo, banner, collectionName, isSuccessSave])
    return (
            <Grid className={"profile-settings-form"} container spacing={2}>
                <Grid item xs={6}>
                    <h4>Profile Settings</h4>
                    <div className={"form-control"}>
                    {
                        isSuccessSave === 2 && <Alert severity="success">Save profile information successfully</Alert>
                    }
                    {
                        isSuccessSave === 1 && <Alert severity="success">Fail to save profile information</Alert>
                    }
                    </div>
                    <div className={"form-control"}>
                        <TextField variant={"outlined"} fullWidth label={"Collection Name"} value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
                    </div>
                    <div className={"form-control"}>
                        <TextField variant={"outlined"} fullWidth label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={"form-control"}>
                        <TextField variant={"outlined"} fullWidth label={"Bio"} value={bio} onChange={(e) => setBio(e.target.value)} multiline={true} />
                    </div>

                    <TextField variant={"outlined"} fullWidth label={"Website"} value={website} onChange={(e) => setWebsite(e.target.value)} multiline={true} />
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
                <Grid item xs={6}>
                    <h4>Your Dashboard Preview</h4>
                    <div className={"picasart-profile-banner"}>
                        <Card sx={{ maxWidth: "100%" }}>

                            { banner ?

                                <CardMedia
                                    component="img"
                                    height="190"
                                    image={(typeof banner === 'string') ? banner : URL.createObjectURL(banner)}
                                    alt="green iguana"
                                />
                                : <CardMedia
                                    component="img"
                                    height="190"
                                    image={"https://source.unsplash.com/random"}
                                    alt="green iguana"
                                />
                            }
                            <CardContent>
                                <div className={"picasart-avatar"}>
                                    {
                                        logo ? <Avatar
                                            alt="Remy Sharp"
                                            src={(typeof logo === 'string') ? logo : URL.createObjectURL(logo)}
                                            sx={{ width: 56, height: 56 }}
                                        /> : <Avatar
                                        alt="Remy Sharp"
                                        src={"https://source.unsplash.com/random"}
                                        sx={{ width: 56, height: 56 }}
                                        />
                                    }
                                </div>
                                <div className={"picasart-name-bio"}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {collectionName ? collectionName : account.accountId}
                                    </Typography>
                                    <Typography gutterBottom variant="p" component="div">
                                        By {account.accountId}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {
                                            bio ? bio : "[This is your bio description]"
                                        }
                                    </Typography>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </Grid>

            </Grid>
        )
}

