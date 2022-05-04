import React from 'react';
import AuroraLogo from 'src/public/static/icons/aurora.svg';
import Icon from '@mui/material/Icon';

export default function AuroraIcon(props) {
    return (
        <Icon {...props} sx={{ textAlign: 'center' }}>
            <img src={AuroraLogo.src} style={{ display: 'flex', width: 'inherit', height: 'inherit' }} />
        </Icon>
    );
};