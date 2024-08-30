import { Box } from '@mui/material';

import { Field, FieldType } from '../../interfaces/game.ts';
import { blackGridItemStyles, gridItemWrapperItemStyles, whiteGridItemStyles } from './style.ts';
import { useCallback } from 'react';

export interface GridItemProps {
    field: Field;
    onClick: () => void;
}

export function GridItem(props: GridItemProps) {
    function onClick() {
        props.onClick();
    }

    const renderGridItem = useCallback(function() {
        if (props.field.type === FieldType.BLACK) {
            return (
                <Box sx={blackGridItemStyles}>
                    &nbsp;
                </Box>
            );
        }

        if (props.field.type === FieldType.WHITE) {
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
        <Box sx={gridItemWrapperItemStyles} onClick={onClick}>
            {renderGridItem()}
        </Box>
    );
}
