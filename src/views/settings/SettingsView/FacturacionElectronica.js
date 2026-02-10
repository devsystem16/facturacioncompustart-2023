import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
    makeStyles,
    Typography
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {}
}));

const FacturacionElectronica = ({ className, ...rest }) => {
    const classes = useStyles();
    const [enabled, setEnabled] = useState(false);
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);

    const handleToggle = (event) => {
        setEnabled(event.target.checked);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <form
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Card>
                <CardHeader
                    subheader="Configura tu firma electrónica"
                    title="Facturación Electrónica"
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={enabled}
                                        onChange={handleToggle}
                                        name="facturacionElectronica"
                                        color="primary"
                                    />
                                }
                                label="Activar Facturación Electrónica"
                            />
                        </Grid>
                        {enabled && (
                            <>
                                <Grid item md={6} xs={12}>
                                    <Box display="flex" flexDirection="column">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color="default"
                                        >
                                            Subir Archivo .p12
                                            <input
                                                type="file"
                                                hidden
                                                accept=".p12"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {file && (
                                            <Box mt={1}>
                                                <Typography variant="body2">{file.name}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contraseña de Firma"
                                        name="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        value={password}
                                        variant="outlined"
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>
                <Divider />
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    p={2}
                >
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        Guardar
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

FacturacionElectronica.propTypes = {
    className: PropTypes.string
};

export default FacturacionElectronica;
