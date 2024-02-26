import React, { useEffect, useState } from 'react';
import { Grid, Typography, IconButton, Box, AppBar, Toolbar, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { decode } from "base64-arraybuffer";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const CaptionHistory = ({ performSQLAction, onClose }) => {

    const [data, setData] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirm, setConfirm] = useState(false);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const deleteCaptions = () => {
        const deleteData = async () => {
            await performSQLAction(async (db: SQLiteConnection | null) => {
                await db?.query(`DELETE FROM pastCaptions`);
                setData([]);
            });
        }
        setConfirm(false);
        deleteData();
        loadData();       
    };

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

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div style={{ height: '100vh', overflowY: 'scroll' }}>
            <Box sx={{ flexGrow: 1 }} className="toolbar">
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
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={() => setConfirm(true)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
            {data.length === 0 ? <h2 style={{ paddingTop: '10px' }} >No previous captions...</h2> :
                <Grid container spacing={2} justifyContent="center" alignItems="flex-start" style={{ paddingTop: '10px', paddingLeft: '10px', paddingRight: '10px' }}>
                    {data.map((item, index) => (
                        <Grid item key={index} xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div
                                onClick={() => handleImageClick(item)}
                                className='gridImageContainer'
                            >
                                <img
                                    src={item.image}
                                    className='gridImage'
                                    alt={`Captioned Image ${index}`}
                                />
                            </div>
                        </Grid>
                    ))}
                </Grid> }
            <Modal
                open={Boolean(selectedImage)}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
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
            <Dialog
                open={confirm}
                onClose={() => null}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Deleting Caption History..."}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm(false)}>Cancel</Button>
                    <Button onClick={deleteCaptions} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CaptionHistory;