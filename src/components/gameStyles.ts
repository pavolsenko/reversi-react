import { SxProps, Theme } from '@mui/material';

export const gameSettingsStyles = (theme: Theme): SxProps => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: 1,
    flexDirection: 'row',

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: '10px',
    },
});
