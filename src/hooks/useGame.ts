import { useCallback, useEffect, useState } from 'react';
import { checkIsGameOver, countFields, getLegalMoves, getStartGame } from '../helpers/game';

import { BLACK, Difficulty, EMPTY, Field, Fields, LegalMove, Player, WHITE } from '../interfaces/game';

interface UseGame {
    resetGame: () => void;
    isGameOver: boolean;
    onMove: (player: Player, x: number, y: number) => void;
    currentPlayer: Player;
    whiteLegalMoves: LegalMove[];
    blackLegalMoves: LegalMove[];
    fields: Fields;
    whiteCount: number;
    blackCount: number;
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
}

export function useGame(): UseGame {
    const [fields, setFields] = useState<Field[][]>(getStartGame());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(WHITE);
    const [whiteCount, setWhiteCount] = useState<number>(2);
    const [blackCount, setBlackCount] = useState<number>(2);
    const [whiteLegalMoves, setWhiteLegalMoves] = useState<LegalMove[]>(getLegalMoves(fields, WHITE));
    const [blackLegalMoves, setBlackLegalMoves] = useState<LegalMove[]>(getLegalMoves(fields, BLACK));
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>(0);

    const onMove = useCallback(function (player: Player, x: number, y: number) {
        if (player !== currentPlayer) {
            return;
        }

        const gameField = fields[x][y];
        if (gameField.type !== EMPTY) {
            return;
        }

        let legalMoves: LegalMove[];

        if (player === WHITE) {
            legalMoves = whiteLegalMoves.filter(function (item: LegalMove) {
                return item.coordinates.x === x && item.coordinates.y === y;
            });
        } else {
            legalMoves = blackLegalMoves.filter(function (item: LegalMove) {
                return item.coordinates.x === x && item.coordinates.y === y;
            });
        }

        if (legalMoves.length === 0) {
            return;
        }

        setFields(() => {
            const newFields = [...fields];
            let checkX: number;
            let checkY: number;
            legalMoves.forEach(function(legalMove: LegalMove) {
                newFields[x][y] = { type: player };
                if (legalMove.direction === 'N') {
                    checkX = x;
                    checkY = y - 1;
                    while (checkY >= 0 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkY--;
                    }
                    return;
                }

                if (legalMove.direction === 'NE') {
                    checkX = x + 1;
                    checkY = y - 1;
                    while (checkY >= 0 && checkX < 8 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkX++;
                        checkY--;
                    }
                    return;
                }

                if (legalMove.direction === 'E') {
                    checkX = x + 1;
                    checkY = y;
                    while (checkX < 8 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkX++;
                    }
                    return;
                }

                if (legalMove.direction === 'SE') {
                    checkX = x + 1;
                    checkY = y + 1;
                    while (checkY < 8 && checkX < 8 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkX++;
                        checkY++;
                    }
                    return;
                }

                if (legalMove.direction === 'S') {
                    checkX = x;
                    checkY = y + 1;
                    while (checkY < 8 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkY++;
                    }
                    return;
                }

                if (legalMove.direction === 'SW') {
                    checkX = x - 1;
                    checkY = y + 1;
                    while (checkX >= 0 && checkY < 8 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkX--;
                        checkY++;
                    }
                    return;
                }

                if (legalMove.direction === 'W') {
                    checkX = x - 1;
                    checkY = y;
                    while (checkX >= 0 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkX--;
                    }
                    return;
                }

                if (legalMove.direction === 'NW') {
                    checkX = x - 1;
                    checkY = y - 1;
                    while (checkX >= 0 && checkY >= 0 && newFields[checkX][checkY].type !== EMPTY && newFields[checkX][checkY].type !== player) {
                        newFields[checkX][checkY].type = player;
                        checkX--;
                        checkY--;
                    }
                    return;
                }
            });

            const newWhiteLegalMoves = getLegalMoves(newFields, WHITE);
            const newBlackLegalMoves = getLegalMoves(newFields, BLACK);

            setWhiteLegalMoves(newWhiteLegalMoves);
            setBlackLegalMoves(newBlackLegalMoves);

            if (player === WHITE && newBlackLegalMoves.length > 0) {
                setCurrentPlayer(BLACK);
            }

            if (player === BLACK && newWhiteLegalMoves.length > 0) {
                setCurrentPlayer(WHITE);
            }

            return newFields;
        });
    }, [fields, currentPlayer, whiteLegalMoves, blackLegalMoves]);

    useEffect(() => {
        if (currentPlayer === WHITE) {
            return;
        }

        let blackMove: LegalMove | null = null;
        for (let i = 0; i < blackLegalMoves.length; i++) {
            const newMove = blackLegalMoves[i];

            if (newMove.coordinates.x === 0 && newMove.coordinates.y === 0) {
                blackMove = newMove;
                break;
            }

            if (newMove.coordinates.x === 7 && newMove.coordinates.y === 0) {
                blackMove = newMove;
                break;
            }

            if (newMove.coordinates.x === 0 && newMove.coordinates.y === 7) {
                blackMove = newMove;
                break;
            }

            if (newMove.coordinates.x === 7 && newMove.coordinates.y === 7) {
                blackMove = newMove;
                break;
            }

            if (newMove.coordinates.x === 0 || newMove.coordinates.y === 0 || newMove.coordinates.x === 7 || newMove.coordinates.y === 7) {
                blackMove = newMove;
                break;
            }
        }

        if (!blackMove) {
            blackMove = blackLegalMoves[Math.floor(Math.random() * blackLegalMoves.length)];
        }

        if (!blackMove) {
            setCurrentPlayer(WHITE);
            return;
        }

        setTimeout(function () {
            onMove(BLACK, blackMove.coordinates.x, blackMove.coordinates.y);
            if (whiteLegalMoves.length > 0) {
                setCurrentPlayer(WHITE);
            }
        }, 1000);

    }, [fields, blackLegalMoves, whiteLegalMoves.length, currentPlayer, onMove]);

    useEffect(() => {
        setWhiteCount(countFields(fields, WHITE));
        setBlackCount(countFields(fields, BLACK));
        setIsGameOver(checkIsGameOver(fields, whiteLegalMoves, blackLegalMoves));
    }, [fields, whiteLegalMoves, blackLegalMoves]);

    function resetGame() {
        const startGame = getStartGame();
        setIsGameOver(false);
        setFields(startGame);
        setCurrentPlayer(WHITE);
        setWhiteCount(2);
        setBlackCount(2);
        setWhiteLegalMoves(getLegalMoves(startGame, WHITE));
        setBlackLegalMoves(getLegalMoves(startGame, BLACK));
    }

    return {
        resetGame,
        isGameOver,
        onMove,
        whiteLegalMoves,
        blackLegalMoves,
        fields,
        whiteCount,
        blackCount,
        currentPlayer,
        difficulty,
        setDifficulty,
    };
}
