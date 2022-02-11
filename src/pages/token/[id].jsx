import React, {useContext, useEffect, useState} from "react";
import { appStore, onAppMount} from '../../state/app';
import { TokenInformation } from "src/components/nft/TokenInformation";
import useSWR from 'swr';
export default function NftPage({id}) {
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state, update } = useContext(appStore);
    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
    const { data } = useSWR(
        `/api/google/pageview-count?post=${encodeURIComponent(`/token/${id}/`)}`,
        async url => {
            const res = await fetch(url)
            return res.json()
        },
        { revalidateOnFocus: false },
    )
    const viewCount = data?.pageViews
    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect( () => {
        if (isLoading) {
            onMount();
            setIsLoading(false);
        }

    }, [isLoading]);

    return (

        !isLoading && <TokenInformation {...{ app, views, update, loading, contractAccount, account, dispatch, id, viewCount }} />

    )
}

NftPage.getInitialProps = async ({query}) => {
    return {
        id: query.id
    }
}