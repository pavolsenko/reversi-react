import { Box } from '@mui/material';

import { BLACK, Field, WHITE } from '../../interfaces/game';
import { blackGridItemStyles, gridItemWrapperItemStyles, whiteGridItemStyles } from './style';
import { useCallback } from 'react';

export interface GridItemProps {
    field: Field;
    onClick: () => void;
}

export function GridItem(props: GridItemProps) {
    const renderGridItem = useCallback(function() {
        if (props.field.type === BLACK) {
            return (
                <Box sx={blackGridItemStyles}>
                    &nbsp;
                </Box>
            );
        }

        if (props.field.type === WHITE) {
            return (
                <Box sx={whiteGridItemStyles}>
                    &nbsp;
                </Box>
            );
        }

        return (
            <Box>
                &nbsp;
            </Box>
        );
    }, [props.field]);



    return (
        <Box sx={gridItemWrapperItemStyles} onClick={props.onClick}>
            {renderGridItem()}
        </Box>
    );
}
