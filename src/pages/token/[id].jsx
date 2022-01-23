import React, {useContext, useEffect, useState} from "react";
import { appStore, onAppMount} from '../../state/app';
import { TokenInformation } from "src/components/nft/TokenInformation";
export default function NftPage({id}) {
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state, update } = useContext(appStore);
    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;
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
        !isLoading && <TokenInformation {...{ app, views, update, loading, contractAccount, account, dispatch, id }} />

    )
}

NftPage.getInitialProps = async ({query}) => {
    return {
        id: query.id
    }
}