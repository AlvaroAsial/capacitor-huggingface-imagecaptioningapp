import React, { useState } from 'react';
import { useDarkMode } from './DarkModeContext';
import { FormGroup, FormControlLabel, Grid, Switch, FormControl, InputLabel, NativeSelect} from '@mui/material';

const Settings: React.FC = () => {

    const [model, setModel] = useState('Salesforce BLIP - Large');
    const { darkMode, toggleDarkMode } = useDarkMode();  

    const handleModel = () => {

    }

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
        >
            <FormGroup>
                <FormControlLabel control={<Switch color="secondary" checked={darkMode} onChange={toggleDarkMode} />} label="Dark Mode" />
                <br></br>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native" className={darkMode ? 'dark' : 'light'}>
                        Model
                    </InputLabel>
                    <NativeSelect className={darkMode ? 'dark' : 'light'}
                        defaultValue={model}
                        inputProps={{
                            name: 'model',
                            id: 'uncontrolled-native',
                        }}
                    >
                        <option value={'Salesforce BLIP - Large'} className={darkMode ? 'dark' : 'light'} >'Salesforce BLIP - Large'</option>
                    </NativeSelect>
                </FormControl>
            </FormGroup>
        </Grid>
    );
};

export default Settings;