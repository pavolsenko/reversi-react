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

export const cardStyles: SxProps = {
    position: 'relative',
};

export const gameProgressStyles: SxProps = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
};

export const appStyles: SxProps = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50px',
};
