import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import CaptionedImage from './components/CaptionedImage';
import Loading from './components/Loading';
import Menu from './components/Menu';
import fetchImageCaption from './APIHelpers'
import { decode } from "base64-arraybuffer";
import useSQLiteDB from './useSQLiteDB';
import CaptionHistory from './components/CaptionHistory';

const App: React.FC = () => {

    interface ImageCaption {
        image: '';
        caption: '';
    }

    const [selectedImageCaption, setSelectedImageCaption] = useState<ImageCaption>({caption:'',image:''} as ImageCaption);
    const [isCaptioning, setIsCaptioning] = useState(false);
    const [checkingHistory, setCheckingHistory] = useState(false);
    const { performSQLAction } = useSQLiteDB();

    const handleImageCaptioning = async (selectedImage) => {
        setIsCaptioning(true); 
        try {
            const result = await fetchImageCaption(selectedImage);
            return result;
        } catch (error) {
            console.error('Error captioning image:', error);
            setIsCaptioning(false);
            setSelectedImageCaption({} as ImageCaption);
        }
    };

    const handleImageCapture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera
        })
        const blob = new Blob([new Uint8Array(decode(image.base64String))], {
            type: `image/${image.format}`,
        });
        const result = await handleImageCaptioning(blob);
        await performSQLAction(async (db) => {
            await db?.query(`INSERT INTO pastCaptions(caption, image, format) VALUES('${result[0]['generated_text']}', '${image.base64String}', '${image.format}');`);
        }, null);
        await setSelectedImageCaption({ caption: result[0]['generated_text'], image: URL.createObjectURL(blob) }); 

    };

    const handleImageUpload = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Photos
        })
        const blob = new Blob([new Uint8Array(decode(image.base64String))], {
            type: `image/${image.format}`,
        });
        const result = await handleImageCaptioning(blob); 
        await performSQLAction(async (db) => {
            await db?.query(`INSERT INTO pastCaptions(caption, image, format) VALUES('${result[0]['generated_text']}', '${image.base64String}','${image.format}');`);
        }, null);
        await setSelectedImageCaption({ caption: result[0]['generated_text'], image: URL.createObjectURL(blob) }); 
    };

    const handleCheckCaptions = () => {
        console.log(1)
        setCheckingHistory(true);
    };

    const handleClose = async () => {
        await setSelectedImageCaption({ caption: '', image: '' } as ImageCaption);
        await setIsCaptioning(false);
        await setCheckingHistory(false);
    };

    return (
        <Container maxWidth="sm">
            {!isCaptioning && !checkingHistory ?
                <Menu handleImageCaptioning={handleImageCapture} handleImageUpload={handleImageUpload} handleCheckCaptions={handleCheckCaptions} />
                :
                (!isCaptioning && checkingHistory) ? <CaptionHistory onClose={handleClose} performSQLAction={performSQLAction} /> : null
            }
            {isCaptioning && selectedImageCaption.caption === '' && <Loading />}
            {isCaptioning && selectedImageCaption.caption !== '' && <CaptionedImage onClose={handleClose} imageCaption={selectedImageCaption} />}
        </Container>
    );
};

export default App;