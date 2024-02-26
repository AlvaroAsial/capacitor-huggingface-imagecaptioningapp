import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import HistoryIcon from '@mui/icons-material/History';

const Menu: React.FC = ({ handleImageCaptioning, handleImageUpload, handleCheckCaptions }) => {
    return (
            <Grid
                container
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item>
                    <Typography variant="h4" align="center" gutterBottom>
                        Welcome :)
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PhotoCameraIcon />}
                        onClick={handleImageCaptioning}
                    >
                        Caption with Camera
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PhotoLibraryIcon />}
                        onClick={handleImageUpload}
                    >
                        Caption from Gallery
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<HistoryIcon />}
                        onClick={handleCheckCaptions}
                    >
                        Check Previous Captions
                    </Button>
                </Grid>
            </Grid>
    );
};

export default Menu;