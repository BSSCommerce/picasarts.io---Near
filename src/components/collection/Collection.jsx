import {Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import React from "react";

export default function Collection({collection}) {
    return (
        <Grid item key={collection.collection_id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => {}}>



                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "white" }} aria-label="recipe">
                            <img src={collection.logo} onLoad={() => {}} onError={
                                ({target}) => { target.onerror = null;target.src='https://source.unsplash.com/random' }
                            } />
                        </Avatar>
                    }
                    title={collection.name}
                    subheader={collection.account_id}
                />
                <img src={collection.banner} onLoad={() => {}} onError={
                    ({target}) => { target.onerror = null;target.src='https://source.unsplash.com/random' }
                } />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {collection.description}
                    </Typography>
                </CardContent>
            </Card>





        </Grid>
    )
}