import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { appStore, onAppMount } from 'src/state/app';

import { useRouter } from 'next/router'
import { CreateFarm } from 'src/components/stake/CreateFarm';
import { AddReward } from 'src/components/stake/AddReward';

export default function Create() {
    const router = useRouter();
    const { farm_index, seed_id } = router.query;
    const { state, dispatch } = useContext(appStore);
    const { account, contractAccount } = state;
    const onMount = () => {
        dispatch(onAppMount());
    };

    const [activeStep, setActiveStep] = useState(0);

    useEffect(onMount, []);
    useEffect(() => {
        if (farm_index && seed_id) {
            setActiveStep(1);
        }
    });
    return (
        <Container maxWidth="lg" component={Paper}
            sx={{
                bgcolor: 'background.paper',
                pt: 4,
                pb: 6,
                my: 4
            }}>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    <Step key={'create-farm'}>
                        <StepLabel>Create Farm</StepLabel>
                    </Step>
                    <Step key={'add-reward'}>
                        <StepLabel>Add Rewards</StepLabel>
                    </Step>
                </Stepper>
                {activeStep == 0 && <CreateFarm contractAccount={contractAccount} account={account} />}
                {activeStep == 1 && <AddReward contractAccount={contractAccount} account={account} farm_index={farm_index} seed_id={seed_id} />}
            </Box>
        </Container>
    );
}
