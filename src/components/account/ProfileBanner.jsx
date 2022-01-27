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
    const res = await fetch(url)
    const data = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
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
            <Card sx={{ maxWidth: "100%" }}>
                { data.banner ?

                    <CardMedia
                        component="img"
                        height="250"
                        image={data.banner}
                        alt="green iguana"
                    />
                    : <CardMedia
                        component="img"
                        height="250"
                        image={"https://source.unsplash.com/random"}
                        alt="green iguana"
                    />
                }
                <CardContent>
                    <div className={"picasart-avatar"}>
                        {
                            data.logo ? <Avatar
                                alt="Remy Sharp"
                                src={data.logo}
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
                            {data.account_id}
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