import React, {useState, useContext} from 'react';
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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase'
const pages = ['All NFTs', "Collections", 'Create'];
const settings = ['Dashboard', 'Settings', 'Logout'];
import { appStore } from '../../state/app';
import {Wallet} from "../nft/Wallet";
import NextLink from 'next/link';
import logoWhite from "src/public/static/logo_white.svg";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import {formatAccountId} from "../../utils/near-utils";
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
const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [profile, setProfile] = useState(false);
    const { state, dispatch } = useContext(appStore);

    const { app, views, app: {tab, snack}, near, wallet, contractAccount, account, loading } = state;

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
    const pageList = pages.map((page) => {
            let url = "/";
            if (page == pages[0]) {
                url = "/all-nfts";
            } else if (page == pages[1]) {
                url = "/collections";
            } else {
                url = "/create"
            }
            return <MenuItem key={page} onClick={handleCloseNavMenu}>

                <NextLink href={url} as={url}>
                    <Typography textAlign="center">{page}</Typography>
                </NextLink>


            </MenuItem>
        })
    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                        <NextLink href={"/"} as={`/`}>
                            <img src={logoWhite.src} width={100}/>
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

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        LOGO
                    </Typography>
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

                    <Box sx={{ display: "flex", flexGrow: 0 }}>
                        {!signedIn ? <Wallet {...{ wallet, account, handleOpenUserMenu }} /> : <Wallet {...{ wallet, account, handleOpenUserMenu  }} />}
                        <Button variant={"text"} sx={{color: "white"}} onClick={() => window.open("https://aurora.picasarts.io", "__blank")}>NFT Marketplace on AURORA</Button>
                        {signedIn && <Menu
                            sx={{mt: '50px'}}
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
                                    <DashboardIcon fontSize="small"/>
                                </ListItemIcon>
                                <NextLink key={`${account.accountId}_collection_link`} href={"/collection/[owner_id]"}
                                          as={`/collection/${account.accountId}`}
                                          className={"nft-author-name"}><Typography textAlign={"Left"}>My NFTs</Typography></NextLink>
                            </MenuItem>
                            <MenuItem key={"menu-account-settings"}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small"/>
                                </ListItemIcon>
                                <NextLink href={"/account/settings"}><Typography
                                    textAlign={"Left"}>Settings</Typography></NextLink>
                            </MenuItem>
                            <Divider/>
                            <MenuItem key={"menu-account-logout"} onClick={() => wallet.signOut()}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small"/>
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