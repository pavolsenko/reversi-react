import { useCallback } from 'react';
import { Box } from '@mui/material';

import { BLACK, Field, WHITE } from '@/interfaces/game';

import {
    blackGridItemStyles,
    gridItemWrapperItemStyles,
    whiteGridItemStyles,
} from './gridStyles.ts';

export interface GridItemProps {
    field: Field;
    onClick: () => void;
}

export function GridItem(props: GridItemProps) {
    const renderGridItem = useCallback(
        function () {
            if (props.field === BLACK) {
                return <Box sx={blackGridItemStyles}>&nbsp;</Box>;
            }

            if (props.field === WHITE) {
                return <Box sx={whiteGridItemStyles}>&nbsp;</Box>;
            }

            return <Box>&nbsp;</Box>;
        },
        [props.field],
    );

    return (
        <Box
            sx={gridItemWrapperItemStyles}
            onClick={props.onClick}
        >
            {renderGridItem()}
        </Box>
    );
}
