import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
} from '@mui/material';

import { WHITE } from '../interfaces/game';
import { GameTitle } from './GameTitle.tsx';
import { Grid } from './grid/Grid.tsx';
import { GameOverDialog } from './GameOverDialog.tsx';
import { useGame } from '../hooks/useGame';

import { appStyles } from '../styles';

export function Game() {
    const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState<boolean>(false);
    const {
        resetGame,
        isGameOver,
        currentPlayer,
        onMove,
        whiteCount,
        blackCount,
        fields,
    } = useGame();

    useEffect(() => {
        setIsGameOverDialogOpen(isGameOver);
    }, [isGameOver]);

    function onFieldClick(x: number, y: number) {
        onMove(WHITE, x, y);
    }

    function onDialogClose() {
        setIsGameOverDialogOpen(false);
    }

    return (
        <>
            <Box sx={appStyles}>
                <Card elevation={2}>
                    <CardHeader
                        title={'Reversi'}
                        subheader={
                            <GameTitle
                                currentPlayer={currentPlayer}
                                isGameOver={isGameOver}
                                whiteCount={whiteCount}
                                blackCount={blackCount}
                            />
                        }
                    />
                    <CardContent>
                        <Grid fields={fields} onFieldClick={onFieldClick}/>
                    </CardContent>
                    <CardActions>
                        <Button onClick={resetGame} variant={'outlined'} sx={{m: 1}}>Reset game</Button>
                    </CardActions>
                </Card>
            </Box>
            <GameOverDialog
                isGameOver={isGameOverDialogOpen}
                onCloseClick={onDialogClose}
                onResetClick={resetGame}
                whiteCount={whiteCount}
                blackCount={blackCount}
            />
        </>
    );
}
