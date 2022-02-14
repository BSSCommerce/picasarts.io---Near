import useSWR from 'swr';
import Container from "@mui/material/Container";
import All from "./All";
import Typography from "@mui/material/Typography";
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
export default function LatestCollections() {
    const { data, error } = useSWR(`/api/collection/all?limit=4`,
        fetcher
    )
    if (error) return <div></div>
    if (!data) return <div>Loading...</div>
    return (
        <>
            {data.length && <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ textAlign: "center" }}
            >
                Latest Collections
            </Typography>}
            <br/>
            <All collections={data} />
        </>

    )
}