import React from 'react';
import { CircularProgress, Grid } from '@mui/material';
import Box from '@mui/material/Box';

const Loading: React.FC = () => {
    return (
        <Grid
                container
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
            <Box sx={{ display: 'flex' }}>
                <CircularProgress color="secondary" />
            </Box>
        </Grid>
    );
};

export default Loading;