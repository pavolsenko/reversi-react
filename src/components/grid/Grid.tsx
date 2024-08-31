import { ReactNode } from 'react';
import { Box } from '@mui/material';

import { Fields } from '../../interfaces/game.ts';
import { GridItem } from './GridItem.tsx';

import { gridStyles } from './style.ts';

export interface GridProps {
    fields: Fields;
    onFieldClick: (x: number, y: number) => void;
}

export function Grid(props: GridProps) {
    function onClick(x: number, y: number) {
        return function() {
            props.onFieldClick(x, y);
        };
    }

    function renderGridItems(): ReactNode[] {
        const result: ReactNode[] = [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                result.push(
                    <GridItem
                        key={'item' + y.toString() + x.toString()}
                        field={props.fields[x][y]}
                        onClick={onClick(x, y)}
                    />
                );
            }
        }

        return result;
    }

    return (
        <Box sx={gridStyles}>
            {renderGridItems()}
        </Box>
    );
}
