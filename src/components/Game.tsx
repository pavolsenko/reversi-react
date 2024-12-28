import { useEffect, useState, MouseEvent } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader } from '@mui/material';

import { Difficulty } from '../interfaces/game';
import { GameSettings } from './GameSettings';
import { GameTitle } from './GameTitle.tsx';
import { Grid } from './grid/Grid.tsx';
import { GameOverDialog } from './GameOverDialog.tsx';
import { useGame } from '../hooks/useGame';

import { appStyles } from '../styles';

export function Game() {
    const [isGameOverDialogOpen, setIsGameOverDialogOpen] =
        useState<boolean>(false);
    const {
        resetGame,
        isGameOver,
        currentPlayer,
        onWhiteMove,
        whiteCount,
        blackCount,
        board,
        difficulty,
        setDifficulty,
        isMoveInProgress,
    } = useGame();

    useEffect(() => {
        setIsGameOverDialogOpen(isGameOver);
    }, [isGameOver]);

    function onFieldClick(x: number, y: number) {
        onWhiteMove(x, y);
    }

    function onDialogClose() {
        setIsGameOverDialogOpen(false);
    }

    function onDifficultyChange(
        event: MouseEvent<HTMLElement>,
        difficulty: Difficulty,
    ) {
        event.preventDefault();
        setDifficulty(difficulty);
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
                        <Grid
                            board={board}
                            onFieldClick={onFieldClick}
                        />
                    </CardContent>
                    <CardActions>
                        <GameSettings
                            difficulty={difficulty}
                            onDifficultyChange={onDifficultyChange}
                            onResetClick={resetGame}
                            isMoveInProgress={isMoveInProgress}
                        />
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
