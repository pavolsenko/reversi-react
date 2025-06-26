import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';

import { Board } from '@/interfaces/game';
import { GridItem } from '@/components/grid/GridItem';

import { gridStyles } from './gridStyles';

export interface GridProps {
    board: Board;
    onFieldClick: (x: number, y: number) => void;
}

export function Grid(props: GridProps) {
    const theme = useTheme();

    function onClick(x: number, y: number) {
        return function () {
            props.onFieldClick(x, y);
        };
    }

    function renderGridItems(): ReactNode[] {
        const result: ReactNode[] = [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                result.push(
                    <GridItem
                        key={'item' + x.toString() + y.toString()}
                        field={props.board[x][y]}
                        onClick={onClick(x, y)}
                    />,
                );
            }
        }

        return result;
    }

    return <Box sx={gridStyles(theme)}>{renderGridItems()}</Box>;
}
