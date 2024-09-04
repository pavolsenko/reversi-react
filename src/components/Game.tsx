import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';

import { BLACK, Coordinates, EMPTY, Field, Player, WHITE } from '../interfaces/game.ts';
import { checkIsGameOver, countBlack, countWhite, getLegalMoves, getStartGame } from '../helpers/game.ts';
import { Grid } from './grid/Grid.tsx';
import { GameOverDialog } from './GameOverDialog.tsx';

import { appStyles } from '../styles.ts';

export function Game() {
    const [fields, setFields] = useState<Field[][]>(getStartGame());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(WHITE);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [whiteCount, setWhiteCount] = useState<number>(2);
    const [blackCount, setBlackCount] = useState<number>(2);
    const [whiteLegalMoves, setWhiteLegalMoves] = useState<Coordinates[]>(getLegalMoves(fields, WHITE));
    const [blackLegalMoves, setBlackLegalMoves] = useState<Coordinates[]>(getLegalMoves(fields, BLACK));

    function resetGame() {
        setFields(getStartGame());
        setCurrentPlayer(WHITE);
        setIsGameOver(false);
        setWhiteCount(2);
        setBlackCount(2);
    }

    function onFieldClick(x: number, y: number) {
        const gameField = fields[x][y];
        if (gameField.type !== EMPTY) {
            return;
        }

        if (currentPlayer === WHITE && !whiteLegalMoves.find((item: Coordinates) => item.x === x && item.y === y )) {
            return;
        }

        if (currentPlayer === BLACK && !blackLegalMoves.find((item: Coordinates) => item.x === x && item.y === y )) {
            return;
        }

        setFields(() => {
            const newFields = fields;
            newFields[x][y] = {type: currentPlayer};

            // change color of all applicable fields

            const newWhiteLegalMoves = getLegalMoves(newFields, WHITE);
            const newBlackLegalMoves = getLegalMoves(newFields, BLACK);

            setWhiteCount(countWhite(newFields));
            setBlackCount(countBlack(newFields));
            setIsGameOver(checkIsGameOver(newFields, newWhiteLegalMoves, newBlackLegalMoves));

            if (currentPlayer === WHITE && newBlackLegalMoves.length > 0) {
                setCurrentPlayer(BLACK);
            }

            if (currentPlayer === BLACK && newWhiteLegalMoves.length > 0) {
                setCurrentPlayer(WHITE);
            }

            setWhiteLegalMoves(getLegalMoves(fields, WHITE));
            setBlackLegalMoves(getLegalMoves(fields, BLACK));

            return newFields;
        });
    }

    function onDialogClose() {
        setIsGameOver(false);
    }

    function getSubHeader() {
        console.log('white', whiteLegalMoves);
        console.log('black', blackLegalMoves);
        return 'White ' + whiteCount + ':' + blackCount + ' Black | Next turn: ' + currentPlayer.toUpperCase();
    }

    return (
        <>
            <Box sx={appStyles}>
                <Card elevation={2}>
                    <CardHeader title={'Reversi'} subheader={getSubHeader()}/>
                    <CardContent>
                        <Grid fields={fields} onFieldClick={onFieldClick}/>
                    </CardContent>
                    <CardActions>
                        <Button onClick={resetGame}>Reset game</Button>
                    </CardActions>
                </Card>
            </Box>
            <GameOverDialog
                isGameOver={isGameOver}
                onCloseClick={onDialogClose}
                onResetClick={resetGame}
                whiteCount={whiteCount}
                blackCount={blackCount}
            />
        </>
    );
}
