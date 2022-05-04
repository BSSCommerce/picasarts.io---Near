import React, { useState, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase'
import Notification from "./Notification";
import { appStore } from '../../state/app';
import { Wallet } from "../nft/Wallet";
import NextLink from 'next/link';
import logoWhite from "src/public/static/logo_white.svg";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NearIcon from '../icons/NearIcon';
import AuroraIcon from '../icons/AuroraIcon';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const pages = [
    {
        label: "Explore", children: [
            { url: "/all-nfts", label: "All NFTs" },
            { url: "/collections", label: "Collections" },
            { url: "/activities", label: "Activities" },
        ]
    },
    {
        label: "Factory", children: [
            { url: "/factory", label: "All FTs" },
            { url: "/factory/create", label: "Create new FT" },
        ]
    },
    {
        label: "Stake", children: [
            { url: "/stake", label: "All Farm" },
            { url: "/stake/my-farms", label: "My farms" },
            { url: "/stake/create", label: "Create new farm" },
        ]
    },
    { url: "/create", label: "Create NFT" },
];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElPage, setAnchorElPage] = React.useState(null);
    const [anchorElNetwork, setAnchorElNetwork] = React.useState(null);
    const [pageOpen, setPageOpen] = React.useState(-1);

    const [profile, setProfile] = useState(false);
    const { state, dispatch } = useContext(appStore);

    const { app, views, app: { tab, snack }, near, wallet, contractAccount, account, loading } = state;

    const signedIn = ((wallet && wallet.signedIn));

    if (profile && !signedIn) {
        setProfile(false);
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenPageMenu = (event, index) => {
        setAnchorElPage(event.currentTarget);
        setPageOpen(index);
    };

    const handleClosePageMenu = () => {
        setAnchorElPage(null);
        setPageOpen(-1);
    };

    const handleOpenNetworkMenu = (event) => {
        setAnchorElNetwork(event.currentTarget);
    };

    const handleCloseNetworkMenu = () => {
        setAnchorElNetwork(null);
    };

    const pageList = pages.map((page, index) => {
        if (!page.children) {
            return <MenuItem key={page.url} onClick={handleCloseNavMenu}>
                <NextLink href={page.url} as={page.url}>
                    <Typography textAlign="center">{page.label}</Typography>
                </NextLink>
            </MenuItem>
        }
        return <div><Button
            sx={{ color: 'white', px: 2, textTransform: 'none', fontSize: '1rem', fontWeight: 400 }}
            key={page.label}
            aria-controls={page.label}
            aria-haspopup="true"
            aria-expanded={pageOpen == index ? 'true' : undefined}
            disableElevation
            onClick={(e) => handleOpenPageMenu(e, index)}
            endIcon={<KeyboardArrowDownIcon />}
        >
            {page.label}
        </Button>
            <Menu
                anchorEl={anchorElPage}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorElPage) && index == pageOpen}
                onClose={handleClosePageMenu}
            >
                {page.children.map(child =>
                    <NextLink key={`${child.url}_link`} href={child.url}
                        as={child.url}>
                        <MenuItem key={child.url}>
                            {child.label}
                        </MenuItem>
                    </NextLink>
                )
                }
            </Menu>
        </div >
    })
    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <NextLink href={"/"} as={`/`}>
                        <img src={logoWhite.src} width={100} />
                    </NextLink>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pageList}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pageList}
                    </Box>
                    <Button
                        variant={"outlined"}
                        sx={{ color: "white", borderColor: "white", mr: 1 }}
                        onClick={handleOpenNetworkMenu}
                        startIcon={<NearIcon fontSize="small" />}
                    >
                        NEAR
                    </Button>
                    <Menu
                        anchorEl={anchorElNetwork}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNetwork)}
                        onClose={handleCloseNetworkMenu}
                    >
                        <MenuItem key={'near'}>
                            <ListItemIcon>
                                <NearIcon fontSize={'small'} />
                            </ListItemIcon>
                            <Typography textAlign={"Left"}>NEAR</Typography>
                        </MenuItem>
                        <NextLink key={'aurora'} href={"https://aurora.picasarts.io"}
                            as={"https://aurora.picasarts.io"}
                        >
                            <MenuItem key={'aurora'}>
                                <ListItemIcon>
                                    <AuroraIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography textAlign={"Left"}>AURORA</Typography>
                            </MenuItem>
                        </NextLink>
                    </Menu>
                    {/* {signedIn && <Notification accountId={account.accountId} />} */}
                    <Box sx={{ display: "flex", flexGrow: 0 }}>
                        {!signedIn ? <Wallet {...{ wallet, account, handleOpenUserMenu }} /> : <Wallet {...{ wallet, account, handleOpenUserMenu }} />}
                        {signedIn && <Menu
                            sx={{ mt: '50px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem key={"menu-nft-collection"}>
                                <ListItemIcon>
                                    <DashboardIcon fontSize="small" />
                                </ListItemIcon>
                                <NextLink key={`${account.accountId}_collection_link`} href={"/collection/[owner_id]"}
                                    as={`/collection/${account.accountId}`}
                                    className={"nft-author-name"}><Typography textAlign={"Left"}>My NFTs</Typography></NextLink>
                            </MenuItem>
                            <MenuItem key={"menu-account-settings"}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                <NextLink href={"/account/settings"}><Typography
                                    textAlign={"Left"}>Settings</Typography></NextLink>
                            </MenuItem>
                            <Divider />
                            <MenuItem key={"menu-account-logout"} onClick={() => wallet.signOut()}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography textAlign={"Left"}>Logout</Typography>
                            </MenuItem>
                        </Menu>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;