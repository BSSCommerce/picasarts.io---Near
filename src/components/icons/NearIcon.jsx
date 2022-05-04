import React from 'react';
import NearLogo from 'src/public/static/icons/near.svg';
import Icon from '@mui/material/Icon';

export default function NearIcon(props) {
    return (
        <Icon {...props} sx={{ textAlign: 'center' }}>
            <img src={NearLogo.src} style={{ display: 'flex', width: 'inherit', height: 'inherit' }} />
        </Icon>
    );
};