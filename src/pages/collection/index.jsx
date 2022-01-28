import useSWR from 'swr'
import All from "src/components/collection/All";
import {Box, Container} from "@mui/material";

const fetcher = async (url) => {
    const res = await fetch(url)
    const data = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}
export default function Index() {
    const { data, error } = useSWR(`/api/collection/all`,
        fetcher
    )

    if (error) return <div>{error.message}</div>
    if (!data) return <div>Loading...</div>
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
            <Container maxWidth="lg">
                <All collections={data} />
            </Container>
        </Box>
    )
}