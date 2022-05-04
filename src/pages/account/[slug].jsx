import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProfileForm from "../../components/account/ProfileForm";
import NotLoggedIn from "../../components/common/NotLoggedIn";
import NotificationTab from "../../components/account/NotificationTab";
import {useContext, useEffect} from "react";
import {appStore, onAppMount} from "../../state/app";
import {Grid} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Router from "next/router";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Account({slug}) {
    const { state, dispatch, update } = useContext(appStore);

    const { near, wallet, account, loading } = state;

    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);
    const signedIn = ((wallet && wallet.signedIn));

    const handleChange = (event, newValue) => {
        Router.push(`/account/${newValue}`);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={slug}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Tab value="profile" icon={<AccountCircleIcon />}  label={"Profile"} {...a11yProps(0)}/>
                    <Tab value="notification" icon={<CircleNotificationsIcon />} label="Notifications" {...a11yProps(1)} />
                    <Tab value="offer" icon={<LocalOfferIcon />} label="Offer" {...a11yProps(2)} />
                    <Tab value="account-support" icon={<AdminPanelSettingsIcon />} label="Account Support" {...a11yProps(3)} />
                </Tabs>
            </Grid>
            <Grid item xs={10}>
                <TabPanel value={slug} index="profile" style={{width: "100%"}}>
                    { signedIn && <ProfileForm account={account}/> }
                    {
                        !signedIn && <NotLoggedIn wallet={wallet} />
                    }
                </TabPanel>
                <TabPanel value={slug} index="notification">
                    { signedIn && <NotificationTab accountId={account.accountId}/> }
                </TabPanel>
                <TabPanel value={slug} index="offer">
                    Upcoming Features {slug}
                </TabPanel>
                <TabPanel value={slug} index="account-support">
                    Upcoming Features {slug}
                </TabPanel>
            </Grid>
        </Grid>
    );
}
Account.getInitialProps = async ({query}) => {
    return {
        slug: query.slug
    }
}