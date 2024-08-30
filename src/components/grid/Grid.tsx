import { ReactNode, useCallback } from 'react';
import { Box } from '@mui/material';

import { Field, Fields } from '../../interfaces/game.ts';
import { GridItem } from './GridItem.tsx';

import { gridStyles } from './style.ts';

export interface GridProps {
    fields: Fields;
}

export function Grid(props: GridProps) {
    const renderGridItems = useCallback(function(): ReactNode[] {
            const result: ReactNode[] = [];

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    result.push(
                        <GridItem
                            key={'item' + y.toString() + x.toString()}
                            field={props.fields.getIn([x, y]) as Field} onClick={() => {}}
                        />
                    );
                }
            }

            return result;
        },
        [props.fields]
    );

    return (
        <Box sx={gridStyles}>
            {renderGridItems()}
        </Box>
    );
}
