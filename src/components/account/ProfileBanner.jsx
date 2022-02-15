import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Avatar
} from "@mui/material";
import useSWR from 'swr'
import React from "react";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
const fetcher = async (url) => {
    let data = null;
    try {
        const res = await fetch(url);
        data = await res.json()
        if (res.status !== 200) {
            throw new Error(data.message)
        }
        console.log(data)
    } catch (e) {
        console.log(e)
    }

    return data
}
export default function ProfileBanner({ownerId}) {
    const { data, error } = useSWR(`/api/profile/get/${ownerId}`,
        fetcher
    )
    if (error) return <div></div>
    if (!data) return <Container maxWidth="md">
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
    </Container>
    return (
        <div className={"picasart-profile-banner"}>
            <Card sx={{maxWidth: "100%"}}>
                {data.banner ?

                    <CardMedia
                        component="img"
                        height="250"
                        image={data.banner}
                        alt={ownerId}
                    />
                    : <CardMedia
                        component="img"
                        height="250"
                        image={"https://source.unsplash.com/random"}
                        alt={ownerId}
                    />
                }
                <CardContent>
                    <div className={"picasart-avatar"}>
                        {
                            data.logo ? <Avatar
                                alt={ownerId}
                                src={data.logo}
                                sx={{width: 56, height: 56}}
                            /> : <Avatar
                                alt={ownerId}
                                src={"https://source.unsplash.com/random"}
                                sx={{width: 56, height: 56}}
                            />
                        }
                    </div>
                    <div className={"picasart-name-bio"}>
                        <Typography gutterBottom variant="h5" component="div">
                            {data.collection_name ? data.collection_name : ownerId}
                        </Typography>
                        <Typography gutterBottom variant="p" component="div">
                            by {ownerId}
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