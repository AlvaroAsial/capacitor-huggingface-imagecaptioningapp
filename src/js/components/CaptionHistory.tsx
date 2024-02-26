import React, { useEffect, useState } from 'react';
import { Grid, Typography, IconButton, Box, AppBar, Toolbar, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { decode } from "base64-arraybuffer";

const CaptionHistory = ({ performSQLAction, onClose }) => {

    const [data, setData] = useState([]);
        const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    useEffect(() => {
        const loadData = async () => {
            await performSQLAction(async (db: SQLiteConnection | null) => {
                const jsonData = JSON.parse(JSON.stringify(await db?.query(`SELECT * FROM pastCaptions`)));
                const parsedData = jsonData.values.map(item => ({
                    ...item,
                    image: URL.createObjectURL(new Blob([new Uint8Array(decode(item.image))], {
                        type: `image/${item.format}`,
                    }))
                }));
                console.log(jsonData.values)
                setData(parsedData.reverse())
            });
        }
        loadData();
    }, []);

    return (
        <div style={{ height: '100vh', overflowY: 'scroll' }}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: '#333333' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
            <Grid container spacing={2} justifyContent="center" alignItems="flex-start">
                {data.map((item, index) => (
                    <Grid item key={index} xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                            onClick={() => handleImageClick(item)}
                            style={{
                                width: '100%',
                                height: '0',
                                paddingBottom: '100%', 
                                position: 'relative',
                                cursor: 'pointer',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={item.image}
                                alt={`Captioned Image ${index}`}
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', 
                                }}
                            />
                        </div>
                    </Grid>
                ))}
            </Grid>
            <Modal
                open={Boolean(selectedImage)}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', top: 0, left: 0, color: 'black' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedImage && (
                        <>
                            <img
                                src={selectedImage.image}
                                alt={`Selected Image`}
                                style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '40px' }}
                            />
                            <Typography variant="subtitle1" align="center" style={{ marginTop: '16px', color: '#616161' }}>
                                {selectedImage.caption}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default CaptionHistory;