import React, {useState} from 'react';
import useSWR from 'swr';
import {
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import NotificationList from 'src/components/common/NotificationList';

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

export default function NotificationTab({ accountId }) {
    const { data, error } = useSWR(`/api/notification/${accountId}?limit=100`,
        fetcher
    )
    if (error) return <div></div>

    return (
        <>
            <NotificationList
                accountId={accountId} 
                data={data ? data : []} />
        </>
    )
}