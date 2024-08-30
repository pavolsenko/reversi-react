import { SxProps } from '@mui/material';

export const gridStyles: SxProps = {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 60px)',
    gridTemplateRows: 'repeat(8, 60px)',
    gap: '5px',
    paddingTop: '20px',
}

export const gridItemWrapperItemStyles: SxProps = {
    backgroundColor: '#dddddd',
    cursor: 'pointer',
    padding: '5px',
};

export const blackGridItemStyles: SxProps = {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
};

export const whiteGridItemStyles: SxProps = {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
};
