import Collection from "./Collection";
import {Grid} from "@mui/material";

export default function All({collections}) {
    return (
        <Grid container spacing={2} >
            {
                collections.map((collection) => {
                    return <Collection collection={collection}/>

                })
            }
        </Grid>

    )
}