import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; 
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import CaptionedImage from '.js/components/CaptionedImage';

const App: React.FC = () => {

    const [selectedImageUri, setSelectedImageUri] = useState<string>('');

    const handleImageCaptioning = () => {
        Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera
        }).then(image => {
            console.log('Captured image:', image.webPath);
        }).catch(error => {
            console.error('Error capturing photo:', error);
        });
    };

    const handleImageUpload = () => {
        Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos
        }).then(image => {
            console.log('Uploaded image:', image.webPath);
        }).catch(error => {
            console.error('Error getting photo:', error);
        });
    };

    const handleCheckCaptions = () => {
    };

    return (
        <Container maxWidth="sm">
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
                        startIcon={<PhotoCameraIcon/>} 
                        onClick={handleImageCaptioning}
                    >
                        Caption with Camera
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PhotoLibraryIcon/>} 
                        onClick={handleImageUpload}
                    >
                        Caption from Gallery
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary" 
                        startIcon={<HistoryIcon/>} 
                        onClick={handleCheckCaptions}
                    >
                        Check Previous Captions
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default App;