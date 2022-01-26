import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProfileForm from "../../components/account/ProfileForm";
import NotLoggedIn from "../../components/common/NotLoggedIn";
import {useContext, useEffect} from "react";
import {appStore, onAppMount} from "../../state/app";
import {Grid} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Settings() {
    const { state, dispatch, update } = useContext(appStore);

    const { near, wallet, account, loading } = state;

    const onMount = () => {
        dispatch(onAppMount());
    };
    useEffect(onMount, []);
    const signedIn = ((wallet && wallet.signedIn));
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<AccountCircleIcon />}  label={"Profile"} {...a11yProps(0)}/>
                    <Tab icon={<CircleNotificationsIcon />} label="Notifications" {...a11yProps(1)} />
                    <Tab icon={<LocalOfferIcon />} label="Offer" {...a11yProps(2)} />
                    <Tab icon={<AdminPanelSettingsIcon />} label="Account Support" {...a11yProps(3)} />
                </Tabs>
            </Grid>
            <Grid item xs={10}>
                <TabPanel value={value} index={0} style={{width: "100%"}}>
                    { signedIn && <ProfileForm account={account}/> }
                    {
                        !signedIn && <NotLoggedIn wallet={wallet} />
                    }
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Upcoming Features
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Upcoming Features
                </TabPanel>
                <TabPanel value={value} index={3}>
                    Upcoming Features
                </TabPanel>
            </Grid>

        </Grid>
    );
}
