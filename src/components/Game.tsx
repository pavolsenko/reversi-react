import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { basicGame2 } from '../helpers/__mocks__/fields';

import { BLACK, EMPTY, Field, LegalMove, Player, WHITE } from '../interfaces/game';
import { checkIsGameOver, countBlack, countWhite, getLegalMoves, getStartGame } from '../helpers/game';
import { Grid } from './grid/Grid.tsx';
import { GameOverDialog } from './GameOverDialog.tsx';

import { appStyles } from '../styles';

export function Game() {
    const [fields, setFields] = useState<Field[][]>(basicGame2);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(WHITE);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [whiteCount, setWhiteCount] = useState<number>(2);
    const [blackCount, setBlackCount] = useState<number>(2);
    const [whiteLegalMoves, setWhiteLegalMoves] = useState<LegalMove[]>(getLegalMoves(fields, WHITE));
    const [blackLegalMoves, setBlackLegalMoves] = useState<LegalMove[]>(getLegalMoves(fields, BLACK));

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

        const whiteMoves: LegalMove[] = whiteLegalMoves.filter(function(item: LegalMove) {
            return item.coordinates.x === x && item.coordinates.y === y;
        });
        if (currentPlayer === WHITE && whiteMoves.length === 0) {
            return;
        }

        const blackMoves: LegalMove[] = blackLegalMoves.filter(function(item: LegalMove) {
            return item.coordinates.x === x && item.coordinates.y === y;
        });
        if (currentPlayer === BLACK && blackMoves.length === 0) {
            return;
        }

        setFields(() => {
            const newFields = fields;
            let checkX: number;
            let checkY: number;
            newFields[x][y] = {type: currentPlayer};

            const legalMoves = currentPlayer === WHITE ? whiteMoves : blackMoves;

            legalMoves.forEach(function(legalMove: LegalMove) {
                if (legalMove.direction === 'N') {
                    checkX = x;
                    checkY = y - 1;
                    while (checkY >= 0 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkY--;
                    }
                    return;
                }

                if (legalMove.direction === 'NE') {
                    checkX = x + 1;
                    checkY = y - 1;
                    while (checkY >= 0 && checkX < 8 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkX++;
                        checkY--;
                    }
                    return;
                }

                if (legalMove.direction === 'E') {
                    checkX = x + 1;
                    checkY = y;
                    while (checkX < 8 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkX++;
                    }
                    return;
                }

                if (legalMove.direction === 'SE') {
                    checkX = x + 1;
                    checkY = y + 1;
                    while (checkY < 8 && checkX < 8 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkX++;
                        checkY++;
                    }
                    return;
                }

                if (legalMove.direction === 'S') {
                    checkX = x;
                    checkY = y + 1;
                    while (checkY < 8 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkY++;
                    }
                    return;
                }

                if (legalMove.direction === 'SW') {
                    checkX = x - 1;
                    checkY = y + 1;
                    while (checkX >= 0 && checkY < 8 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkX--;
                        checkY++;
                    }
                    return;
                }

                if (legalMove.direction === 'W') {
                    checkX = x - 1;
                    checkY = y;
                    while (checkX >= 0 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkX--;
                    }
                    return;
                }

                if (legalMove.direction === 'NW') {
                    checkX = x - 1;
                    checkY = y - 1;
                    while (checkX >= 0 && checkY >= 0 && newFields[checkX][checkY].type !== 'empty' && newFields[checkX][checkY].type !== currentPlayer) {
                        newFields[checkX][checkY].type = currentPlayer;
                        checkX--;
                        checkY--;
                    }
                    return;
                }
            });

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
