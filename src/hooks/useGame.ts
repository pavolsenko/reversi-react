import { useCallback, useEffect, useState } from 'react';
import {
    applyMoveForPlayer,
    checkIsGameOver,
    countItemsOnBoard,
    findBestMoveForPlayer,
    getValidMovesForPlayer,
    getStartGame,
    getDifficultyDepth,
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
    onWhiteMove: (x: number, y: number) => void;
    currentPlayer: Player;
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
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>(0);
    const [isMoveInProgress, setIsMoveInProgress] = useState<boolean>(false);

    const onWhiteMove = useCallback(
        function (x: number, y: number) {
            if (currentPlayer === BLACK || isMoveInProgress) {
                return;
            }

            const field = board[x][y];
            if (field.type !== EMPTY) {
                return;
            }

            let legalMoves: Move[] = getValidMovesForPlayer(board, WHITE);

            if (legalMoves.length === 0) {
                setIsMoveInProgress(true);
                setCurrentPlayer(BLACK);
                return;
            }

            legalMoves = legalMoves.filter(function (item: Move) {
                return item.x === x && item.y === y;
            });

            if (legalMoves.length === 0) {
                return;
            }

            setBoard(() => {
                const newBoard = applyMoveForPlayer(board, WHITE, { x, y });
                const newBlackLegalMoves = getValidMovesForPlayer(
                    newBoard,
                    BLACK,
                );

                if (newBlackLegalMoves.length > 0) {
                    setIsMoveInProgress(true);
                    setCurrentPlayer(BLACK);
                }

                return newBoard;
            });
        },
        [board, currentPlayer, isMoveInProgress],
    );

    useEffect(() => {
        if (currentPlayer === WHITE) {
            return;
        }

        const blackLegalMoves = getValidMovesForPlayer(board, BLACK);

        if (blackLegalMoves.length === 0) {
            setCurrentPlayer(WHITE);
            setIsMoveInProgress(false);
            return;
        }

        setTimeout(function () {
            let blackMove: Move | null = findBestMoveForPlayer(
                board,
                BLACK,
                getDifficultyDepth(difficulty, whiteCount + blackCount),
            );

            if (!blackMove) {
                blackMove =
                    blackLegalMoves[
                        Math.floor(Math.random() * blackLegalMoves.length)
                    ];
            }
            setBoard((prevBoard: Board): Board => {
                const newBoard: Board = applyMoveForPlayer(
                    prevBoard,
                    BLACK,
                    blackMove,
                );
                setCurrentPlayer(WHITE);
                setIsMoveInProgress(false);
                return newBoard;
            });
        }, 100);
    }, [board, currentPlayer, difficulty, blackCount, whiteCount]);

    useEffect(() => {
        setWhiteCount(countItemsOnBoard(board, WHITE));
        setBlackCount(countItemsOnBoard(board, BLACK));
        setIsGameOver(checkIsGameOver(board));
    }, [board]);

    function resetGame() {
        setIsGameOver(false);
        setBoard(getStartGame());
        setCurrentPlayer(WHITE);
        setWhiteCount(2);
        setBlackCount(2);
    }

    return {
        resetGame,
        isGameOver,
        onWhiteMove,
        board,
        whiteCount,
        blackCount,
        currentPlayer,
        difficulty,
        setDifficulty,
    };
}
