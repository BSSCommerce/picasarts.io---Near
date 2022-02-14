import React, {useEffect, useState} from "react";
import All from "../components/collection/All";
import useSWR from 'swr';
import Container from "@mui/material/Container";
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
export default function Collections() {
    const { data, error } = useSWR(`/api/collection/all`,
        fetcher
    )
    if (error) return <div></div>
    if (!data) return <div>Loading...</div>
    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <All collections={data} />
        </Container>
    )
}