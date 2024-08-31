import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';

import { Field, FieldType } from '../interfaces/game.ts';
import { checkIsGameOver, countBlack, countWhite, getStartGame } from '../helpers/game.ts';
import { Grid } from './grid/Grid.tsx';
import { GameOverDialog } from './GameOverDialog.tsx';
import { appStyles } from '../styles.ts';

export function Game() {
    const [fields, setFields] = useState<Field[][]>(getStartGame());
    const [currentPlayer, setCurrentPlayer] = useState<FieldType>(FieldType.WHITE);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [whiteCount, setWhiteCount] = useState<number>(2);
    const [blackCount, setBlackCount] = useState<number>(2);

    function resetGame() {
        setFields(getStartGame());
        setCurrentPlayer(FieldType.WHITE);
        setIsGameOver(false);
        setWhiteCount(2);
        setBlackCount(2);
    }

    function togglePlayer() {
        if (currentPlayer === FieldType.WHITE) {
            setCurrentPlayer(FieldType.BLACK);
        }

        if (currentPlayer === FieldType.BLACK) {
            setCurrentPlayer(FieldType.WHITE);
        }
    }

    function onFieldClick(x: number, y: number) {
        const gameField = fields[x][y];
        if (gameField.type !== FieldType.EMPTY) {
            return;
        }

        setFields(() => {
            const newFields = fields;
            newFields[x][y] = {type: currentPlayer};

            setWhiteCount(countWhite(newFields));
            setBlackCount(countBlack(newFields));
            setIsGameOver(checkIsGameOver(newFields));

            return newFields;
        });

        togglePlayer();
    }

    function onModalClose() {
        setIsGameOver(false);
    }

    function getSubHeader() {
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
                onCloseClick={onModalClose}
                onResetClick={resetGame}
                whiteCount={whiteCount}
                blackCount={blackCount}
            />
        </>
    );
}
