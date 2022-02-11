import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Avatar
} from "@mui/material";
import useSWR from 'swr'
import React from "react";
const fetcher = async (url) => {
    let data = null;
    try {
        const res = await fetch(url);
        data = await res.json()
        if (res.status !== 200) {
            throw new Error(data.message)
        }
    } catch (e) {
        console.log(e)
    }

    return data
}
export default function ProfileBanner({account}) {
    const { data, error } = useSWR(`/api/profile/get/${account.accountId}`,
        fetcher
    )
    if (error) return <div></div>
    if (!data) return <div>Loading...</div>
    return (
        <div className={"picasart-profile-banner"}>
            <Card sx={{maxWidth: "100%"}}>
                {data.banner ?

                    <CardMedia
                        component="img"
                        height="250"
                        image={data.banner}
                        alt={account.accountId}
                    />
                    : <CardMedia
                        component="img"
                        height="250"
                        image={"https://source.unsplash.com/random"}
                        alt={account.accountId}
                    />
                }
                <CardContent>
                    <div className={"picasart-avatar"}>
                        {
                            data.logo ? <Avatar
                                alt={account.accountId}
                                src={data.logo}
                                sx={{width: 56, height: 56}}
                            /> : <Avatar
                                alt={account.accountId}
                                src={"https://source.unsplash.com/random"}
                                sx={{width: 56, height: 56}}
                            />
                        }
                    </div>
                    <div className={"picasart-name-bio"}>
                        <Typography gutterBottom variant="h5" component="div">
                            {data.collection_name ? data.collection_name : account.accountId}
                        </Typography>
                        <Typography gutterBottom variant="p" component="div">
                            by {account.accountId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data.bio}
                        </Typography>
                    </div>

                </CardContent>
            </Card>
        </div>

    )
}