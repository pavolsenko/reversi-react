import { useCallback, useEffect, useState } from 'react';
import {
    applyMove,
    checkIsGameOver,
    countItemsOnBoard,
    findBestMove,
    getLegalMoves,
    getStartGame,
} from '../helpers/game';

import {
    BLACK,
    Difficulty,
    EMPTY,
    Board,
    Move,
    Player,
    WHITE,
} from '../interfaces/game';

interface UseGame {
    resetGame: () => void;
    isGameOver: boolean;
    onMove: (player: Player, x: number, y: number) => void;
    currentPlayer: Player;
    whiteLegalMoves: Move[];
    blackLegalMoves: Move[];
    board: Board;
    whiteCount: number;
    blackCount: number;
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
}

export function useGame(): UseGame {
    const [board, setBoard] = useState<Board>(getStartGame());
    const [currentPlayer, setCurrentPlayer] = useState<Player>(WHITE);
    const [whiteCount, setWhiteCount] = useState<number>(2);
    const [blackCount, setBlackCount] = useState<number>(2);
    const [whiteLegalMoves, setWhiteLegalMoves] = useState<Move[]>(
        getLegalMoves(board, WHITE),
    );
    const [blackLegalMoves, setBlackLegalMoves] = useState<Move[]>(
        getLegalMoves(board, BLACK),
    );
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>(0);

    const onMove = useCallback(
        function (player: Player, x: number, y: number) {
            if (player !== currentPlayer) {
                return;
            }

            const field = board[x][y];
            if (field.type !== EMPTY) {
                return;
            }

            let legalMoves: Move[];

            if (player === WHITE) {
                legalMoves = whiteLegalMoves.filter(function (item: Move) {
                    return item.coordinates.x === x && item.coordinates.y === y;
                });
            } else {
                legalMoves = blackLegalMoves.filter(function (item: Move) {
                    return item.coordinates.x === x && item.coordinates.y === y;
                });
            }

            if (legalMoves.length === 0) {
                return;
            }

            setBoard(() => {
                const newBoard = applyMove(board, player, legalMoves, x, y);

                const newWhiteLegalMoves = getLegalMoves(newBoard, WHITE);
                const newBlackLegalMoves = getLegalMoves(newBoard, BLACK);

                setWhiteLegalMoves(newWhiteLegalMoves);
                setBlackLegalMoves(newBlackLegalMoves);

                if (player === WHITE && newBlackLegalMoves.length > 0) {
                    setCurrentPlayer(BLACK);
                }

                if (player === BLACK && newWhiteLegalMoves.length > 0) {
                    setCurrentPlayer(WHITE);
                }

                return newBoard;
            });
        },
        [board, currentPlayer, whiteLegalMoves, blackLegalMoves],
    );

    useEffect(() => {
        if (currentPlayer === WHITE) {
            return;
        }

        const currentDifficulty = difficulty * 2 + 1;
        let blackMove = findBestMove(board, BLACK, currentDifficulty);

        if (!blackMove) {
            blackMove =
                blackLegalMoves[
                    Math.floor(Math.random() * blackLegalMoves.length)
                ];
        }

        setTimeout(function () {
            onMove(BLACK, blackMove.coordinates.x, blackMove.coordinates.y);
            if (whiteLegalMoves.length > 0) {
                setCurrentPlayer(WHITE);
            }
        }, 500);
    }, [
        board,
        blackLegalMoves,
        whiteLegalMoves.length,
        currentPlayer,
        onMove,
        difficulty,
    ]);

    useEffect(() => {
        setWhiteCount(countItemsOnBoard(board, WHITE));
        setBlackCount(countItemsOnBoard(board, BLACK));
        setIsGameOver(checkIsGameOver(board, whiteLegalMoves, blackLegalMoves));
    }, [board, whiteLegalMoves, blackLegalMoves]);

    function resetGame() {
        const startGame = getStartGame();
        setIsGameOver(false);
        setBoard(startGame);
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
        board,
        whiteCount,
        blackCount,
        currentPlayer,
        difficulty,
        setDifficulty,
    };
}
